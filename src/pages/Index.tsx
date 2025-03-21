import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConversionPanel from '@/components/ConversionPanel';
import Button from '@/components/Button';
import { ArrowDown, Code, Repeat, TerminalSquare, MoveRight, Layers, Settings, GitBranch } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToElement, initAnimations } from '@/utils/smoothScroll';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure content is visible immediately
    setIsLoaded(true);
    
    // Initialize animations manually as a backup
    console.log("Index component mounted, initializing animations");
    const timer = setTimeout(() => {
      initAnimations();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleScrollToConverter = () => {
    scrollToElement('converter');
  };

  const features = [
    {
      icon: <Code className="h-8 w-8 text-apple-blue" />,
      title: 'JSX to Angular Templates',
      description: 'Convert JSX syntax to Angular templates with proper binding and directives.'
    },
    {
      icon: <Repeat className="h-8 w-8 text-apple-blue" />,
      title: 'State & Props Conversion',
      description: 'Transform React state and props to Angular @Input(), RxJS, and component properties.'
    },
    {
      icon: <TerminalSquare className="h-8 w-8 text-apple-blue" />,
      title: 'CLI Support',
      description: 'Process entire projects using our command-line interface for batch conversion.'
    },
    {
      icon: <Layers className="h-8 w-8 text-apple-blue" />,
      title: 'Lifecycle Methods',
      description: 'Map React hooks and lifecycle methods to Angular lifecycle hooks automatically.'
    },
    {
      icon: <GitBranch className="h-8 w-8 text-apple-blue" />,
      title: 'Routing Conversion',
      description: 'Transform React Router routes to Angular Router configuration with proper syntax.'
    },
    {
      icon: <Settings className="h-8 w-8 text-apple-blue" />,
      title: 'Customizable Output',
      description: 'Configure output format, indentation, and code style to match your preferences.'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 opacity-100`}>
      <Header />
      
      {/* Hero section */}
      <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 bg-apple-gray/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-sm font-medium mb-6 hero-badge">
              Transform with precision
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 hero-title">
              React to Angular Converter
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 hero-description">
              Convert your React components to Angular with precision and elegance. 
              A powerful tool for migrating codebases or learning framework differences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 hero-buttons">
            
              <a 
                href="#converter" 
                className="text-gray-600 flex items-center hover:text-apple-blue transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToConverter();
                }}
              >
                Try Web Converter <MoveRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="relative hero-arrow">
              <div className="absolute inset-0 bg-gradient-to-t from-apple-gray/30 to-transparent -bottom-8 pointer-events-none" />
              <ArrowDown className="mx-auto h-6 w-6 text-gray-400 animate-bounce" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Converter section */}
      <section id="converter" className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Try it yourself
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform React components into Angular with our intelligent converter. 
              Paste your React code and see the Angular output in real-time.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-blue-50 rounded-xl -rotate-1 scale-[1.03] opacity-50" />
            <div className="relative bg-white rounded-xl shadow-subtle p-6 md:p-8">
              <ConversionPanel />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" ref={featuresRef} className="py-16 md:py-24 px-6 md:px-10 bg-apple-gray/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Powerful conversion features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our converter handles everything from simple JSX to complex state management patterns.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-white rounded-xl p-8 shadow-subtle hover:shadow-elevation transition-shadow"
                style={{opacity: 1, transform: 'translateY(0)'}}
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-lg inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About section */}
      <section id="about" ref={aboutRef} className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 about-text">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Why convert from React to Angular?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                There are many reasons teams choose to migrate from React to Angular. 
                Perhaps your organization standardized on Angular, you need features 
                built into the Angular framework, or you're migrating a legacy React app.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Whatever your reason, our converter simplifies the process, providing 
                accurate translations that respect the patterns and paradigms of both frameworks.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our tool doesn't just translate syntax – it intelligently maps concepts 
                between frameworks, providing you with idiomatic Angular code.
              </p>
              <Button className="mt-4">
                Learn More About Migration
              </Button>
            </div>
            <div className="flex-1 flex justify-center about-image">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-blue-100 rounded-xl animate-float" />
                <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-apple-blue rounded-xl z-10 overflow-hidden flex items-center justify-center text-white font-mono p-8 shadow-elevation">
                  <div className="opacity-90">
                    <div className="mb-2">{"<React />"}</div>
                    <div className="text-3xl mb-2">→</div>
                    <div>{"<angular>"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-apple-blue text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to transform your code?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get started with our CLI tool or use the web converter for individual components.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              className="bg-white text-apple-blue hover:bg-gray-100"
            >
              Download CLI Tool
            </Button>
            <a 
              href="#converter" 
              className="text-white flex items-center opacity-90 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToConverter();
              }}
            >
              Continue with Web Converter <MoveRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
