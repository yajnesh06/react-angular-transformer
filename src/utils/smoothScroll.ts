
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize smooth scrolling
export const initSmoothScroll = (): Lenis => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical', // Use orientation instead of direction
    gestureOrientation: 'vertical', // Use gestureOrientation instead of gestureDirection
    smoothWheel: true, // Use smoothWheel instead of smooth
    touchMultiplier: 2,
  });

  // Connect lenis to ScrollTrigger for GSAP animations
  lenis.on('scroll', ScrollTrigger.update);

  // Set up RAF loop for smooth animations
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
};

// Scroll to element with a smooth animation
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// GSAP animations
export const initAnimations = () => {
  // Stagger animation for features
  gsap.from('.feature-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 80%',
    },
  });

  // Hero section animations
  gsap.from('.hero-title', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.hero-description', {
    y: 30,
    opacity: 0,
    delay: 0.2,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.hero-buttons', {
    y: 30,
    opacity: 0,
    delay: 0.4,
    duration: 1,
    ease: 'power3.out',
  });
};
