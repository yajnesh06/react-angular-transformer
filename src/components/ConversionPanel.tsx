
import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Button from './Button';
import { ArrowRight, Download, Copy, RefreshCw } from 'lucide-react';
import { getSampleConversion } from '@/utils/codeTransformer';
import { convertReactToAngularUsingAI, fallbackConversion } from '@/services/deepseekAPI';
import { useToast } from '@/hooks/use-toast';

const ConversionPanel = () => {
  const [reactCode, setReactCode] = useState('');
  const [angularCode, setAngularCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState('');
  const [hasConverted, setHasConverted] = useState(false);
  const [componentName, setComponentName] = useState('AppComponent');
  const [useAI, setUseAI] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load sample code on initial render
    try {
      const { react, angular } = getSampleConversion();
      setReactCode(react);
      setAngularCode(angular);
      setHasConverted(true);
    } catch (err) {
      console.error('Error loading sample conversion:', err);
      setError('Failed to load sample code. Please try again.');
      toast({
        title: "Error Loading Samples",
        description: "Could not load sample code. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
    setConversionStatus('Preparing conversion...');
    
    try {
      // Try to auto-detect component name from code
      const nameMatch = reactCode.match(/function\s+([A-Z][a-zA-Z0-9_]*)/);
      const classMatch = reactCode.match(/class\s+([A-Z][a-zA-Z0-9_]*)/);
      const constMatch = reactCode.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=/);
      const exportMatch = reactCode.match(/export\s+default\s+([A-Z][a-zA-Z0-9_]*)/);
      
      const extractedName = nameMatch?.[1] || classMatch?.[1] || constMatch?.[1] || exportMatch?.[1] || componentName;
      
      if (extractedName !== componentName) {
        setComponentName(extractedName);
      }
      
      let result;

      if (useAI) {
        try {
          setConversionStatus('Sending request to AI service...');
          // Use the OpenRouter API with DeepSeek model for conversion
          result = await convertReactToAngularUsingAI(reactCode, extractedName);
          setConversionStatus('AI conversion complete');
          console.log('AI conversion successful');
          toast({
            title: "AI Conversion Complete",
            description: "React code has been converted to Angular using DeepSeek AI.",
          });
        } catch (error) {
          console.error('AI conversion error:', error);
          setConversionStatus('AI conversion failed, trying fallback...');
          toast({
            title: "AI Conversion Failed",
            description: "Falling back to built-in converter.",
            variant: "destructive",
          });
          // Fall back to the built-in converter
          result = fallbackConversion(reactCode, extractedName);
        }
      } else {
        // Use the built-in converter
        setConversionStatus('Using built-in converter...');
        console.log('Using built-in converter...');
        result = fallbackConversion(reactCode, extractedName);
        toast({
          title: "Conversion Complete",
          description: "React code has been converted to Angular using built-in converter.",
        });
      }
      
      if (result) {
        setAngularCode(result);
        setHasConverted(true);
      } else {
        throw new Error('Conversion returned empty result');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown conversion error';
      setError(errorMessage);
      setAngularCode(`// Conversion failed: ${errorMessage}\n// Please try again or use the built-in converter.`);
      toast({
        title: "Conversion Error",
        description: "Failed to convert the React code. Please check your input or try the built-in converter.",
        variant: "destructive",
      });
    } finally {
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
    setError(null);
  };

  const toggleConversionMode = () => {
    setUseAI(!useAI);
    toast({
      title: useAI ? "Using Built-in Converter" : "Using AI Converter",
      description: useAI 
        ? "Switched to built-in conversion algorithm." 
        : "Switched to DeepSeek AI conversion for better accuracy.",
    });
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
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
            placeholder={isConverting ? conversionStatus || "Converting..." : "Angular component will appear here..."}
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
          <Button
            variant="outline"
            size="sm"
            onClick={toggleConversionMode}
            className={`flex items-center ${useAI ? 'bg-blue-50' : ''}`}
          >
            {useAI ? 'Using AI (DeepSeek)' : 'Using Built-in Converter'}
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
