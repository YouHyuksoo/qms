# QMS 개발 가이드 (Development Guide)
## HANES 프로젝트 표준 기반

**버전:** 1.0  
**작성일:** 2026-03-19  
**참고:** HANES MES 프로젝트 표준

---

## 1. 개발 환경 설정

### 1.1 패키지 매니저

```bash
# pnpm 전용 (npm 사용 금지)
pnpm --version  # 10.28.1 이상 확인

# 주요 명령어
pnpm install    # 의존성 설치
pnpm dev        # 개발 서버 실행
pnpm build      # 빌드
pnpm lint       # 린트 검사
pnpm test       # 테스트
```

### 1.2 모노레포 구조

```
qms/
├── apps/
│   ├── backend/           # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── modules/   # 기능별 모듈
│   │   │   ├── common/    # 공통 유틸리티
│   │   │   └── main.ts
│   │   └── package.json
│   └── frontend/          # Next.js 프론트엔드
│       ├── src/
│       │   ├── app/       # App Router
│       │   ├── components/# 공통 컴포넌트
│       │   └── lib/       # 유틸리티
│       └── package.json
├── packages/
│   └── shared/            # 공유 패키지
│       ├── types/         # 공통 타입
│       ├── enums/         # 열거형
│       ├── dto/           # DTO 정의
│       └── utils/         # 공통 함수
├── turbo.json             # Turborepo 설정
└── pnpm-workspace.yaml    # pnpm 워크스페이스
```

### 1.3 Turborepo 설정

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"],
      "outputs": ["coverage/**"]
    }
  }
}
```

---

## 2. 데이터베이스 규칙

### 2.1 기본 원칙

- **Oracle DB 사용** — PostgreSQL/MySQL 아님
- DDL 실행은 반드시 DBA 또는 승인된 프로세스로 실행
- 컬럼 타입 변경(NVARCHAR2 등)은 **사용자 승인 없이 절대 금지**
- 스키마 변경 시 반드시 마이그레이션 파일 작성

### 2.2 엔티티 작성 규칙

```typescript
// ❌ 금지: @PrimaryGeneratedColumn
@PrimaryGeneratedColumn()
id: number;

// ✅ 사용: @PrimaryColumn (자연키/복합키)
@PrimaryColumn({ name: 'NCR_NO', length: 20 })
ncrNo: string;

// 복합키 예시
@PrimaryColumn({ name: 'COMPANY_CD', length: 10 })
companyCd: string;

@PrimaryColumn({ name: 'NCR_NO', length: 20 })
ncrNo: string;
```

### 2.3 PK 우선순위

1. **자연키** (비즈니스 키) — 권장
2. **부모FK + seq** — 복합키
3. **비즈니스일자 + seq** — 일자 기반
4. **채번(PKG_SEQ_GENERATOR)** — 시퀀스 사용 시

### 2.4 컬럼 네이밍

```typescript
// 모든 컬럼에 name 명시 (Oracle UPPER_SNAKE_CASE)
@Column({ name: 'INSPECTION_DATE', type: 'date' })
inspectionDate: Date;

@Column({ name: 'JUDGMENT_RESULT', length: 10 })
judgmentResult: string;

