/**
 * @file master.controller.ts
 * @description 기준정보 관리 컨트롤러
 *
 * 고객사, 품번, 공정, 공통코드의 CRUD 엔드포인트를 제공합니다.
 * 모든 엔드포인트는 'master' 프리픽스 아래에 위치합니다.
 *
 * 초보자 가이드:
 * - /master/customers: 고객사 관리 (CRUD)
 * - /master/items: 품번 관리 (CRUD)
 * - /master/processes: 공정 관리 (CRUD)
 * - /master/codes: 공통코드 관리 (그룹별 조회, 생성, 수정)
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
import { CustomerService } from './customer.service';
import { ItemService } from './item.service';
import { ProcessInfoService } from './process-info.service';
import { CommonCodeService } from './common-code.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
} from './dto/customer.dto';
import { CreateItemDto, UpdateItemDto, ItemQueryDto } from './dto/item.dto';
import {
  CreateProcessInfoDto,
  UpdateProcessInfoDto,
  ProcessInfoQueryDto,
} from './dto/process-info.dto';
import {
  CreateCommonCodeDto,
  UpdateCommonCodeDto,
} from './dto/common-code.dto';

/**
 * 기준정보 관리 컨트롤러
 */
@ApiTags('Master Data')
@Controller('master')
export class MasterController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly itemService: ItemService,
    private readonly processInfoService: ProcessInfoService,
    private readonly commonCodeService: CommonCodeService,
  ) {}

  // ─── 고객사 (Customers) ───

  /** 고객사 생성 */
  @Post('customers')
  @ApiOperation({ summary: '고객사 생성', description: '새로운 고객사를 등록합니다.' })
  @ApiResponse({ status: 201, description: '고객사 생성 성공' })
  @ApiResponse({ status: 409, description: '중복된 고객 코드' })
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  /** 고객사 목록 조회 */
  @Get('customers')
  @ApiOperation({ summary: '고객사 목록 조회', description: '검색 및 필터링이 적용된 고객사 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '고객사 목록 조회 성공' })
  async findAllCustomers(@Query() query: CustomerQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.customerService.findAll(query);
  }

  /** 고객사 단건 조회 */
  @Get('customers/:code')
  @ApiOperation({ summary: '고객사 상세 조회' })
  @ApiParam({ name: 'code', description: '고객 코드', example: 'CUST-001' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '고객사를 찾을 수 없음' })
  async findOneCustomer(@Param('code') code: string) {
    return this.customerService.findOne(code);
  }

  /** 고객사 수정 */
  @Put('customers/:code')
  @ApiOperation({ summary: '고객사 수정' })
  @ApiParam({ name: 'code', description: '고객 코드' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '고객사를 찾을 수 없음' })
  async updateCustomer(
    @Param('code') code: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.update(code, dto);
  }

  /** 고객사 삭제 (소프트 삭제) */
  @Delete('customers/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 삭제' })
  @ApiParam({ name: 'code', description: '고객 코드' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '고객사를 찾을 수 없음' })
  async deleteCustomer(
    @Param('code') code: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.customerService.remove(code, deletedBy);
  }

  // ─── 품번 (Items) ───

  /** 품번 생성 */
  @Post('items')
  @ApiOperation({ summary: '품번 생성', description: '새로운 품번을 등록합니다.' })
  @ApiResponse({ status: 201, description: '품번 생성 성공' })
  @ApiResponse({ status: 409, description: '중복된 품번 코드' })
  async createItem(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  /** 품번 목록 조회 */
  @Get('items')
  @ApiOperation({ summary: '품번 목록 조회', description: '검색 및 필터링이 적용된 품번 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '품번 목록 조회 성공' })
  async findAllItems(@Query() query: ItemQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.itemService.findAll(query);
  }

  /** 품번 단건 조회 */
  @Get('items/:code')
  @ApiOperation({ summary: '품번 상세 조회' })
  @ApiParam({ name: 'code', description: '품번 코드', example: 'ITEM-001' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '품번을 찾을 수 없음' })
  async findOneItem(@Param('code') code: string) {
    return this.itemService.findOne(code);
  }

  /** 품번 수정 */
  @Put('items/:code')
  @ApiOperation({ summary: '품번 수정' })
  @ApiParam({ name: 'code', description: '품번 코드' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '품번을 찾을 수 없음' })
  async updateItem(
    @Param('code') code: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemService.update(code, dto);
  }

  /** 품번 삭제 (소프트 삭제) */
  @Delete('items/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '품번 삭제' })
  @ApiParam({ name: 'code', description: '품번 코드' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '품번을 찾을 수 없음' })
  async deleteItem(
    @Param('code') code: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.itemService.remove(code, deletedBy);
  }

  // ─── 공정 (Processes) ───

  /** 공정 생성 */
  @Post('processes')
  @ApiOperation({ summary: '공정 생성', description: '새로운 공정을 등록합니다.' })
  @ApiResponse({ status: 201, description: '공정 생성 성공' })
  @ApiResponse({ status: 409, description: '중복된 공정 코드' })
  async createProcess(@Body() dto: CreateProcessInfoDto) {
    return this.processInfoService.create(dto);
  }

  /** 공정 목록 조회 */
  @Get('processes')
  @ApiOperation({ summary: '공정 목록 조회', description: '검색 및 필터링이 적용된 공정 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '공정 목록 조회 성공' })
  async findAllProcesses(@Query() query: ProcessInfoQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.processInfoService.findAll(query);
  }

  /** 공정 단건 조회 */
  @Get('processes/:code')
  @ApiOperation({ summary: '공정 상세 조회' })
  @ApiParam({ name: 'code', description: '공정 코드', example: 'PROC-001' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '공정을 찾을 수 없음' })
  async findOneProcess(@Param('code') code: string) {
    return this.processInfoService.findOne(code);
  }

  /** 공정 수정 */
  @Put('processes/:code')
  @ApiOperation({ summary: '공정 수정' })
  @ApiParam({ name: 'code', description: '공정 코드' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '공정을 찾을 수 없음' })
  async updateProcess(
    @Param('code') code: string,
    @Body() dto: UpdateProcessInfoDto,
  ) {
    return this.processInfoService.update(code, dto);
  }

  /** 공정 삭제 (소프트 삭제) */
  @Delete('processes/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '공정 삭제' })
  @ApiParam({ name: 'code', description: '공정 코드' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '공정을 찾을 수 없음' })
  async deleteProcess(
    @Param('code') code: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.processInfoService.remove(code, deletedBy);
  }

  // ─── 공통코드 (Common Codes) ───

  /** 그룹별 공통코드 조회 */
  @Get('codes/:group')
  @ApiOperation({ summary: '그룹별 공통코드 조회', description: '특정 그룹의 활성 공통코드를 정렬 순서대로 조회합니다.' })
  @ApiParam({ name: 'group', description: '코드 그룹', example: 'DEFECT_TYPE' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  async findCodesByGroup(
    @Param('group') group: string,
  ) {
    return this.commonCodeService.findCodesByGroup(group);
  }

  /** 공통코드 생성 */
  @Post('codes')
  @ApiOperation({ summary: '공통코드 생성', description: '새로운 공통코드를 등록합니다.' })
  @ApiResponse({ status: 201, description: '공통코드 생성 성공' })
  @ApiResponse({ status: 409, description: '중복된 공통코드' })
  async createCommonCode(
    @Body() dto: CreateCommonCodeDto,
  ) {
    return this.commonCodeService.create(dto);
  }

  /** 공통코드 수정 */
  @Put('codes/:group/:value')
  @ApiOperation({ summary: '공통코드 수정' })
  @ApiParam({ name: 'group', description: '코드 그룹', example: 'DEFECT_TYPE' })
  @ApiParam({ name: 'value', description: '코드 값', example: 'SCRATCH' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '공통코드를 찾을 수 없음' })
  async updateCommonCode(
    @Param('group') group: string,
    @Param('value') value: string,
    @Body() dto: UpdateCommonCodeDto,
  ) {
    return this.commonCodeService.update(group, value, dto);
  }
}
