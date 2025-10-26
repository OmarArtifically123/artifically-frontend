/**
 * TypeScript Type Definitions for Landing Page Components
 */

// Section Types
export interface LandingSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string | number[];
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
}

// 3D Component Types
export interface ThreeSceneConfig {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: "high-performance" | "low-power" | "default";
  pixelRatio?: number;
}

// Interaction Types
export interface InteractionEvent {
  type: "click" | "hover" | "drag" | "scroll";
  target: string;
  position?: { x: number; y: number };
  timestamp: number;
}

// Metrics Types
export interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
  icon?: string;
}

export interface MetricCard {
  title: string;
  description: string;
  metrics: Metric[];
  category: string;
}

// CTA Types
export interface CTAConfig {
  label: string;
  variant: "primary" | "secondary" | "tertiary";
  href?: string;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { label: string; value: string }[];
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating?: number;
  date?: string;
  verified?: boolean;
}

// Case Study Types
export interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  size: "startup" | "midmarket" | "enterprise";
  logo?: string;
  summary: string;
  challenge: string;
  solution: string;
  results: Metric[];
  testimonial?: Testimonial;
  featured?: boolean;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  category: string;
  logo: string;
  description?: string;
  verified?: boolean;
  popular?: boolean;
}

// Pattern Types
export interface AutomationPattern {
  id: string;
  name: string;
  icon: string;
  description: string;
  complexity: "low" | "medium" | "high";
  timeToValue: string;
  popularity: number;
  examples: string[];
  color: string;
}

// ROI Calculator Types
export interface ROIInputs {
  employees: number;
  processesPerWeek: number;
  hoursPerProcess: number;
  hourlyRate: number;
  currentAutomation: number;
}

export interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
  hoursFreed: number;
}

// Pricing Types
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limitations?: string[];
  cta: CTAConfig;
  highlighted?: boolean;
  popular?: boolean;
}

// Timeline Types
export interface TimelineMilestone {
  id: string;
  day: number;
  title: string;
  description: string;
  icon: string;
  metrics?: Metric[];
  achievement?: string;
}

export interface TimelinePath {
  id: string;
  label: string;
  companySize: "startup" | "midmarket" | "enterprise";
  milestones: TimelineMilestone[];
}

// Security & Compliance Types
export interface ComplianceBadge {
  id: string;
  name: string;
  acronym: string;
  icon?: string;
  description: string;
  verificationUrl?: string;
  validUntil?: string;
}

export interface SecurityLayer {
  id: string;
  name: string;
  description: string;
  features: string[];
  order: number;
}

// Performance Types
export interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  status: "good" | "warning" | "poor";
}

// Analytics Types
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// Filter Types
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "single" | "multiple";
  options: FilterOption[];
}

// Video Types
export interface VideoConfig {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

// Role Types
export interface UserRole {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  metrics: Metric[];
}

// Transformation Types
export interface Transformation {
  id: string;
  name: string;
  before: {
    title: string;
    description: string;
    items: string[];
    metric: string;
  };
  after: {
    title: string;
    description: string;
    items: string[];
    metric: string;
  };
  color: string;
}

// Social Proof Types
export interface SocialProofStat {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Modal Types
export interface ModalConfig {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  onClose?: () => void;
}

// Toast/Notification Types
export interface NotificationConfig {
  id?: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading State Types
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// Error State Types
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retryable?: boolean;
}

// Component State Types
export interface ComponentState<T = any> {
  data: T | null;
  loading: LoadingState;
  error: ErrorState;
}




