# Mobile-First Responsive Design Guide

## 📱 Overview

This guide documents the mobile-first responsive architecture implemented across the application, following WCAG 2.1 Level AAA standards and industry best practices.

## 🎯 Core Principles

### 1. Mobile-First Approach
- Start with mobile design, progressively enhance for larger screens
- All components are usable and beautiful on mobile devices
- Touch targets meet or exceed 48×48px minimum (WCAG 2.1 Level AAA)

### 2. Performance First
- Lighthouse scores: 90+ on mobile
- Largest Contentful Paint (LCP): < 2.5s on 3G
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### 3. Accessibility First
- WCAG 2.1 Level AAA compliance
- Screen reader optimized
- Keyboard navigation support
- Focus management
- Proper ARIA attributes

---

## 🔧 Responsive Utilities

### Breakpoint System

```javascript
// Custom breakpoints (tailwind.config.js)
xs: 375px   // Extra small (mobile)
sm: 640px   // Small (mobile landscape)
md: 768px   // Medium (tablet)
lg: 1024px  // Large (desktop)
xl: 1280px  // Extra large
2xl: 1440px // 2X large
3xl: 1920px // 3X large (4K displays)
```

### JavaScript Breakpoint Detection

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
}
```

### Additional Hooks

```tsx
// Media query matching
const isPortrait = useMediaQuery('(orientation: portrait)');

// Touch device detection
const isTouchDevice = useTouchDevice();

// Reduced motion preference
const prefersReducedMotion = usePrefersReducedMotion();
```

---

## 🎨 Typography System

### Fluid Typography

All typography scales smoothly from mobile to desktop using `clamp()`:

```css
/* Tailwind classes */
text-fluid-sm    /* 14px → 16px */
text-fluid-base  /* 16px → 18px */
text-fluid-lg    /* 18px → 24px */

text-heading-sm  /* 20px → 24px */
text-heading-md  /* 24px → 32px */
text-heading-lg  /* 32px → 48px */
text-heading-xl  /* 40px → 60px */

text-display-sm  /* 40px → 64px */
text-display-md  /* 48px → 80px */
text-display-lg  /* 64px → 96px */
```

### Usage Example

```tsx
<h1 className="text-heading-xl font-bold text-gray-900">
  Responsive Headline
</h1>

<p className="text-fluid-base leading-mobile-relaxed lg:leading-desktop-normal">
  Body text that scales beautifully across all devices.
</p>
```

### Line Height Utilities

```css
leading-mobile-tight     /* 1.15 */
leading-mobile-snug      /* 1.25 */
leading-mobile-normal    /* 1.5 */
leading-mobile-relaxed   /* 1.6 */

leading-desktop-tight    /* 1.1 */
leading-desktop-snug     /* 1.2 */
leading-desktop-normal   /* 1.4 */
leading-desktop-relaxed  /* 1.5 */
```

---

## 📐 Spacing System

### Fluid Spacing

```css
p-fluid-xs   /* 8px → 12px */
p-fluid-sm   /* 12px → 16px */
p-fluid-md   /* 16px → 24px */
p-fluid-lg   /* 24px → 40px */
p-fluid-xl   /* 32px → 56px */
p-fluid-2xl  /* 48px → 80px */
```

### Container Utilities

```css
/* Responsive container with padding */
container-responsive  /* px-4 → px-16, max-width: 1440px */
container-narrow      /* max-width: 1024px */
container-wide        /* max-width: 1920px */

/* Section spacing */
section-spacing          /* py-8 → py-24 */
section-spacing-compact  /* py-6 → py-16 */
section-spacing-spacious /* py-12 → py-32 */
```

---

## 🎯 Touch Targets

All interactive elements meet WCAG 2.1 Level AAA standards (48×48px minimum).

### Touch Target Utilities

```css
/* Apply to all buttons, links, and interactive elements */
.touch-target              /* 48×48px minimum */
.touch-target-comfortable  /* 52×52px */
.touch-target-spacious     /* 56×56px */
```

### Button Components

```tsx
import { Button } from '@/design-system/components/Button';

// Automatically meets 48px minimum on mobile, scales up on desktop
<Button size="sm">Small Button (48px)</Button>
<Button size="md">Medium Button (52px)</Button>
<Button size="lg">Large Button (56px)</Button>
```

### Custom Touch Targets

```tsx
<button className="min-h-touch min-w-touch flex items-center justify-center">
  Icon Button
</button>
```

---

## 📝 Form Components

### Mobile-Optimized Inputs

All form inputs are optimized for mobile:

```tsx
import { TextField } from '@/design-system/components/TextField';

// Automatic keyboard type detection based on field name
<TextField
  name="email"        // Automatically uses type="email" (@ keyboard)
  label="Email Address"
/>

<TextField
  name="phone"        // Automatically uses type="tel" (number keyboard)
  label="Phone Number"
/>

<TextField
  name="website"      // Automatically uses type="url"
  label="Website"
