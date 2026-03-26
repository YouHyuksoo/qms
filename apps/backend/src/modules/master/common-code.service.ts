/**
 * @file common-code.service.ts
 * @description 공통코드(CommonCode) 서비스
 *
 * 공통코드 CRUD 비즈니스 로직을 처리합니다.
 * 복합키(codeGroup + codeValue) 기반으로 동작합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - findCodesByGroup: 특정 그룹의 공통코드 목록 조회 (정렬 순서대로)
 * - create: 복합키 중복 체크 후 생성
 * - update: codeGroup + codeValue로 찾아 수정
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateCommonCodeDto,
  UpdateCommonCodeDto,
} from './dto/common-code.dto';

/**
 * 공통코드 서비스
 */
@Injectable()
export class CommonCodeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 공통코드 생성
   */
  async create(dto: CreateCommonCodeDto) {
    const existing = await this.prisma.commonCode.findFirst({
      where: {
        codeGroup: dto.codeGroup,
        codeValue: dto.codeValue,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        `CommonCode '${dto.codeGroup}/${dto.codeValue}' already exists`,
      );
    }

    return this.prisma.commonCode.create({ data: { ...dto } });
  }

  /**
   * 그룹별 공통코드 조회
   *
   * 지정한 그룹에 속한 활성 코드를 정렬 순서(sortOrder)대로 반환합니다.
   */
  async findCodesByGroup(group: string) {
    return this.prisma.commonCode.findMany({
      where: { codeGroup: group, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * 공통코드 수정
   */
  async update(
    codeGroup: string,
    codeValue: string,
    dto: UpdateCommonCodeDto,
  ) {
    const code = await this.prisma.commonCode.findFirst({
      where: { codeGroup, codeValue, deletedAt: null },
    });

    if (!code) {
      throw new NotFoundException(
        `CommonCode '${codeGroup}/${codeValue}' not found`,
      );
    }

    return this.prisma.commonCode.update({
      where: { id: code.id },
      data: { ...dto },
    });
  }
}
