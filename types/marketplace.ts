/**
 * Marketplace TypeScript Definitions
 * Complete type safety for THE best marketplace
 */

// ============================================================================
// AUTOMATION TYPES
// ============================================================================

export type AutomationPriceTier = 'free' | 'freemium' | 'paid' | 'premium' | 'enterprise';

export type AutomationStatus = 'draft' | 'review' | 'published' | 'archived' | 'deprecated';

export interface AutomationIntegrations {
  sources?: string[];
  destinations?: string[];
}

export interface AutomationPreviewImage {
  src: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface AutomationPerformance {
  avgInteractionMs?: number;
  fps?: number;
  [key: string]: unknown;
}

export interface AutomationRequirements {
  cpu?: string;
  memory?: string;
  storage?: string;
  [key: string]: unknown;
}

export interface AutomationChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface Automation {
  id: number | string;
  name: string;
  slug: string;
  title?: string;
  description: string;
  summary?: string;
  longDescription?: string;

  // Visual Assets
  icon?: string;
  iconUrl?: string;
  previewImage?: string | AutomationPreviewImage;
  previewImageBlur?: string;
  screenshots?: string[];
  videoUrl?: string;
  demoUrl?: string;

  // Pricing
  priceMonthly?: number | null;
  priceYearly?: number | null;
  priceEnterprise?: number | null;
  currency?: string;
  priceTier: AutomationPriceTier;
  trialDays?: number;

  // Categorization
  categoryId?: number;
  category?: AutomationCategory;
  tags?: string[];
  industries?: string[];
  useCases?: string[];

  // Integrations
  integrations?: AutomationIntegrations;
  requiredIntegrations?: string[];
  supportedPlatforms?: string[];

  // Features
  features?: string[];
  highlights?: string[];
  capabilities?: string[];
  automationSteps?: unknown[];

  // Performance & Stats
  roi?: number;
  hoursSavedWeekly?: number;
  deploymentsPerWeek?: number;
  avgDeploymentTime?: number;
  successRate?: number;

  // Ratings & Reviews
  rating?: number;
  reviewCount?: number;
  teamVotes?: number;

  // Analytics
  viewCount?: number;
  clickCount?: number;
  deploymentCount?: number;
  favoriteCount?: number;
  shareCount?: number;

  // Trending & Popularity
  trendingScore?: number;
  popularityScore?: number;
  qualityScore?: number;

  // Attributes
  isFeatured?: boolean;
  isNew?: boolean;
  isVerified?: boolean;
  isStaffPick?: boolean;
  isOneClick?: boolean;

  // Compliance
  compliance?: string[];
  securityFeatures?: string[];
  dataResidency?: string[];

  // Requirements
  minRequirements?: AutomationRequirements;
  prerequisites?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;

  // Version & Changelog
  version?: string;
  changelog?: AutomationChangelogEntry[];
  releaseNotes?: string;

  // Publishing
  status?: AutomationStatus;
  publishedAt?: string | Date;
  archivedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Additional
  authorId?: number;
  authorName?: string;
  supportUrl?: string;
  documentationUrl?: string;
  githubUrl?: string;

  // Performance tracking
  performance?: AutomationPerformance;
  lastVotedAt?: number;

  // Raw data (for flexibility)
  [key: string]: unknown;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface AutomationCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  color?: string;
  gradient?: string[];
  parentId?: number | null;
  parent?: AutomationCategory;
  children?: AutomationCategory[];
  displayOrder?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  automationCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface AutomationReview {
  id: number;
  automationId: number;
  userId: number;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase?: boolean;
  isVerifiedDeployment?: boolean;
  helpfulCount?: number;
  notHelpfulCount?: number;
  status?: ReviewStatus;
  moderationNotes?: string;
  response?: string;
  responseAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export type SortOption = 'popular' | 'trending' | 'rating' | 'recent' | 'priceAsc' | 'priceDesc' | 'name';

export type ViewMode = 'grid' | 'list';

export interface MarketplaceFilters {
  page?: number;
  limit?: number;
  category?: number | null;
  priceTier?: AutomationPriceTier | 'all';
  integrations?: string[];
  tags?: string[];
  rating?: number | null;
  search?: string;
  sortBy?: SortOption;
  attributes?: string[];
}

export interface ActiveFilters {
  categories: number[];
  priceTier: AutomationPriceTier | 'all';
  integrations: string[];
  tags: string[];
  attributes: string[];
  rating: number | null;
  search: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface AutomationPage {
  items: Automation[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextPage: number | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp?: string;
    requestId?: string;
    [key: string]: unknown;
  };
}

export interface AutomationsListResponse {
  items: Automation[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface FeaturedAutomationsResponse {
  items: Automation[];
  count: number;
}

export interface TrendingAutomationsResponse {
  items: Automation[];
  count: number;
}

export interface RelatedAutomationsResponse {
  items: Automation[];
  count: number;
}

export interface SearchAutomationsResponse {
  items: Automation[];
  count: number;
  query: string;
}

export interface MarketplaceStatsResponse {
  totalAutomations: number;
  totalDeployments: number;
  avgRating: number;
  totalReviews: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export type AnalyticsEventType = 'view' | 'click' | 'deploy' | 'favorite' | 'share';

export interface AnalyticsEvent {
  automationId: number | string;
  eventType: AnalyticsEventType;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface AutomationAnalytics {
  id: number;
  automationId: number;
  date: string;
  views: number;
  uniqueViews: number;
  clicks: number;
  deployments: number;
  favorites: number;
  shares: number;
  avgTimeOnPage?: number;
  avgScrollDepth?: number;
  bounceRate?: number;
  conversionRate?: number;
  trendingScore: number;
  createdAt?: string | Date;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface MarketplaceUIState {
  viewMode: ViewMode;
  showFilters: boolean;
  selectedAutomations: (number | string)[];
  recentlyViewed: (number | string)[];
  favorites: (number | string)[];
  comparisonList: (number | string)[];
}

export interface SearchSuggestion {
  type: 'automation' | 'category' | 'tag';
  id: number | string;
  label: string;
  description?: string;
  icon?: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface AutomationCardProps {
  automation: Automation;
  variant?: 'default' | 'compact' | 'featured';
  onDeploy?: (automation: Automation) => void;
  onPreview?: (automation: Automation) => void;
  onFavorite?: (automation: Automation) => void;
  onCompare?: (automation: Automation) => void;
  onVote?: (automation: Automation) => void;
  showActions?: boolean;
  showBadges?: boolean;
  showPreview?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export interface FilterSidebarProps {
  categories: AutomationCategory[];
  activeFilters: ActiveFilters;
  onFilterChange: (filters: Partial<ActiveFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
  autoFocus?: boolean;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseMarketplaceAutomationsReturn {
  automations: Automation[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<unknown>;
  prefetchNextPage: () => Promise<unknown>;
  refetch: () => Promise<unknown>;
}

export interface UseMarketplaceFiltersReturn {
  filters: ActiveFilters;
  setFilter: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof ActiveFilters) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export interface UseMarketplaceSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: SearchSuggestion[];
  isSearching: boolean;
  recentSearches: string[];
  clearRecentSearches: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

