
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
  console.log("Initializing GSAP animations");
  
  // Reset any existing ScrollTrigger instances to avoid conflicts
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Hero section animations - making these more immediate with no delay
  gsap.set(['.hero-badge', '.hero-title', '.hero-description', '.hero-buttons', '.hero-arrow'], 
    { opacity: 0, y: 30 });
  
  gsap.to('.hero-badge', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.1
  });
  
  gsap.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.2
  });
  
  gsap.to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.3
  });
  
  gsap.to('.hero-buttons', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.4
  });
  
  gsap.to('.hero-arrow', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.5
  });
  
  // Create feature cards animation
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length > 0) {
    console.log(`Found ${featureCards.length} feature cards to animate`);
    
    gsap.set(featureCards, { opacity: 0, y: 60 });
    
    ScrollTrigger.batch(featureCards, {
      start: "top 80%",
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
        });
      },
      once: true
    });
  } else {
    console.log("No feature cards found, will try to set up animation for when they appear");
    
    // Set up a fallback animation in case the elements load later
    ScrollTrigger.create({
      trigger: ".features-grid",
      start: "top 80%",
      onEnter: () => {
        const featuresDelayed = document.querySelectorAll('.feature-card');
        if (featuresDelayed.length > 0) {
          gsap.from(featuresDelayed, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      },
      once: true
    });
  }
  
  // About section animations
  const aboutTextElements = document.querySelectorAll('.about-text');
  const aboutImageElements = document.querySelectorAll('.about-image');
  
  if (aboutTextElements.length > 0) {
    gsap.set(aboutTextElements, { opacity: 0, x: -50 });
    
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 70%",
      onEnter: () => {
        gsap.to(aboutTextElements, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      },
      once: true
    });
  }
  
  if (aboutImageElements.length > 0) {
    gsap.set(aboutImageElements, { opacity: 0, x: 50 });
    
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 70%",
      onEnter: () => {
        gsap.to(aboutImageElements, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      },
      once: true
    });
  }
};
