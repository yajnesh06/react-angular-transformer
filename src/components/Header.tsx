
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10 
        ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-10 w-12  px-2 py-2 rounded-lg bg-apple-blue flex items-center justify-center">
            <span className="text-white font-semibold px-2 py-2 text-sm">R→A</span>
          </div>
          <span className="font-medium text-lg tracking-tight">React to Angular</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-apple-blue transition-colors">
              Converter
            </Link>
            <a 
              href="#features" 
              className="text-sm font-medium text-gray-700 hover:text-apple-blue transition-colors"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium text-gray-700 hover:text-apple-blue transition-colors"
            >
              About
            </a>
          </nav>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 text-gray-700 hover:text-apple-blue transition-colors"
            aria-label="GitHub Repository"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
