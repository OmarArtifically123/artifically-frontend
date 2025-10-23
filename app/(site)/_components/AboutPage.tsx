// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import useInViewState from "@/hooks/useInViewState";
import Icon from "@/components/icons/Icon";
import { motionCatalog } from "@/design/motion/catalog";

// ============================================================================
// DATA STRUCTURES
// ============================================================================

const companyValues = [
  {
    id: "innovation",
    icon: "rocket" as const,
    title: "Relentless Innovation",
    description:
      "We don't just adopt AI—we push the boundaries of what's possible, constantly exploring new frontiers in automation to deliver unprecedented value. Innovation isn't a buzzword; it's our operating system.",
  },
  {
    id: "transparency",
    icon: "shieldOutline" as const,
    title: "Radical Transparency",
    description:
      "We believe trust is earned through honesty. From our pricing to our data practices, we operate with complete transparency. When we make mistakes, we own them. When we win, we share the credit.",
  },
  {
    id: "impact",
    icon: "target" as const,
    title: "Measurable Impact",
    description:
      "Every feature we ship, every automation we build, must deliver tangible results. We're obsessed with metrics that matter—time saved, costs reduced, and human potential unlocked. Empty promises don't scale.",
  },
  {
    id: "empowerment",
    icon: "users" as const,
    title: "Human Empowerment",
    description:
      "AI should amplify human capability, not replace it. We build tools that free people from repetitive drudgery so they can focus on creative, strategic, and meaningful work. Technology serves people, not the other way around.",
  },
  {
    id: "excellence",
    icon: "trophy" as const,
    title: "Uncompromising Excellence",
    description:
      "Good enough isn't in our vocabulary. We obsess over every pixel, every API response time, every edge case. Our users entrust us with their most critical workflows—we honor that trust with craftsmanship.",
  },
];

const teamMembers = [
  {
    id: "founder-ceo",
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former AI research lead at Google, 15+ years building production ML systems. Believes the future of work is augmented, not replaced.",
    imagePlaceholder: "AC",
  },
  {
    id: "cto",
    name: "Sarah Martinez",
    role: "Chief Technology Officer",
    bio: "Infrastructure architect who scaled systems to 100M+ users. Passionate about making AI accessible through elegant engineering.",
    imagePlaceholder: "SM",
  },
  {
    id: "cpo",
    name: "James Liu",
    role: "Chief Product Officer",
    bio: "Product strategist with a track record of shipping 0-to-1 products used by millions. UX obsessive who thinks in user journeys.",
    imagePlaceholder: "JL",
  },
  {
    id: "head-ai",
    name: "Dr. Priya Sharma",
    role: "Head of AI Research",
    bio: "PhD in Machine Learning from MIT. Published 50+ papers on transformer architectures and conversational AI systems.",
    imagePlaceholder: "PS",
  },
  {
    id: "head-design",
    name: "Marcus Johnson",
    role: "Head of Design",
    bio: "Award-winning product designer who believes the best interface is no interface. Makes complex systems feel effortless.",
    imagePlaceholder: "MJ",
  },
  {
    id: "head-ops",
    name: "Elena Volkov",
    role: "Head of Operations",
    bio: "Operations leader who thrives in chaos. Built teams across 12 countries and knows automation from both sides of the table.",
    imagePlaceholder: "EV",
  },
];

const milestones = [
  { year: "2022", label: "Founded in San Francisco" },
  { year: "2023", label: "First 1,000 customers" },
  { year: "2024", label: "10M+ AI requests processed" },
  { year: "2025", label: "Series A funding, 50+ team members" },
];

// ============================================================================
// ANIMATED SECTION WRAPPER
// ============================================================================

