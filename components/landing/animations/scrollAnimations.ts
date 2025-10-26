/**
 * GSAP ScrollTrigger configuration presets for landing page
 */

export const fadeInUp = {
  scrollTrigger: {
    trigger: undefined, // Set dynamically
    start: "top 80%",
    end: "top 30%",
    scrub: 1,
  },
  from: {
    opacity: 0,
    y: 60,
  },
  to: {
    opacity: 1,
    y: 0,
  },
};

export const fadeIn = {
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    end: "top 50%",
    scrub: 1,
  },
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

export const scaleIn = {
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    end: "top 40%",
    scrub: 1,
  },
  from: {
    opacity: 0,
    scale: 0.8,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
};

export const slideInLeft = {
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    end: "top 40%",
    scrub: 1,
  },
  from: {
    opacity: 0,
    x: -100,
  },
  to: {
    opacity: 1,
    x: 0,
  },
};

export const slideInRight = {
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    end: "top 40%",
    scrub: 1,
  },
  from: {
    opacity: 0,
    x: 100,
  },
  to: {
    opacity: 1,
    x: 0,
  },
};

export const parallax = (speed: number = 0.5) => ({
  scrollTrigger: {
    trigger: undefined,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
  from: {
    y: 0,
  },
  to: {
    y: -100 * speed,
  },
});

export const horizontalScroll = {
  scrollTrigger: {
    trigger: undefined,
    start: "top top",
    end: () => "+=" + (window.innerWidth * 2),
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  },
  from: {
    x: 0,
  },
  to: {
    x: () => -(window.innerWidth * 2),
  },
};

export const pinSection = {
  scrollTrigger: {
    trigger: undefined,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
  },
};

export const progressBar = {
  scrollTrigger: {
    trigger: undefined,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  },
  from: {
    scaleX: 0,
  },
  to: {
    scaleX: 1,
  },
};

export const staggerFadeIn = (staggerAmount: number = 0.1) => ({
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  from: {
    opacity: 0,
    y: 30,
  },
  to: {
    opacity: 1,
    y: 0,
    stagger: staggerAmount,
  },
});

export const counterUp = {
  scrollTrigger: {
    trigger: undefined,
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  from: {
    innerText: 0,
  },
  to: {
    innerText: undefined, // Set dynamically
    duration: 2,
    snap: { innerText: 1 },
  },
};

const scrollAnimations = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  parallax,
  horizontalScroll,
  pinSection,
  progressBar,
  staggerFadeIn,
  counterUp,
};

export default scrollAnimations;




