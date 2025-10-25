'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from './icons';

const DEFAULT_LOCALE = 'en';
const localePrefixPattern = /^\/(en|ar)(?=\/|$)/;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const basePath = pathname.replace(localePrefixPattern, '') || '/';
    const targetPath =
      newLocale === DEFAULT_LOCALE
        ? basePath
        : `/${newLocale}${basePath === '/' ? '' : basePath}`;

    router.push(targetPath);
  };

  return (
    <button
      onClick={() => switchLocale(locale === 'en' ? 'ar' : 'en')}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      className="language-switcher"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        minWidth: '48px',
        minHeight: '48px',
      }}
    >
      <Icon name="globe" size={18} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