function AnimatedSection({
  children,
  className = "",
  style,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const [ref, inView] = useInViewState({
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity ${motionCatalog.durations.medium}s cubic-bezier(${motionCatalog.easings.out.join(",")}), transform ${motionCatalog.durations.medium}s cubic-bezier(${motionCatalog.easings.out.join(",")})`,
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AboutPage() {
  return (
    <div
      className="about-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary, #0a0e1a)",
        color: "var(--color-text-primary, #e2f0ff)",
      }}
    >
      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section
        className="about-hero"
        style={{
          position: "relative",
          padding: `${space("3xl")} ${space("lg")} ${space("2xl")}`,
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1400px",
            height: "100%",
            background:
              "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.5rem, 2rem + 2.5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                fontWeight: 700,
                marginBottom: space("md"),
                background:
                  "linear-gradient(135deg, #e2f0ff 0%, rgba(226, 240, 255, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              We're Building the Future of Work
            </h1>
            <p
              style={{
                fontSize: "clamp(1.15rem, 1rem + 0.4vw, 1.5rem)",
                lineHeight: 1.6,
                color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Artifically exists to liberate human potential through intelligent
              automation—transforming tedious operational work into strategic
              advantage.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          COMPANY STORY SECTION
          ==================================================================== */}
      <AnimatedSection
        style={{
          padding: `${space("2xl")} ${space("lg")}`,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <article
            className="glass-card glass-card--subtle"
            style={{
              padding: space("xl"),
              borderRadius: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
                fontWeight: 700,
                marginBottom: space("lg"),
                letterSpacing: "-0.02em",
              }}
            >
              Our Story
            </h2>

            <div
              style={{
                display: "grid",
                gap: space("lg"),
              }}
            >
              <p
                style={{
                  fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                }}
              >
                Founded in <strong>2022</strong> in San Francisco, Artifically
                was born from a simple observation: operations teams were
                drowning in repetitive tasks while AI sat on the sidelines. Our
                founding team—veterans from Google, Meta, and leading AI research
                labs—saw an opportunity to bridge that gap.
              </p>

              <p
                style={{
                  fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                }}
              >
                What started as a side project to automate our own workflows
                quickly resonated with hundreds of companies facing the same
                challenges. Today, we're a <strong>team of 50+ engineers,
                designers, and automation specialists</strong> serving customers
                across healthcare, finance, logistics, and beyond.
              </p>

              {/* Milestones */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: space("md"),
                  marginTop: space("md"),
                  padding: space("lg"),
                  background: "rgba(99, 102, 241, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(99, 102, 241, 0.1)",
                }}
              >
                {milestones.map((milestone) => (
                  <div
                    key={milestone.year}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "var(--brand-primary, #6366f1)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {milestone.year}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        color:
                          "var(--color-text-tertiary, rgba(226, 240, 255, 0.72))",
                      }}
                    >
                      {milestone.label}
                    </div>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                }}
              >
                We've processed over <strong>10 million AI-powered requests</strong>,
                saved our customers an estimated <strong>2 million hours</strong> of
                manual work, and we're just getting started. Our platform now powers
                everything from customer support automation to complex data processing
                pipelines—all while maintaining enterprise-grade security and reliability.
              </p>
            </div>
          </article>
        </div>
      </AnimatedSection>

      {/* ====================================================================
          VALUES & CULTURE SECTION
          ==================================================================== */}
      <AnimatedSection
        style={{
          padding: `${space("2xl")} ${space("lg")}`,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: space("xl"),
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
                fontWeight: 700,
                marginBottom: space("sm"),
                letterSpacing: "-0.02em",
              }}
            >
              Our Values
            </h2>
            <p
              style={{
                fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              These aren't just words on a wall—they're the principles that guide
              every decision we make.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: space("lg"),
            }}
          >
            {companyValues.map((value) => (
              <article
                key={value.id}
                className="glass-card glass-card--subtle"
                style={{
                  padding: space("lg"),
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: space("md"),
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <Icon
                    name={value.icon}
                    size={24}
                    strokeWidth={1.75}
                    style={{
                      color: "var(--brand-primary, #6366f1)",
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {value.title}
                </h3>

                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    margin: 0,
                    color:
                      "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                  }}
                >
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ====================================================================
          TEAM SECTION
          ==================================================================== */}
      <AnimatedSection
        style={{
          padding: `${space("2xl")} ${space("lg")}`,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: space("xl"),
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
                fontWeight: 700,
                marginBottom: space("sm"),
                letterSpacing: "-0.02em",
              }}
            >
              Meet the Team
            </h2>
            <p
              style={{
                fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              A diverse group of builders, thinkers, and dreamers united by a
              shared mission.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: space("lg"),
            }}
          >
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="glass-card glass-card--subtle"
                style={{
                  padding: space("lg"),
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: space("md"),
                }}
              >
                {/* Avatar placeholder */}
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--brand-primary, #6366f1)",
                    border: "2px solid rgba(99, 102, 241, 0.3)",
                  }}
                  aria-label={`${member.name} profile photo`}
                >
                  {member.imagePlaceholder}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: "0.25rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--brand-primary, #6366f1)",
                      margin: 0,
                      marginBottom: space("sm"),
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      margin: 0,
                      color:
                        "var(--color-text-tertiary, rgba(226, 240, 255, 0.72))",
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p
            style={{
              marginTop: space("xl"),
              textAlign: "center",
              fontSize: "1rem",
              color: "var(--color-text-tertiary, rgba(226, 240, 255, 0.72))",
              fontStyle: "italic",
            }}
          >
            We're building a team that reflects the diversity of the customers we
            serve, with members spanning 12 countries and bringing perspectives
            from healthcare, finance, logistics, and beyond.
          </p>
        </div>
      </AnimatedSection>

      {/* ====================================================================
          CALL-TO-ACTION SECTION
          ==================================================================== */}
      <AnimatedSection
        style={{
          padding: `${space("2xl")} ${space("lg")} ${space("3xl")}`,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            className="glass-card glass-card--subtle"
            style={{
              padding: space("2xl"),
              borderRadius: "16px",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
                fontWeight: 700,
                marginBottom: space("md"),
                letterSpacing: "-0.02em",
              }}
            >
              Join Us on This Journey
            </h2>
            <p
              style={{
                fontSize: "clamp(1.05rem, 1rem + 0.2vw, 1.2rem)",
                lineHeight: 1.6,
                color: "var(--color-text-secondary, rgba(226, 240, 255, 0.85))",
                marginBottom: space("lg"),
                maxWidth: "600px",
                margin: "0 auto",
                marginBottom: space("lg"),
              }}
            >
              Whether you're looking to join our team or partner with us, we'd
              love to hear from you.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: space("md"),
                justifyContent: "center",
              }}
            >
              <Link
                href="/careers"
                className="button button--lg button--primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <Icon name="briefcase" size={20} strokeWidth={1.75} />
                <span>Join Our Team</span>
              </Link>

              <Link
                href="/contact"
                className="button button--lg button--secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <Icon name="mail" size={20} strokeWidth={1.75} />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