@Column({ name: 'CREATED_BY', length: 50 })
createdBy: string;
```

### 2.5 데이터 타입 매핑

| Oracle | TypeORM | TypeScript |
|--------|---------|------------|
| VARCHAR2 | varchar | string |
| NUMBER | number | number |
| DATE | date | Date |
| TIMESTAMP | timestamp | Date |
| CLOB | text | string |
| BLOB | blob | Buffer |

---

## 3. 백엔드 개발 규칙 (NestJS)

### 3.1 모듈 구조

```
src/
├── modules/
│   ├── inspection/        # 검사관리
│   │   ├── inspection.module.ts
│   │   ├── inspection.controller.ts
│   │   ├── inspection.service.ts
│   │   ├── entities/
│   │   │   ├── inspection-lot.entity.ts
│   │   │   └── inspection-result.entity.ts
│   │   ├── dto/
│   │   │   ├── create-inspection.dto.ts
│   │   │   └── update-inspection.dto.ts
│   │   └── repositories/
│   │       └── inspection.repository.ts
│   └── ...
├── common/
│   ├── filters/           # 예외 필터
│   ├── interceptors/      # 인터셉터
│   ├── guards/            # 가드
│   ├── decorators/        # 커스텀 데코레이터
│   └── utils/             # 공통 유틸
└── main.ts
```

### 3.2 컨트롤러 작성

```typescript
// ✅ 권장: 표준 REST API 패턴
@ApiTags('검사관리')
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Get('lots')
  @ApiOperation({ summary: '검사 로트 목록 조회' })
  async findAll(@Query() query: InspectionQueryDto) {
    return this.inspectionService.findAll(query);
  }

  @Get('lots/:lotNo')
  @ApiOperation({ summary: '검사 로트 상세 조회' })
  async findOne(@Param('lotNo') lotNo: string) {
    return this.inspectionService.findOne(lotNo);
  }

  @Post('lots')
  @ApiOperation({ summary: '검사 로트 등록' })
  async create(@Body() dto: CreateInspectionDto) {
    return this.inspectionService.create(dto);
  }

  @Put('lots/:lotNo')
  @ApiOperation({ summary: '검사 로트 수정' })
  async update(
    @Param('lotNo') lotNo: string,
    @Body() dto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(lotNo, dto);
  }
}
```

### 3.3 API 경로 규칙

```
# 패턴: /<모듈>/<리소스복수형>

# 검사관리
GET    /inspection/lots          # 목록 조회
GET    /inspection/lots/:lotNo   # 상세 조회
POST   /inspection/lots          # 등록
PUT    /inspection/lots/:lotNo   # 수정
DELETE /inspection/lots/:lotNo   # 삭제

# 부적합 관리
GET    /ncr/ncrs                 # NCR 목록
POST   /ncr/ncrs                 # NCR 등록
POST   /ncr/mrb-reviews          # MRB 심의

# APQP
GET    /apqp/projects            # APQP 프로젝트 목록
```

### 3.4 서비스 작성

```typescript
@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(InspectionLot)
    private readonly inspectionRepository: Repository<InspectionLot>,
  ) {}

  // ❌ 금지: 에러를 하드코딩 기본값으로 숨김
  async findOne(lotNo: string) {
    const lot = await this.inspectionRepository.findOne({ 
      where: { lotNo } 
    });
    return lot || { lotNo: '', status: 'NONE' };  // ❌ 금지
  }

  // ✅ 권장: 명시적 예외 처리
  async findOne(lotNo: string) {
    const lot = await this.inspectionRepository.findOne({ 
      where: { lotNo } 
    });
    if (!lot) {
      throw new NotFoundException(`검사 로트 ${lotNo}를 찾을 수 없습니다.`);
    }
    return lot;
  }

  // ❌ 금지: as any 사용
  async create(dto: CreateInspectionDto) {
    const lot = this.inspectionRepository.create(dto as any);  // ❌
    return this.inspectionRepository.save(lot);
  }

  // ✅ 권장: 정확한 타입 사용
  async create(dto: CreateInspectionDto) {
    const lot = this.inspectionRepository.create(dto);
    return this.inspectionRepository.save(lot);
  }
}
```

### 3.5 예외 처리

```typescript
// 공통 예외 필터
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

## 4. 프론트엔드 개발 규칙 (Next.js)

### 4.1 프로젝트 구조