/>
```

### Input Specifications

- **Min Height:** 48px (prevents iOS zoom on focus)
- **Font Size:** 16px minimum (prevents iOS zoom)
- **Touch Action:** `manipulation` (optimized for touch)
- **Labels:** Always above inputs on mobile
- **Error Messages:** Below inputs with icons and 4.5:1 contrast

### Form Layout Utilities

```css
/* Mobile-optimized form field */
.field-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Full-width inputs on mobile */
.input-mobile {
  width: 100%;
  min-height: 48px;
  font-size: 1rem; /* 16px to prevent iOS zoom */
}
```

---

## 🖼️ Responsive Images

### Basic Responsive Image

```tsx
import { ResponsiveImage } from '@/components/media/ResponsiveImage';

<ResponsiveImage
  src="/hero.jpg"
  width={1920}
  height={1080}
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

### Art Direction (Different Images for Different Screens)

```tsx
<ResponsiveImage
  src="/hero-desktop.jpg"
  width={1920}
  height={1080}
  alt="Hero image"
  sources={[
    {
      src: "/hero-mobile.jpg",
      media: "(max-width: 767px)",
      width: 750,
      height: 1000
    },
    {
      src: "/hero-tablet.jpg",
      media: "(min-width: 768px) and (max-width: 1023px)",
      width: 1536,
      height: 1024
    },
  ]}
/>
```

### Mobile-First Image

```tsx
import { MobileFirstImage } from '@/components/media/ResponsiveImage';

<MobileFirstImage
  src="/product.jpg"
  width={800}
  height={600}
  alt="Product"
  aspectRatio="landscape"
/>
```

---

## ⚡ Performance Optimization

### Lazy Loading

```tsx
import {
  lazyLoad,
  lazyLoadBelowFold,
  lazyLoadModal,
  lazyLoadHeavy
} from '@/utils/lazyLoad';

// Basic lazy loading
const Chart = lazyLoad(() => import('@/components/Chart'));

// Below-the-fold content (aggressive lazy loading)
const Footer = lazyLoadBelowFold(() => import('@/components/Footer'));

// Modals (no loading state)
const LoginModal = lazyLoadModal(() => import('@/components/LoginModal'));

// Heavy components with custom fallback
const VideoPlayer = lazyLoadHeavy(
  () => import('@/components/VideoPlayer'),
  <div>Loading video player...</div>
);
```

### Intersection Observer-Based Loading

```tsx
import { LazyComponent } from '@/utils/lazyLoad';

<LazyComponent
  loader={() => import('@/components/HeavySection')}
  rootMargin="300px" // Start loading 300px before entering viewport
  fallback={<LoadingSkeleton />}
/>
```

### Code Splitting Best Practices

1. **Above-the-fold**: Regular imports (SSR-friendly)
2. **Below-the-fold**: Lazy load with `lazyLoadBelowFold`
3. **Modals/Overlays**: Use `lazyLoadModal`
4. **Heavy Components**: Use `lazyLoadHeavy` (charts, editors, etc.)
5. **Route Components**: Use `createRouteLoader`

---

## 🎨 Layout Patterns

### Grid Layouts

```css
/* Responsive grid: 1 col → 2 cols → 3 cols */
.grid-responsive {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Stack Layouts

```css
/* Vertical on mobile, horizontal on desktop */
.stack-to-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .stack-to-row {
    flex-direction: row;
    gap: 2rem;
  }
}
```

### Hero Section Pattern

```tsx
<section className="page-hero">
  <div className="page-hero__inner">
    {/* Content: Full-width on mobile, 55% on desktop */}
    <div className="page-hero__content">
      <h1>Headline</h1>
      <p>Subheadline</p>
      <div className="cta-group">
        {/* Full-width on mobile, auto on desktop */}
        <button className="cta-primary">Primary CTA</button>
        <button className="cta-secondary">Secondary CTA</button>
      </div>
    </div>

    {/* Preview: Below content on mobile, 45% side-by-side on desktop */}
    <div className="page-hero__preview">
      <img src="/preview.png" alt="Preview" />
    </div>
  </div>
</section>
```

---

## 🎬 Animations

### Respecting User Preferences

```tsx
import { usePrefersReducedMotion } from '@/hooks/useBreakpoint';

