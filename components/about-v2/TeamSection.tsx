'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import aboutData from '@/lib/about-data.json';

export default function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleVideoPlay = (memberName: string) => {
    setActiveVideo(memberName);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'team_profile_view', {
        member_name: memberName,
        interaction_type: 'video_play'
      });
    }
  };

  return (
    <section 
      ref={ref}
      className="team-section" 
      aria-labelledby="team-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="team-header"
        >
          <h2 id="team-heading" className="team-heading">
            Meet the Team
          </h2>
          <p className="team-description">
            The people building AI infrastructure that enterprises can trust.
          </p>
        </motion.div>

        <div className="team-pods">
          {aboutData.teamPods.map((pod, podIndex) => (
            <motion.div
              key={pod.pod}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 * podIndex, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="team-pod"
            >
              <h3 className="pod-title">{pod.pod}</h3>
              <p className="pod-description">{pod.description}</p>
              
              <div className="pod-members">
                {pod.members.map((member, memberIndex) => (
                  <div key={member.name} className="member-card">
                    <div className="member-photo">
                      <div className="photo-placeholder" role="img" aria-label={`${member.name}, ${member.role}`}>
                        <span className="member-initials">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      {member.video && (
                        <button
                          className="video-play-btn"
                          onClick={() => handleVideoPlay(member.name)}
                          aria-label={`Play video from ${member.name}`}
                        >
                          ▶
                        </button>
                      )}
                    </div>
                    
                    <div className="member-info">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-role">{member.role}</p>
                      <p className="member-bio">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal Placeholder */}
        {activeVideo && (
          <div 
            className="video-modal"
            onClick={() => setActiveVideo(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Video from ${activeVideo}`}
          >
            <div className="video-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-btn"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                ×
              </button>
              <div className="video-placeholder">
                <p>Video from {activeVideo}</p>
                <small>15-30s unscripted clip: "Why I'm here / What I ship"</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .team-section {
          padding: 5rem 0;
          background: #0a0a0a;
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .team-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .team-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #8b5cf6;
        }

        .team-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .team-pods {
          display: grid;
          gap: 4rem;
        }

        .team-pod {
          background: rgba(17, 24, 39, 0.4);
          border: 1px solid rgba(107, 114, 128, 0.2);
          border-radius: 12px;
          padding: 2rem;
        }

        .pod-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #8b5cf6;
        }

        .pod-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #9ca3af;
          margin: 0 0 2rem 0;
        }

        .pod-members {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .member-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          align-items: start;
        }

        .member-photo {
          position: relative;
        }

        .photo-placeholder {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .video-play-btn {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 32px;
          height: 32px;
          background: #8b5cf6;
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .video-play-btn:hover {
          background: #7c3aed;
          transform: scale(1.1);
        }

        .video-play-btn:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .member-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: #f3f4f6;
        }

        .member-role {
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5cf6;
          margin: 0 0 0.75rem 0;
        }

        .member-bio {
          font-size: 0.875rem;
          line-height: 1.5;
          color: #d1d5db;
          margin: 0;
        }

        .video-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .video-content {
          background: #1f2937;
          border-radius: 12px;
          padding: 2rem;
          position: relative;
          max-width: 600px;
          width: 100%;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.5rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: white;
        }

        .close-btn:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .video-placeholder {
          text-align: center;
          padding: 3rem;
          background: rgba(17, 24, 39, 0.6);
          border-radius: 8px;
          color: #d1d5db;
        }

        .video-placeholder small {
          color: #9ca3af;
          font-size: 0.75rem;
          margin-top: 0.5rem;
          display: block;
        }

        @media (max-width: 768px) {
          .team-section {
            padding: 4rem 0;
          }

          .pod-members {
            grid-template-columns: 1fr;
          }

          .member-card {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1rem;
          }

          .member-photo {
            justify-self: center;
          }
        }
      `}</style>
    </section>
  );
}