```
src/
├── app/                      # App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 페이지
│   ├── (dashboard)/         # 그룹 라우트
│   │   ├── layout.tsx       # 대시보드 레이아웃
│   │   ├── inspection/      # 검사관리
│   │   │   ├── iqc/
│   │   │   │   ├── page.tsx # IQC 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # IQC 상세
│   │   │   └── ipqc/
│   │   ├── ncr/             # 부적합 관리
│   │   ├── apqp/            # APQP
│   │   └── ...
│   └── api/                 # API Routes (필요시)
├── components/
│   ├── ui/                  # shadcn/ui 컴포넌트
│   ├── shared/              # 공통 컴포넌트
│   │   ├── data-table.tsx
│   │   ├── filter-panel.tsx
│   │   └── form-fields/
│   └── features/            # 기능별 컴포넌트
│       ├── inspection/
│       ├── ncr/
│       └── ...
├── hooks/                   # 커스텀 훅
├── lib/
│   ├── utils.ts             # 유틸리티
│   ├── api.ts               # API 클라이언트
│   └── constants.ts         # 상수
└── types/                   # 타입 정의
```

### 4.2 UI 규칙

```typescript
// ❌ 금지: alert(), confirm(), prompt()
alert('저장되었습니다.');  // ❌
const ok = confirm('삭제하시겠습니까?');  // ❌

// ✅ 권장: Modal/ConfirmModal 사용
import { useToast } from '@/components/ui/use-toast';
import { ConfirmModal } from '@/components/shared/confirm-modal';

// Toast 알림
const { toast } = useToast();
toast({
  title: '저장 완료',
  description: '데이터가 성공적으로 저장되었습니다.',
  variant: 'default',  // 'default' | 'destructive'
});

// 확인 모달
<ConfirmModal
  title="삭제 확인"
  description="이 데이터를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다."
  onConfirm={handleDelete}
/>
```

### 4.3 상태 관리

```typescript
// Zustand 스토어 예시
import { create } from 'zustand';

interface InspectionState {
  selectedLot: InspectionLot | null;
  filter: InspectionFilter;
  setSelectedLot: (lot: InspectionLot | null) => void;
  setFilter: (filter: InspectionFilter) => void;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  selectedLot: null,
  filter: { startDate: null, endDate: null, status: null },
  setSelectedLot: (lot) => set({ selectedLot: lot }),
  setFilter: (filter) => set({ filter }),
}));
```

### 4.4 API 호출

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API 호출 실패');
  }

  return response.json();
}

// 사용 예시
const lots = await fetchApi<InspectionLot[]>('/inspection/lots');
```

### 4.5 Flex 스크롤 규칙

```typescript
// ❌ 문제: 스크롤이 안됨
<div className="flex flex-col h-full overflow-y-auto">
  <div className="flex-1">...</div>
</div>

// ✅ 해결: min-h-0 추가
<div className="flex flex-col h-full min-h-0 overflow-y-auto">
  <div className="flex-1">...</div>
</div>
```

---

## 5. 코드 품질 규칙

### 5.1 TypeScript 엄격 모드

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 5.2 타입 안전성

```typescript
// ❌ 금지: catch 변수 타입 미지정
try {
  await saveData();
} catch (error) {
  console.log(error.message);  // ❌ error가 unknown 타입
}

// ✅ 권장: 타입 지정
try {
  await saveData();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}

// ❌ 금지: as any 사용
const data = response.data as any;  // ❌