function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Content
    </motion.div>
  );
}
```

### CSS-Based Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Mobile-Specific Utilities

### Safe Areas (Notch Support)

```css
/* Respect device safe areas */
.safe-all {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

### Touch Optimization

```css
/* Apply to all interactive elements */
.touch-optimized {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### Smooth Scrolling on Mobile

```css
.scroll-mobile {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

---

## ✅ Checklist for New Components

When creating a new component, ensure:

### Touch & Interaction
- [ ] All interactive elements have **minimum 48×48px touch targets**
- [ ] Touch action set to `manipulation` for better responsiveness
- [ ] Tap highlight color removed (`-webkit-tap-highlight-color: transparent`)
- [ ] Hover effects only apply on devices with hover capability

### Typography
- [ ] **16px minimum font size** on inputs (prevents iOS zoom)
- [ ] Fluid typography using `clamp()` or responsive classes
- [ ] Line heights optimized for mobile readability (1.5-1.6)
- [ ] Text doesn't exceed 65 characters per line for optimal reading

### Layout
- [ ] Mobile-first CSS (base styles for mobile, `min-width` media queries)
- [ ] Vertical stacking on mobile, horizontal on desktop
- [ ] Safe area insets respected for notched devices
- [ ] No horizontal scrolling on any viewport size

### Images
- [ ] Lazy loading enabled (except above-the-fold)
- [ ] Responsive `sizes` attribute defined
- [ ] Alt text provided for accessibility
- [ ] WebP/AVIF formats used via Next.js Image
- [ ] Proper aspect ratio to prevent layout shift

### Performance
- [ ] Below-the-fold components lazy loaded
- [ ] Heavy components code-split
- [ ] Images optimized and compressed
- [ ] No render-blocking resources
- [ ] Bundle size analyzed and optimized

### Accessibility
- [ ] WCAG 2.1 Level AAA contrast ratios (7:1 for text)
- [ ] Keyboard navigation fully supported
- [ ] Focus indicators visible and 2px minimum
- [ ] ARIA attributes properly used
- [ ] Screen reader tested
- [ ] Reduced motion preferences respected

---

## 🧪 Testing Guidelines

### Device Testing Matrix

**Minimum Required:**
- iPhone SE (375×667 - smallest mobile)
- iPhone 14 Pro (393×852 - current standard)
- Samsung Galaxy S21 (360×800 - Android)
- iPad Air (820×1180 - tablet)
- Desktop (1920×1080 - desktop)

### Browser Testing
- Safari iOS (WebKit)
- Chrome Android (Blink)
- Firefox (desktop)
- Edge (desktop)

### Performance Testing Tools
- Lighthouse (mobile & desktop)
- WebPageTest (3G connection)
- Chrome DevTools (throttling)
- Real Device Lab (if available)

### Accessibility Testing
- Screen readers: VoiceOver (iOS), TalkBack (Android)
- Keyboard navigation
- Focus management
- Color contrast analyzer
- axe DevTools

---

## 📚 Additional Resources

### Internal Documentation
- `/hooks/useBreakpoint.ts` - Breakpoint detection hooks
- `/styles/responsive.css` - Responsive utility classes
- `/utils/lazyLoad.tsx` - Performance optimization utilities
- `/components/media/ResponsiveImage.tsx` - Responsive images
- `/design-system/components/` - All design system components

### External References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile UX Best Practices](https://web.dev/mobile/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

## 🚀 Quick Start Examples

### 1. Create a Mobile-First Component

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function MobileFirstCard({ title, description, image }) {
  const { isMobile } = useBreakpoint();

  return (
    <div className="card-responsive">
      {/* Full-width image on mobile, 40% on desktop */}
      <img
        src={image}
        alt={title}
        className="w-full md:w-2/5 aspect-video object-cover"
      />

      <div className="flex-1 p-fluid-md">
        <h3 className="text-heading-sm mb-2">{title}</h3>
        <p className="text-fluid-base leading-mobile-relaxed">
          {description}
        </p>

        {/* Full-width button on mobile */}
        <button className="button-responsive mt-4 min-h-touch">
          Learn More
        </button>
      </div>
    </div>
  );
}
```

### 2. Create a Responsive Grid

```tsx
export function ProductGrid({ products }) {
  return (
    <div className="container-responsive section-spacing">
      <h2 className="text-heading-lg mb-8">Our Products</h2>

      {/* 1 col mobile → 2 cols tablet → 3 cols desktop */}
      <div className="grid-responsive">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Create a Mobile-Optimized Form

```tsx
import { TextField } from '@/design-system/components/TextField';

export function ContactForm() {
  return (
    <form className="space-y-4 max-w-lg mx-auto px-4">
      {/* Auto-detects email keyboard */}
      <TextField
        name="email"
        label="Email Address"
        autoComplete="email"
      />

      {/* Auto-detects phone keyboard */}
      <TextField
        name="phone"
        label="Phone Number"
        autoComplete="tel"
      />

      {/* Full-width button on mobile */}
      <button
        type="submit"
        className="w-full min-h-touch-comfortable bg-blue-600 text-white rounded-lg"
      >
        Submit
      </button>
    </form>
  );
}
```

---

## 🎯 Summary

This mobile-first architecture ensures:

✅ **Excellent mobile UX** - Every component is touch-optimized
✅ **WCAG 2.1 Level AAA compliance** - Accessible to all users
✅ **Fast performance** - < 2.5s LCP on 3G connections
✅ **Smooth animations** - 60fps on mobile devices
✅ **Easy maintenance** - Consistent patterns and utilities
✅ **Future-proof** - Scales from phone to 4K displays

---

**Questions or improvements?** Check the codebase examples or consult the implementation files listed above.
