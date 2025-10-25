# Internationalization (i18n) Guide

## Adding New Translations

1. Add keys to `messages/en.json` and `messages/ar.json`
2. Use in components:

```tsx
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('Navigation');
  return <h1>{t('home')}</h1>;
}
```

## RTL Considerations

- Use CSS logical properties (margin-inline-start vs margin-left)
- Arabic needs line-height: 1.8 (vs 1.5 for English)
- Test all layouts in RTL mode
- Icons may need horizontal flipping

## URL Structure

- English: `/en/marketplace`
- Arabic: `/ar/marketplace`

Middleware automatically redirects `/` to `/en/`.
