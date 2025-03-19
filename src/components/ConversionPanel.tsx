
import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Button from './Button';
import { ArrowRight, Download, Copy, RefreshCw } from 'lucide-react';
import { transformReactToAngularComponent, getSampleConversion } from '@/utils/codeTransformer';
import { useToast } from '@/hooks/use-toast';

const ConversionPanel = () => {
  const [reactCode, setReactCode] = useState('');
  const [angularCode, setAngularCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [hasConverted, setHasConverted] = useState(false);
  const [componentName, setComponentName] = useState('AppComponent');
  const { toast } = useToast();

  useEffect(() => {
    // Load sample code on initial render
    const { react, angular } = getSampleConversion();
    setReactCode(react);
    setAngularCode(angular);
    setHasConverted(true);
  }, []);

  const handleConvert = () => {
    if (!reactCode.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some React code to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        // Try to auto-detect component name from code
        const nameMatch = reactCode.match(/function\s+([A-Z][a-zA-Z0-9_]*)/);
        const classMatch = reactCode.match(/class\s+([A-Z][a-zA-Z0-9_]*)/);
        const exportMatch = reactCode.match(/export\s+default\s+([A-Z][a-zA-Z0-9_]*)/);
        
        const extractedName = nameMatch?.[1] || classMatch?.[1] || exportMatch?.[1] || componentName;
        
        if (extractedName !== componentName) {
          setComponentName(extractedName);
        }
        
        const result = transformReactToAngularComponent(reactCode, extractedName);
        setAngularCode(result);
        setHasConverted(true);
        setIsConverting(false);
        
        toast({
          title: "Conversion Complete",
          description: "React code has been converted to Angular.",
        });
      } catch (error) {
        console.error('Conversion error:', error);
        toast({
          title: "Conversion Error",
          description: "Failed to convert the React code. Please check your input.",
          variant: "destructive",
        });
        setIsConverting(false);
      }
    }, 800);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(angularCode);
    toast({
      title: "Copied!",
      description: "Angular code copied to clipboard.",
    });
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
  };

  const handleClearCode = () => {
    setReactCode('');
    setAngularCode('');
    setHasConverted(false);
    setComponentName('AppComponent');
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="animate-slide-in-left [animation-delay:200ms]">
          <CodeEditor
            value={reactCode}
            onChange={setReactCode}
            language="javascript"
            placeholder="Paste your React component code here..."
            label="React Component"
            className="h-full"
          />
        </div>

        <div className="flex flex-col animate-slide-in-right [animation-delay:300ms]">
          <CodeEditor
            value={angularCode}
            language="typescript"
            readOnly
            placeholder="Angular component will appear here..."
            label="Angular Component"
            className="h-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-100 animate-slide-up [animation-delay:400ms]">
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
                className="flex items-center"
              >
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center"
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
        >
          {!isConverting && <ArrowRight size={16} className="ml-2" />}
          {isConverting ? "Converting..." : "Convert to Angular"}
        </Button>
      </div>
    </div>
  );
};

export default ConversionPanel;
