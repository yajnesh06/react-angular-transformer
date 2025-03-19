
import { Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-12 bg-apple-gray/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-apple-blue flex items-center justify-center">
                <span className="text-white font-semibold text-sm">R→A</span>
              </div>
              <span className="font-medium text-lg tracking-tight">React to Angular</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Transforming React components into Angular with precision and elegance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-apple-blue transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-apple-blue transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="mailto:hello@example.com" 
                className="text-gray-400 hover:text-apple-blue transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  CLI Tool
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Angular Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  React Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Migration Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Best Practices
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-apple-blue transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} React to Angular. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-apple-blue transition-colors">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-apple-blue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
