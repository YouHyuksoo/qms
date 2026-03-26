'use client';

import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <Select value={i18n.language} onValueChange={i18n.changeLanguage}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
