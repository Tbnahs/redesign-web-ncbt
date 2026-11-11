import { useState } from 'react';
import { UkFlag, VietnamFlag } from '@/components/icons/FlagIcons';

type Language = 'vi' | 'en';

const languages: { code: Language; label: string; Flag: typeof UkFlag }[] = [
  { code: 'vi', label: 'Tiếng Việt', Flag: VietnamFlag },
  { code: 'en', label: 'English', Flag: UkFlag },
];

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('vi');
  const [englishNotice, setEnglishNotice] = useState(false);

  return (
    <>
      <div role="group" aria-label="Chọn ngôn ngữ" className="flex items-center gap-1">
        {languages.map(({ code, label, Flag }) => {
          const isActive = language === code;
          return (
            <button
              key={code}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => {
                setLanguage(code);
                setEnglishNotice(code === 'en');
              }}
              className={`flex h-6 w-9 overflow-hidden rounded-sm shadow-sm transition-all duration-200 hover:scale-105 ${
                isActive ? 'ring-2 ring-primary-500 ring-offset-1' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Flag className="h-full w-full" />
            </button>
          );
        })}
      </div>
      {englishNotice && (
        <span role="status" className="max-w-44 text-xs text-neutral-600">
          Chưa có bản tiếng Anh
        </span>
      )}
    </>
  );
}
