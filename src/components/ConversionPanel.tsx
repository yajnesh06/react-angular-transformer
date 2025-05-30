import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Button from './Button';
import { ArrowRight, Download, Copy, RefreshCw, Code, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { convertReactToAngularUsingAI } from '@/services/openRouterAPI';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

const ConversionPanel = () => {
  const [reactCode, setReactCode] = useState('');
  const [angularCode, setAngularCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState('');
  const [hasConverted, setHasConverted] = useState(false);
  const [componentName, setComponentName] = useState('AppComponent');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Apply animations when panel is mounted
  useEffect(() => {
    const animation = gsap.timeline();
    animation.fromTo('.conversion-panel', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // Simple sample React component for first load
  useEffect(() => {
    const sampleReact = `
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default Counter;`;

    setReactCode(sampleReact);
  }, []);

  const detectComponentName = (code: string): string => {
    // Auto-detect component name from code
    const nameMatch = code.match(/function\s+([A-Z][a-zA-Z0-9_]*)/);
    const classMatch = code.match(/class\s+([A-Z][a-zA-Z0-9_]*)/);
    const constMatch = code.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=/);
    const exportMatch = code.match(/export\s+default\s+([A-Z][a-zA-Z0-9_]*)/);
    
    return nameMatch?.[1] || classMatch?.[1] || constMatch?.[1] || exportMatch?.[1] || 'AppComponent';
  };

  const handleConvert = async () => {
    if (!reactCode.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some React code to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setError(null);
    setAngularCode(''); // Clear previous conversion
    
    // Set a series of status messages to make the process feel more responsive
    const statusMessages = [
      "Analyzing React component structure...",
      "Identifying component lifecycle hooks...",
      "Converting JSX to Angular template...",
      "Adapting state management...",
      "Finalizing Angular component..."
    ];
    
    // Display changing status messages while converting
    let messageIndex = 0;
    const statusInterval = setInterval(() => {
      if (messageIndex < statusMessages.length) {
        setConversionStatus(statusMessages[messageIndex]);
        messageIndex++;
      }
    }, 1000);
    
    try {
      // Detect component name from code
      const extractedName = detectComponentName(reactCode);
      if (extractedName !== componentName) {
        setComponentName(extractedName);
      }
      
      // Convert code with optimized service
      const result = await convertReactToAngularUsingAI(reactCode, extractedName);
      
      if (result) {
        // Animate the appearance of the result
        setAngularCode('');
        setTimeout(() => {
          setAngularCode(result);
          
          // Add animation for the success indicator
          gsap.fromTo('.success-indicator',
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' }
          );
        }, 300);
        
        setHasConverted(true);
        toast({
          title: "Conversion Complete",
          description: `Successfully converted "${extractedName}" to Angular.`,
        });
      } else {
        throw new Error('Received empty response from conversion service');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown conversion error';
      setError(errorMessage);
      setAngularCode('// Conversion failed. Please try again with a simpler component.');
      toast({
        title: "Conversion Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Animate error appearance
      gsap.fromTo('.error-message',
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } finally {
      clearInterval(statusInterval);
      setIsConverting(false);
      setConversionStatus('');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(angularCode);
    toast({
      title: "Copied!",
      description: "Angular code copied to clipboard.",
    });
    
    // Add a brief animation to the copy button
    gsap.fromTo('.copy-button',
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
    );
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([angularCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    // Use component name for the file name
    const fileName = `${componentName.toLowerCase()}.component.ts`;
    element.download = fileName;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: `Angular component file '${fileName}' has been downloaded.`,
    });
    
    // Add a brief animation to the download button
    gsap.fromTo('.download-button',
      { y: 0 },
      { y: 3, yoyo: true, repeat: 1, duration: 0.2, ease: 'power1.inOut' }
    );
  };

  const handleClearCode = () => {
    setReactCode('');
    setAngularCode('');
    setHasConverted(false);
    setComponentName('AppComponent');
    setError(null);
    
    // Add animation for clearing
    gsap.fromTo(['.react-editor', '.angular-editor'],
      { opacity: 1 },
      { opacity: 0, duration: 0.2, stagger: 0.1, ease: 'power1.inOut', onComplete: () => {
        gsap.to(['.react-editor', '.angular-editor'], { opacity: 1, duration: 0.3 });
      }}
    );
  };

  return (
    <div className="w-full conversion-panel">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 error-message">
          <p className="font-medium flex items-center">
            <AlertCircle size={16} className="mr-1" /> Error:
          </p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="react-editor">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <Code size={16} className="mr-1" /> React Component
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">JSX</span>
          </div>
          <CodeEditor
            value={reactCode}
            onChange={setReactCode}
            language="javascript"
            placeholder="Paste your React component code here..."
            label="React Component"
            className="h-full"
          />
        </div>

        <div className="flex flex-col angular-editor">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <FileCode size={16} className="mr-1" /> Angular Component
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">TypeScript</span>
          </div>
          <CodeEditor
            value={angularCode}
            language="typescript"
            readOnly
            placeholder={isConverting ? "Converting..." : "Angular component will appear here..."}
            label="Angular Component"
            className={cn("h-full", hasConverted && "success-indicator")}
          />
          
          {isConverting && (
            <div className="mt-2 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-apple-blue mr-2"></div>
              <span className="text-sm text-gray-600">{conversionStatus || 'Converting your component...'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-3 mb-4 sm:mb-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCode}
            className="flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Clear
          </Button>
          {hasConverted && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center copy-button"
              >
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center download-button"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
        
        <Button
          onClick={handleConvert}
          className="flex items-center px-6"
          isLoading={isConverting}
          disabled={isConverting}
        >
          {!isConverting && <ArrowRight size={16} className="ml-2" />}
          {isConverting ? "Converting..." : "Convert to Angular"}
        </Button>
      </div>
    </div>
  );
};

export default ConversionPanel;
