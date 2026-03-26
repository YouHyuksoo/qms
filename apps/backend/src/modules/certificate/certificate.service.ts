/**
 * @file certificate.service.ts
 * @description 검사성적서 관리 서비스
 *
 * 검사성적서(Inspection Certificate)의 CRUD, 발행, 재발행, 이력 조회와
 * 템플릿 관리 기능을 제공합니다. Prisma를 사용하여 DB에 접근합니다.
 *
 * 주요 비즈니스 로직:
 * - 성적서 생성 시 DRAFT 상태로 시작
 * - issue() 호출 시 ISSUED 상태로 변경
 * - reissue() 호출 시 version+1, REISSUED 상태로 변경
 * - 소프트 삭제 적용
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CertificateStatus } from './entities/inspection-certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CertificateQueryDto } from './dto/certificate-query.dto';
import {
  IssueCertificateDto,
  ReissueCertificateDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  CertificateHistoryQueryDto,
} from './dto/certificate-action.dto';

/**
 * 검사성적서 관리 서비스
 */
@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 검사성적서 생성
   */
  async createCertificate(dto: CreateCertificateDto) {
    const existing = await this.prisma.inspectionCertificate.findFirst({
      where: { certificateId: dto.certificateId },
    });

    if (existing) {
      throw new ConflictException(`Certificate with ID '${dto.certificateId}' already exists`);
    }

    const existingNo = await this.prisma.inspectionCertificate.findFirst({
      where: { certificateNo: dto.certificateNo },
    });

    if (existingNo) {
      throw new ConflictException(`Certificate with number '${dto.certificateNo}' already exists`);
    }

    return this.prisma.inspectionCertificate.create({
      data: {
        ...dto,
        status: CertificateStatus.DRAFT,
        version: 1,
      },
    });
  }

  /**
   * 검사성적서 목록 조회 (필터 + 페이지네이션)
   */
  async findAllCertificates(query: CertificateQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'issueDate',
      sortOrder = 'DESC',
      certificateNo,
      certificateType,
      customerCode,
      itemCode,
      status,
      issueDateFrom,
      issueDateTo,
    } = query;

    const where: Record<string, unknown> = { deletedAt: null };

    if (certificateNo) {
      where.certificateNo = { contains: certificateNo };
    }
    if (certificateType) {
      where.certificateType = certificateType;
    }
    if (customerCode) {
      where.customerCode = { contains: customerCode };
    }
    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }
    if (status) {
      where.status = status;
    }
    if (issueDateFrom || issueDateTo) {
      where.issueDate = {
        ...(issueDateFrom ? { gte: new Date(issueDateFrom) } : {}),
        ...(issueDateTo ? { lte: new Date(issueDateTo) } : {}),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.inspectionCertificate.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.inspectionCertificate.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 검사성적서 단건 조회
   */
  async findOneCertificate(certificateId: string) {
    const certificate = await this.prisma.inspectionCertificate.findFirst({
      where: { certificateId, deletedAt: null },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID '${certificateId}' not found`);
    }

    return certificate;
  }

  /**
   * 검사성적서 수정
   */
  async updateCertificate(certificateId: string, dto: UpdateCertificateDto) {
    const certificate = await this.findOneCertificate(certificateId);

    return this.prisma.inspectionCertificate.update({
      where: { id: certificate.id },
      data: { ...dto },
    });
  }

  /**
   * 검사성적서 소프트 삭제
   */
  async deleteCertificate(certificateId: string, deletedBy?: string): Promise<void> {
    const certificate = await this.findOneCertificate(certificateId);

    await this.prisma.inspectionCertificate.update({
      where: { id: certificate.id },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 성적서 발행 (DRAFT -> ISSUED)
   */
  async issueCertificate(certificateId: string, dto: IssueCertificateDto) {
    const certificate = await this.findOneCertificate(certificateId);

    if (certificate.status !== CertificateStatus.DRAFT) {
      throw new ConflictException(
        `Certificate can only be issued from DRAFT status. Current: ${certificate.status}`,
      );
    }

    return this.prisma.inspectionCertificate.update({
      where: { id: certificate.id },
      data: {
        status: CertificateStatus.ISSUED,
        issueDate: new Date(),
        ...(dto.issuedBy ? { issuedBy: dto.issuedBy } : {}),
      },
    });
  }

  /**
   * 성적서 재발행 (version+1, REISSUED)
   */
  async reissueCertificate(certificateId: string, dto: ReissueCertificateDto) {
    const certificate = await this.findOneCertificate(certificateId);

    if (
      certificate.status !== CertificateStatus.ISSUED &&
      certificate.status !== CertificateStatus.REISSUED
    ) {
      throw new ConflictException(
        `Certificate can only be reissued from ISSUED or REISSUED status. Current: ${certificate.status}`,
      );
    }

    return this.prisma.inspectionCertificate.update({
      where: { id: certificate.id },
      data: {
        status: CertificateStatus.REISSUED,
        version: certificate.version + 1,
        reissueReason: dto.reissueReason,
        issueDate: new Date(),
        ...(dto.issuedBy ? { issuedBy: dto.issuedBy } : {}),
      },
    });
  }

  /**
   * 발행 이력 조회
   */
  async findCertificateHistory(query: CertificateHistoryQueryDto) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.certificateNo) {
      where.certificateNo = { contains: query.certificateNo };
    }
    if (query.itemCode) {
      where.itemCode = { contains: query.itemCode };
    }
    if (query.customerCode) {
      where.customerCode = { contains: query.customerCode };
    }

    return this.prisma.inspectionCertificate.findMany({
      where,
      orderBy: [{ certificateNo: 'asc' }, { version: 'desc' }],
    });
  }

  /**
   * 템플릿 목록 조회
   */
  async findAllTemplates() {
    return this.prisma.certificateTemplate.findMany({
      where: { isActive: true },
      orderBy: { templateName: 'asc' },
    });
  }

  /**
   * 템플릿 생성
   */
  async createTemplate(dto: CreateTemplateDto) {
    const existing = await this.prisma.certificateTemplate.findFirst({
      where: { templateId: dto.templateId },
    });

    if (existing) {
      throw new ConflictException(`Template with ID '${dto.templateId}' already exists`);
    }

    return this.prisma.certificateTemplate.create({
      data: {
        ...dto,
        isActive: true,
      },
    });
  }

  /**
   * 템플릿 수정
   */
  async updateTemplate(templateId: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.certificateTemplate.findFirst({
      where: { templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID '${templateId}' not found`);
    }

    return this.prisma.certificateTemplate.update({
      where: { id: template.id },
      data: { ...dto },
    });
  }
}
