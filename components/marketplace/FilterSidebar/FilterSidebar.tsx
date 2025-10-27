"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { useMarketplaceCategories } from "@/hooks/useMarketplaceData";
import type { FilterSidebarProps } from "@/types/marketplace";
import styles from "./FilterSidebar.module.css";

/**
 * FilterSidebar - Advanced filtering system
 * Features:
 * - Category tree filter
 * - Price tier filter
 * - Rating filter
 * - Integration filter
 * - Attribute filters
 * - Active filter pills
 * - Clear all button
 * - Collapsible sections
 * - WCAG 2.1 AAA compliant
 */
export function FilterSidebar({ isLoading = false }: Partial<FilterSidebarProps>) {
  const { filters, setFilter, clearFilters, clearFilter, hasActiveFilters, activeFilterCount } =
    useMarketplaceFilters();
  const { data: categories = [], isLoading: categoriesLoading } = useMarketplaceCategories();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    rating: false,
    integrations: false,
    attributes: false,
  });

  // Price tiers
  const priceTiers = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "freemium", label: "Freemium" },
    { value: "paid", label: "Paid" },
    { value: "premium", label: "Premium" },
    { value: "enterprise", label: "Enterprise" },
  ];

  // Rating options
  const ratingOptions = [
    { value: 4.5, label: "4.5 & Above" },
    { value: 4.0, label: "4.0 & Above" },
    { value: 3.5, label: "3.5 & Above" },
    { value: 3.0, label: "3.0 & Above" },
  ];

  // Popular integrations (would come from API in production)
  const popularIntegrations = [
    "Salesforce",
    "HubSpot",
    "Slack",
    "Zendesk",
    "Intercom",
    "Stripe",
    "Gmail",
    "Outlook",
    "Jira",
    "Asana",
  ];

  // Attributes (would come from API in production)
  const attributes = [
    { value: "one-click", label: "One-Click Deploy" },
    { value: "verified", label: "Verified" },
    { value: "staff-pick", label: "Staff Pick" },
    { value: "new", label: "New" },
    { value: "trending", label: "Trending" },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    const current = filters.categories;
    if (current.includes(categoryId)) {
      setFilter(
        "categories",
        current.filter((id) => id !== categoryId)
      );
    } else {
      setFilter("categories", [...current, categoryId]);
    }
  };

  const handlePriceTierChange = (tier: string) => {
    setFilter("priceTier", tier as "all" | "free" | "freemium" | "paid" | "premium" | "enterprise");
  };

  const handleRatingChange = (rating: number | null) => {
    setFilter("rating", rating);
  };

  const handleIntegrationToggle = (integration: string) => {
    const current = filters.integrations;
    if (current.includes(integration)) {
      setFilter(
        "integrations",
        current.filter((i) => i !== integration)
      );
    } else {
      setFilter("integrations", [...current, integration]);
    }
  };

  const handleAttributeToggle = (attribute: string) => {
    const current = filters.attributes;
    if (current.includes(attribute)) {
      setFilter(
        "attributes",
        current.filter((a) => a !== attribute)
      );
    } else {
      setFilter("attributes", [...current, attribute]);
    }
  };

  // Get active filter pills
  const activeFilterPills = useMemo(() => {
    const pills: Array<{ type: string; label: string; value: string | number }> = [];

    // Categories
    filters.categories.forEach((categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        pills.push({ type: "categories", label: category.name, value: categoryId });
      }
    });

    // Price tier
    if (filters.priceTier && filters.priceTier !== "all") {
      const tier = priceTiers.find((t) => t.value === filters.priceTier);
      if (tier) {
        pills.push({ type: "priceTier", label: tier.label, value: tier.value });
      }
    }

    // Rating
    if (filters.rating) {
      pills.push({ type: "rating", label: `${filters.rating}+ Rating`, value: filters.rating });
    }

    // Integrations
    filters.integrations.forEach((integration) => {
      pills.push({ type: "integrations", label: integration, value: integration });
    });

    // Attributes
    filters.attributes.forEach((attribute) => {
      const attr = attributes.find((a) => a.value === attribute);
      if (attr) {
        pills.push({ type: "attributes", label: attr.label, value: attribute });
      }
    });

    return pills;
  }, [filters, categories, priceTiers, attributes]);

  const handleRemoveFilter = (pill: { type: string; label: string; value: string | number }) => {
    if (pill.type === "categories") {
      handleCategoryToggle(pill.value as number);
    } else if (pill.type === "priceTier") {
      setFilter("priceTier", "all");
    } else if (pill.type === "rating") {
      setFilter("rating", null);
    } else if (pill.type === "integrations") {
      handleIntegrationToggle(pill.value as string);
    } else if (pill.type === "attributes") {
      handleAttributeToggle(pill.value as string);
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearAll}
            aria-label="Clear all filters"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterPills.length > 0 && (
        <div className={styles.activePills}>
          {activeFilterPills.map((pill, index) => (
            <button
              key={`${pill.type}-${pill.value}-${index}`}
              type="button"
              onClick={() => handleRemoveFilter(pill)}
              className={styles.pill}
              aria-label={`Remove ${pill.label} filter`}
            >
              <span>{pill.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10 4L4 10M4 4l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Filter Sections */}
      <div className={styles.sections}>
        {/* Categories */}
        <div className={styles.section}>
          <button
            type="button"
            onClick={() => toggleSection("categories")}
            className={styles.sectionHeader}
            aria-expanded={expandedSections.categories}
          >
            <span className={styles.sectionTitle}>Category</span>
            <svg
              className={`${styles.chevron} ${expandedSections.categories ? styles.expanded : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                className={styles.sectionContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {categoriesLoading ? (
                  <div className={styles.loading}>Loading categories...</div>
                ) : (
                  <div className={styles.checkboxList}>
                    {categories.map((category) => (
                      <label key={category.id} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxLabel}>
                          {category.icon && <span className={styles.categoryIcon}>{category.icon}</span>}
                          {category.name}
                          {category.automationCount !== undefined && category.automationCount > 0 && (
                            <span className={styles.count}>({category.automationCount})</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price */}
        <div className={styles.section}>
          <button
            type="button"
            onClick={() => toggleSection("price")}
            className={styles.sectionHeader}
            aria-expanded={expandedSections.price}
          >
            <span className={styles.sectionTitle}>Price</span>
            <svg
              className={`${styles.chevron} ${expandedSections.price ? styles.expanded : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                className={styles.sectionContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.radioList}>
                  {priceTiers.map((tier) => (
                    <label key={tier.value} className={styles.radio}>
                      <input
                        type="radio"
                        name="priceTier"
                        value={tier.value}
                        checked={filters.priceTier === tier.value}
                        onChange={() => handlePriceTierChange(tier.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating */}
        <div className={styles.section}>
          <button
            type="button"
            onClick={() => toggleSection("rating")}
            className={styles.sectionHeader}
            aria-expanded={expandedSections.rating}
          >
            <span className={styles.sectionTitle}>Rating</span>
            <svg
              className={`${styles.chevron} ${expandedSections.rating ? styles.expanded : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div
                className={styles.sectionContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.radioList}>
                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === null}
                      onChange={() => handleRatingChange(null)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>All Ratings</span>
                  </label>
                  {ratingOptions.map((option) => (
                    <label key={option.value} className={styles.radio}>
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={() => handleRatingChange(option.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Integrations */}
        <div className={styles.section}>
          <button
            type="button"
            onClick={() => toggleSection("integrations")}
            className={styles.sectionHeader}
            aria-expanded={expandedSections.integrations}
          >
            <span className={styles.sectionTitle}>Integrations</span>
            <svg
              className={`${styles.chevron} ${expandedSections.integrations ? styles.expanded : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {expandedSections.integrations && (
              <motion.div
                className={styles.sectionContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.checkboxList}>
                  {popularIntegrations.map((integration) => (
                    <label key={integration} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={filters.integrations.includes(integration)}
                        onChange={() => handleIntegrationToggle(integration)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxLabel}>{integration}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attributes */}
        <div className={styles.section}>
          <button
            type="button"
            onClick={() => toggleSection("attributes")}
            className={styles.sectionHeader}
            aria-expanded={expandedSections.attributes}
          >
            <span className={styles.sectionTitle}>Attributes</span>
            <svg
              className={`${styles.chevron} ${expandedSections.attributes ? styles.expanded : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {expandedSections.attributes && (
              <motion.div
                className={styles.sectionContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.checkboxList}>
                  {attributes.map((attribute) => (
                    <label key={attribute.value} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={filters.attributes.includes(attribute.value)}
                        onChange={() => handleAttributeToggle(attribute.value)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxLabel}>{attribute.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;