// ✅ 권장: 정확한 타입 사용
const data: InspectionLot = response.data;
```

### 5.3 ESLint 규칙

```json
// .eslintrc.json
{
  "extends": [
    "@nestjs/eslint-config",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

### 5.4 네이밍 컨벤션

| 항목 | 규칙 | 예시 |
|------|------|------|
| 파일명 | 케밥케이스 | `inspection-lot.entity.ts` |
| 클래스명 | 파스칼케이스 | `InspectionLotEntity` |
| 인터페이스 | 파스칼케이스 + I 접두사 | `IInspectionLot` |
| 변수/함수 | 카멜케이스 | `inspectionLots`, `getInspectionLots` |
| 상수 | 대문자 + 스네이크 | `MAX_RETRY_COUNT` |
| DB 컬럼 | 대문자 + 스네이크 | `INSPECTION_DATE` |
| API 경로 | 케밥케이스 | `/inspection-lots` |

---

## 6. 공통코드(ComCode) 사용

### 6.1 기본 원칙

- **하드코딩된 한국어 라벨/색상 절대 금지**
- `ComCodeBadge` + `useComCodeOptions` 사용

### 6.2 사용 예시

```typescript
// 공통코드 옵션 훅 사용
const statusOptions = useComCodeOptions('INSPECTION_STATUS');

// 셀렉트 박스
<Select>
  {statusOptions.map((opt) => (
    <SelectItem key={opt.value} value={opt.value}>
      {opt.label}
    </SelectItem>
  ))}
</Select>

// 뱃지 표시
<ComCodeBadge 
  codeGroup="INSPECTION_STATUS" 
  codeValue={lot.status} 
/>
```

---

## 7. 테스트 규칙

### 7.1 테스트 금지 사항

- **Playwright 사용 금지** — 브라우저 테스트는 사용자가 직접 수행

### 7.2 허용 테스트

```bash
# 단위 테스트 (Jest)
pnpm test

# API 테스트 (Swagger 또는 Jest)
# http://localhost:3001/api-docs
```

### 7.3 검증 방법

```bash
# 빌드 검증
pnpm build

# 린트 검증
pnpm lint

# 타입 검증
pnpm type-check
```

---

## 8. 개발 워크플로우

### 8.1 개발 서버 포트

- **Backend**: 3001
- **Frontend**: 3002 (3000, 3001 사용 금지)

### 8.2 개발 순서

1. **백엔드 컨트롤러 경로 확정** → 프론트엔드 작성 (경로 불일치 방지)
2. **DB 스키마 확정** → 엔티티 작성
3. **API 명세 확정** → 프론트엔드 연동

### 8.3 작업 원칙

```
✅ 큰 아키텍처 가정 전 먼저 확인 요청
✅ 수정 요청 시 해당 부분만 수정 (새로운 가정으로 재구현 금지)
✅ 수정 후 pnpm build 에러 0건 확인 후 완료 보고
```

---

## 9. 커밋 메시지 컨벤션

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅 (세미콜론, 인덴트 등) |
| `refactor` | 코드 리팩토링 |
| `test` | 테스트 코드 |
| `chore` | 빌드 프로세스, 패키지 매니저 설정 등 |

### 예시

```
feat(inspection): IQC 검사 결과 등록 기능 추가

- 검사 로트 생성 API 구현
- 검사 결과 저장 로직 구현
- 합격/불합격 자동 판정 기능 추가

Closes #123
```

---

## 10. 다국어(i18n) 시스템

### 10.1 구조

```
packages/shared/
└── i18n/
    ├── types/
    │   └── resources.ts       # 타입 정의
    ├── locales/
    │   ├── ko/                # 한국어
    │   │   ├── common.json
    │   │   ├── inspection.json
    │   │   ├── ncr.json
    │   │   ├── apqp.json
    │   │   └── ...
    │   ├── en/                # 영어
    │   │   ├── common.json
    │   │   ├── inspection.json
    │   │   └── ...
    │   └── zh/                # 중국어 (향후)
    │       ├── common.json
    │       └── ...
    └── index.ts               # i18n 설정
```

### 10.2 사용 예시

```typescript
// packages/shared/i18n/locales/ko/inspection.json
{
  "iqc": {
    "title": "수입검사",
    "lotNo": "로트번호",
    "inspectionDate": "검사일",
    "judgment": {
      "pass": "합격",
      "fail": "불합격",
      "hold": "보류"
    },
    "messages": {
      "saveSuccess": "검사 결과가 저장되었습니다.",
      "saveError": "저장 중 오류가 발생했습니다."
    }
  }
}

// Frontend 사용
import { useTranslation } from 'react-i18next';

function IqcPage() {
  const { t, i18n } = useTranslation('inspection');
  
  return (
    <div>
      <h1>{t('iqc.title')}</h1>
      <span>{t('iqc.judgment.pass')}</span>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}

// Backend 사용 (에러 메시지 등)
import { i18n } from '@qms/shared/i18n';

const message = i18n.t('iqc.messages.saveSuccess', { lng: 'ko' });
```

### 10.3 언어 감지 및 저장

```typescript
// 브라우저 언어 감지 + localStorage 저장
const getInitialLanguage = () => {
  const saved = localStorage.getItem('app-language');
  if (saved) return saved;
  
  const browserLang = navigator.language.split('-')[0];
  return ['ko', 'en', 'zh'].includes(browserLang) ? browserLang : 'ko';
};
```

---

## 11. 테마(Theme) 시스템

### 11.1 구조

```typescript
// packages/shared/theme/types.ts
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  success: {
    50: string;
    500: string;
    600: string;
  };
  warning: {
    50: string;
    500: string;
    600: string;
  };
  danger: {
    50: string;
    500: string;
    600: string;
  };
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

// Tailwind CSS 설정에 테마 확장
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
        },
        // ... 다른 색상들
      },
    },
  },
};
```

### 11.2 테마 Provider

```typescript
// apps/frontend/src/providers/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setResolvedTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setResolvedTheme(theme);
      root.classList.toggle('dark', theme === 'dark');
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 11.3 테마 전환 UI

```typescript
// components/theme-toggle.tsx
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('system')}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### 11.4 CSS 변수 설정

```css
/* globals.css */
@layer base {
  :root {
    --primary-50: #EEF2FF;
    --primary-100: #E0E7FF;
    --primary-500: #6366F1;
    --primary-600: #4F46E5;
    --primary-700: #4338CA;
    
    --background: #F9FAFB;
    --surface: #FFFFFF;
    --text-primary: #111827;
    --text-secondary: #6B7280;
  }

  .dark {
    --primary-50: #1E1B4B;
    --primary-100: #312E81;
    --primary-500: #818CF8;
    --primary-600: #6366F1;
    --primary-700: #4F46E5;
    
    --background: #111827;
    --surface: #1F2937;
    --text-primary: #F9FAFB;
    --text-secondary: #9CA3AF;
  }
}
```

---

## 12. 환경 변수

### 10.1 Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=1521
DB_NAME=QMSDB
DB_USERNAME=qms_user
DB_PASSWORD=secret

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d

# Server
PORT=3001
NODE_ENV=development
```

### 10.2 Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=QMS
```

---

## 11. 체크리스트

### PR 전 체크리스트

- [ ] `pnpm build` 에러 0건
- [ ] `pnpm lint` 통과
- [ ] `pnpm type-check` 통과
- [ ] 불필요한 `console.log` 제거
- [ ] `as any` 사용 없음
- [ ] API 경로 백엔드/프론트엔드 일치
- [ ] DB 컬럼명 UPPER_SNAKE_CASE
- [ ] PrimaryColumn 사용 (GeneratedColumn 금지)

---

## 13. 사전 준비 체크리스트 (프로젝트 시작 시)

### 13.1 다국어 준비

- [ ] `packages/shared/i18n` 폴더 생성
- [ ] `i18next`, `react-i18next` 패키지 설치
- [ ] 기본 한국어(ko) 번역 파일 생성
- [ ] 영어(en) 번역 파일 생성 (기본 구조)
- [ ] 언어 전환 UI 컴포넌트 준비
- [ ] 브라우저 언어 감지 로직 구현

### 13.2 테마 준비

- [ ] `ThemeProvider` 컴포넌트 생성
- [ ] `useTheme` 훅 구현
- [ ] CSS 변수 기반 색상 시스템 설정
- [ ] 테마 전환 UI 컴포넌트 준비
- [ ] Light/Dark/System 모드 지원
- [ ] localStorage 테마 저장/복원

### 13.3 초기 프로젝트 구조

```
qms/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   └── i18n/           # 백엔드 다국어
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── providers/      # ThemeProvider 등
│       │   └── i18n/           # 프론트엔드 다국어 설정
│       ├── public/
│       │   └── locales/        # 번역 JSON 파일
│       └── package.json
├── packages/
│   └── shared/
│       ├── i18n/               # 공유 다국어
│       └── theme/              # 공유 테마 타입
└── ...
```

---

*본 가이드는 HANES MES 프로젝트의 개발 표준을 기반으로 작성되었습니다.*
