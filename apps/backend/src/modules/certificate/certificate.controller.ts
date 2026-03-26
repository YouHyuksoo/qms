/**
 * @file certificate.controller.ts
 * @description 검사성적서 관리 컨트롤러
 *
 * 검사성적서(Inspection Certificate) REST API 엔드포인트를 제공합니다.
 *
 * 엔드포인트 목록:
 * - POST   /certificates              성적서 생성
 * - GET    /certificates              목록 조회 (필터/페이지네이션)
 * - GET    /certificates/templates    템플릿 목록
 * - POST   /certificates/templates    템플릿 생성
 * - GET    /certificates/history      발행 이력
 * - GET    /certificates/:id          상세 조회
 * - PUT    /certificates/:id          수정
 * - DELETE /certificates/:id          소프트 삭제
 * - POST   /certificates/:id/issue    발행
 * - POST   /certificates/:id/reissue  재발행
 * - PUT    /certificates/templates/:templateId  템플릿 수정
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CertificateService } from './certificate.service';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
  CertificateQueryDto,
  IssueCertificateDto,
  ReissueCertificateDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  CertificateHistoryQueryDto,
} from './dto';

/**
 * 검사성적서 관리 컨트롤러
 */
@ApiTags('Certificate')
@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  /**
   * 검사성적서 생성
   */
  @Post()
  @ApiOperation({
    summary: '성적서 생성',
    description: '새로운 검사성적서를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '성적서가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 성적서 ID 또는 번호' })
  async createCertificate(
    @Body() dto: CreateCertificateDto,
  ) {
    return this.certificateService.createCertificate(dto);
  }

  /**
   * 검사성적서 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '성적서 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 성적서 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성적서 목록 조회 성공',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/InspectionCertificate' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllCertificates(@Query() query: CertificateQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.certificateService.findAllCertificates(query);
  }

  /**
   * 템플릿 목록 조회
   */
  @Get('templates')
  @ApiOperation({
    summary: '템플릿 목록 조회',
    description: '활성화된 성적서 템플릿 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '템플릿 목록 조회 성공',
  })
  async findAllTemplates() {
    return this.certificateService.findAllTemplates();
  }

  /**
   * 템플릿 생성
   */
  @Post('templates')
  @ApiOperation({
    summary: '템플릿 생성',
    description: '새로운 성적서 템플릿을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '템플릿이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 템플릿 ID' })
  async createTemplate(
    @Body() dto: CreateTemplateDto,
  ) {
    return this.certificateService.createTemplate(dto);
  }

  /**
   * 발행 이력 조회
   */
  @Get('history')
  @ApiOperation({
    summary: '발행 이력 조회',
    description: '성적서 발행 이력을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '발행 이력 조회 성공',
  })
  async findCertificateHistory(
    @Query() query: CertificateHistoryQueryDto,
  ) {
    return this.certificateService.findCertificateHistory(query);
  }

  /**
   * 검사성적서 단건 조회
   */
  @Get(':certificateId')
  @ApiOperation({
    summary: '성적서 상세 조회',
    description: '특정 검사성적서의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'certificateId',
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '성적서 조회 성공',
  })
  @ApiResponse({ status: 404, description: '성적서를 찾을 수 없음' })
  async findOneCertificate(
    @Param('certificateId') certificateId: string,
  ) {
    return this.certificateService.findOneCertificate(certificateId);
  }

  /**
   * 검사성적서 수정
   */
  @Put(':certificateId')
  @ApiOperation({
    summary: '성적서 수정',
    description: '기존 검사성적서의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'certificateId',
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '성적서 수정 성공',
  })
  @ApiResponse({ status: 404, description: '성적서를 찾을 수 없음' })
  async updateCertificate(
    @Param('certificateId') certificateId: string,
    @Body() dto: UpdateCertificateDto,
  ) {
    return this.certificateService.updateCertificate(certificateId, dto);
  }

  /**
   * 검사성적서 소프트 삭제
   */
  @Delete(':certificateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '성적서 삭제',
    description: '검사성적서를 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'certificateId',
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @ApiResponse({ status: 204, description: '성적서 삭제 성공' })
  @ApiResponse({ status: 404, description: '성적서를 찾을 수 없음' })
  async deleteCertificate(
    @Param('certificateId') certificateId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.certificateService.deleteCertificate(certificateId, deletedBy);
  }

  /**
   * 성적서 발행
   */
  @Post(':certificateId/issue')
  @ApiOperation({
    summary: '성적서 발행',
    description: '성적서를 ISSUED 상태로 변경합니다.',
  })
  @ApiParam({
    name: 'certificateId',
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '성적서 발행 성공',
  })
  @ApiResponse({ status: 404, description: '성적서를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: 'DRAFT 상태가 아닌 성적서' })
  async issueCertificate(
    @Param('certificateId') certificateId: string,
    @Body() dto: IssueCertificateDto,
  ) {
    return this.certificateService.issueCertificate(certificateId, dto);
  }

  /**
   * 성적서 재발행
   */
  @Post(':certificateId/reissue')
  @ApiOperation({
    summary: '성적서 재발행',
    description: '성적서를 재발행합니다. 버전이 1 증가하고 REISSUED 상태로 변경됩니다.',
  })
  @ApiParam({
    name: 'certificateId',
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '성적서 재발행 성공',
  })
  @ApiResponse({ status: 404, description: '성적서를 찾을 수 없음' })
  @ApiResponse({
    status: 409,
    description: 'ISSUED 또는 REISSUED 상태가 아닌 성적서',
  })
  async reissueCertificate(
    @Param('certificateId') certificateId: string,
    @Body() dto: ReissueCertificateDto,
  ) {
    return this.certificateService.reissueCertificate(certificateId, dto);
  }

  /**
   * 템플릿 수정
   */
  @Put('templates/:templateId')
  @ApiOperation({
    summary: '템플릿 수정',
    description: '기존 성적서 템플릿을 수정합니다.',
  })
  @ApiParam({
    name: 'templateId',
    description: '템플릿 ID',
    example: 'TMPL-001',
  })
  @ApiResponse({
    status: 200,
    description: '템플릿 수정 성공',
  })
  @ApiResponse({ status: 404, description: '템플릿을 찾을 수 없음' })
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.certificateService.updateTemplate(templateId, dto);
  }
}
