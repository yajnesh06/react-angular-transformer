
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'html';
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  label?: string;
}

const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  placeholder = 'Enter code here...',
  readOnly = false,
  className,
  label,
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, [value]);

  return (
    <div className={cn('relative flex flex-col', className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
            {language.toUpperCase()}
          </div>
        </div>
      )}
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg border bg-white transition-all",
          readOnly ? "border-gray-200" : "border-gray-300 focus-within:border-apple-blue focus-within:ring-1 focus-within:ring-apple-blue/20"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "w-full h-full min-h-[200px] outline-none p-4 text-sm font-mono resize-none bg-transparent",
            readOnly ? "text-gray-700" : "text-gray-900"
          )}
          style={{ 
            tabSize: 2,
            WebkitTextFillColor: readOnly ? 'rgba(0, 0, 0, 0.7)' : 'unset',
          }}
        />

        {/* Language tag */}
        {readOnly && (
          <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded bg-gray-100/80 text-gray-600 backdrop-blur-sm">
            {language === 'javascript' ? 'JSX' : language === 'html' ? 'Angular' : language.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
