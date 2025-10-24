"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { space } from "@/styles/spacing";
import jobs from "@/data/careers/jobs.json";
import benefitsData from "@/data/careers/benefits.json";
import testimonials from "@/data/careers/testimonials.json";

type FilterType = "All" | "Engineering" | "Design" | "Sales" | "Customer Success" | "Product";
type JobType = "All" | "Full-time" | "Contract";

export default function CareersPage() {
  const [departmentFilter, setDepartmentFilter] = useState<FilterType>("All");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType>("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesDepartment = departmentFilter === "All" || job.department === departmentFilter;
      const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
      return matchesDepartment && matchesType;
    });
  }, [departmentFilter, jobTypeFilter]);

  const departments: FilterType[] = ["All", "Engineering", "Design", "Sales", "Customer Success", "Product"];
  const jobTypes: JobType[] = ["All", "Full-time", "Contract"];

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0` }}>
      {/* Hero Section */}
      <header style={{ maxWidth: "900px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          {benefitsData.hero.title}
        </h1>
        <p style={{ color: "var(--gray-300)", fontSize: "1.2rem", lineHeight: 1.7, marginBottom: space("md") }}>
          {benefitsData.hero.subtitle}
        </p>
      </header>

      {/* Who Thrives Here */}
      <section
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "16px",
          marginBottom: space("lg"),
          maxWidth: "1000px",
          margin: `0 auto ${space("lg")}`,
        }}
      >
        <h2 style={{ marginBottom: space("sm"), textAlign: "center" }}>Who Thrives Here</h2>
        <div style={{ display: "grid", gap: space("xs", 1.5), maxWidth: "800px", margin: "0 auto" }}>
          {benefitsData.hero.whoThrivesHere.map((trait, index) => (
            <p
              key={index}
              style={{
                color: "var(--gray-200)",
                lineHeight: 1.7,
                fontSize: "1.05rem",
              }}
              dangerouslySetInnerHTML={{ __html: trait }}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2.25rem" }}>
          Benefits & Perks
        </h2>
        <div style={{ display: "grid", gap: space("md"), maxWidth: "1200px", margin: "0 auto" }}>
          {benefitsData.benefits.map((category) => (
            <div
              key={category.category}
              className="glass"
              style={{
                padding: space("md"),
                borderRadius: "16px",
              }}
            >
              <h3 style={{ marginBottom: space("sm"), fontSize: "1.5rem" }}>{category.category}</h3>
              <div style={{ display: "grid", gap: space("sm") }}>
                {category.items.map((item) => (
                  <div key={item.title}>
                    <h4
                      style={{
                        marginBottom: space("xs", 0.5),
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "var(--gray-100)",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "16px",
          marginBottom: space("lg"),
          maxWidth: "1000px",
          margin: `0 auto ${space("lg")}`,
        }}
      >
        <h2 style={{ marginBottom: space("xs", 1.5), textAlign: "center" }}>
          {benefitsData.workEnvironment.title}
        </h2>
        <p
          style={{
            color: "var(--gray-300)",
            marginBottom: space("md"),
            textAlign: "center",
            fontSize: "1.1rem",
          }}
        >
          {benefitsData.workEnvironment.description}
        </p>
        <div style={{ display: "grid", gap: space("xs", 1.5), maxWidth: "800px", margin: "0 auto" }}>
          {benefitsData.workEnvironment.principles.map((principle, index) => (
            <p
              key={index}
              style={{
                color: "var(--gray-200)",
                lineHeight: 1.7,
                fontSize: "1.05rem",
              }}
              dangerouslySetInnerHTML={{ __html: principle }}
            />
          ))}
        </div>
      </section>

      {/* Job Listings */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2.25rem" }}>
          Open Positions
        </h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: space("md"),
            marginBottom: space("md"),
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              htmlFor="department-filter"
              style={{ display: "block", marginBottom: space("xs", 0.5), fontSize: "0.9rem" }}
            >
              Department
            </label>
            <select
              id="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value as FilterType)}
              style={{
                padding: `${space("xs", 0.75)} ${space("sm")}`,
                borderRadius: "8px",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "rgba(15, 23, 42, 0.7)",
                color: "var(--gray-100)",
                fontSize: "1rem",
              }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="job-type-filter"
              style={{ display: "block", marginBottom: space("xs", 0.5), fontSize: "0.9rem" }}
            >
              Type
            </label>
            <select
              id="job-type-filter"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value as JobType)}
              style={{
                padding: `${space("xs", 0.75)} ${space("sm")}`,
                borderRadius: "8px",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                background: "rgba(15, 23, 42, 0.7)",
                color: "var(--gray-100)",
                fontSize: "1rem",
              }}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div style={{ display: "grid", gap: space("sm"), maxWidth: "1000px", margin: "0 auto" }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="glass"
                style={{
                  padding: space("md"),
                  borderRadius: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3 style={{ marginBottom: space("xs", 0.5), fontSize: "1.3rem" }}>{job.title}</h3>
                    <p style={{ color: "var(--gray-400)", fontSize: "0.95rem" }}>
                      {job.department} • {job.location} • {job.type}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--gray-400)",
                      transform: expandedJob === job.id ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                    }}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </div>

                {expandedJob === job.id && (
                  <div style={{ marginTop: space("md"), paddingTop: space("md"), borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                    <p style={{ color: "var(--gray-200)", lineHeight: 1.7, marginBottom: space("md") }}>
                      {job.description}
                    </p>

                    <div style={{ marginBottom: space("md") }}>
                      <h4 style={{ marginBottom: space("xs", 0.75), color: "var(--gray-100)" }}>Requirements</h4>
                      <ul style={{ listStyle: "disc", paddingLeft: space("md"), color: "var(--gray-300)" }}>
                        {job.requirements.map((req, idx) => (
                          <li key={idx} style={{ marginBottom: space("xs", 0.5), lineHeight: 1.6 }}>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginBottom: space("md") }}>
                      <h4 style={{ marginBottom: space("xs", 0.75), color: "var(--gray-100)" }}>Responsibilities</h4>
                      <ul style={{ listStyle: "disc", paddingLeft: space("md"), color: "var(--gray-300)" }}>
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx} style={{ marginBottom: space("xs", 0.5), lineHeight: 1.6 }}>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {job.niceToHave && job.niceToHave.length > 0 && (
                      <div style={{ marginBottom: space("md") }}>
                        <h4 style={{ marginBottom: space("xs", 0.75), color: "var(--gray-100)" }}>Nice to Have</h4>
                        <ul style={{ listStyle: "disc", paddingLeft: space("md"), color: "var(--gray-300)" }}>
                          {job.niceToHave.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: space("xs", 0.5), lineHeight: 1.6 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href={`/contact?subject=Application: ${job.title}`}
                      style={{
                        display: "inline-block",
                        padding: `${space("xs", 0.875)} ${space("md")}`,
                        background: "var(--primary)",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Apply for this position
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className="glass"
              style={{
                padding: space("lg"),
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "var(--gray-300)", fontSize: "1.1rem" }}>
                No positions match your filters. Try adjusting your search.
              </p>
              <p style={{ color: "var(--gray-400)", marginTop: space("sm") }}>
                Don't see your role?{" "}
                <Link href="/contact" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                  Send us your resume anyway
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Employee Testimonials */}
      <section style={{ marginBottom: space("xl") }}>
        <h2 style={{ textAlign: "center", marginBottom: space("md"), fontSize: "2.25rem" }}>
          Hear From Our Team
        </h2>
        <div style={{ display: "grid", gap: space("md"), maxWidth: "1200px", margin: "0 auto", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass"
              style={{
                padding: space("md"),
                borderRadius: "16px",
              }}
            >
              <p style={{ color: "var(--gray-200)", lineHeight: 1.7, marginBottom: space("md"), fontSize: "1.05rem", fontStyle: "italic" }}>
                "{testimonial.quote}"
              </p>
              <div>
                <div style={{ fontWeight: 600, color: "var(--gray-100)" }}>{testimonial.name}</div>
                <div style={{ color: "var(--gray-400)", fontSize: "0.95rem" }}>{testimonial.role}</div>
                <div style={{ color: "var(--gray-500)", fontSize: "0.85rem", marginTop: space("xs", 0.5) }}>
                  {testimonial.tenure} at Artifically
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Process */}
      <section
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "16px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginBottom: space("xs", 1.5), textAlign: "center" }}>
          {benefitsData.applicationProcess.title}
        </h2>
        <p style={{ color: "var(--gray-300)", marginBottom: space("md"), textAlign: "center", fontSize: "1.1rem" }}>
          {benefitsData.applicationProcess.description}
        </p>
        <div style={{ display: "grid", gap: space("md"), maxWidth: "800px", margin: "0 auto" }}>
          {benefitsData.applicationProcess.steps.map((step, index) => (
            <div key={step.stage} style={{ display: "flex", gap: space("sm"), alignItems: "start" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: space("xs", 0.5) }}>
                  <h4 style={{ fontWeight: 600, color: "var(--gray-100)" }}>{step.stage}</h4>
                  <span style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>{step.duration}</span>
                </div>
                <p style={{ color: "var(--gray-300)", lineHeight: 1.6 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
