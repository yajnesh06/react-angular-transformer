// This is a more comprehensive code transformation from React to Angular
// In a real implementation, we'd use Babel and TypeScript Compiler API for robust parsing

import { 
  convertUseStateToAngular, 
  convertUseReducerToAngular, 
  convertContextApiToDI, 
  convertUseEffectToLifecycle,
  convertReduxToNgrx
} from './advancedStateConverter';

/**
 * Transform React JSX code to Angular Template
 */
export const transformJSXToAngular = (reactCode: string): string => {
  if (!reactCode.trim()) return '';
  
  // Make a copy of the code we'll transform
  let angularCode = reactCode;
  
  // Convert event handlers: onClick to (click), onChange to (change), etc.
  angularCode = angularCode.replace(/onClick={([^}]+)}/g, '(click)="$1"');
  angularCode = angularCode.replace(/onChange={([^}]+)}/g, '(change)="$1"');
  angularCode = angularCode.replace(/onSubmit={([^}]+)}/g, '(submit)="$1"');
  angularCode = angularCode.replace(/onBlur={([^}]+)}/g, '(blur)="$1"');
  angularCode = angularCode.replace(/onFocus={([^}]+)}/g, '(focus)="$1"');
  
  // Convert className to class
  angularCode = angularCode.replace(/className="/g, 'class="');
  
  // Convert inline styles: style={{ color: 'red' }} to [style.color]="'red'"
  angularCode = angularCode.replace(/style={{([^}]+)}}/g, (match, styleContent) => {
    // Parse the style properties
    const styles = styleContent.split(',');
    const angularStyles = styles.map(style => {
      const [key, value] = style.split(':').map(s => s.trim());
      // Remove quotes from key if present
      const cleanKey = key.replace(/['"]/g, '');
      return `[style.${cleanKey}]=${value}`;
    });
    return angularStyles.join(' ');
  });
  
  // Convert simple expressions: {variable} to {{variable}} but avoid double conversion
  // First, we'll mark expressions we've already processed with a special marker
  angularCode = angularCode.replace(/{([^{}]+)}/g, (match, content) => {
    // Skip if it's already in Angular format or has special syntax
    if (content.includes('*ngIf') || content.includes('*ngFor') || 
        content.startsWith('{') || content.endsWith('}') ||
        content.includes('?') || content.includes(':')) {
      return match;
    }
    return `{{${content}}}`;
  });
  
  // Convert ternary expressions to ngIf
  angularCode = angularCode.replace(
    /{([^{}?:]+)\s*\?\s*([^{}:]+)\s*:\s*([^{}]+)}/g,
    '<ng-container *ngIf="$1">$2</ng-container><ng-container *ngIf="!($1)">$3</ng-container>'
  );
  
  // Convert array mapping (e.g., items.map) to *ngFor
  angularCode = angularCode.replace(
    /{([^{}]+)\.map\(\(([^)]+)\)\s*=>\s*\(([^{}]+)\)\)}/g,
    '<ng-container *ngFor="let $2 of $1">$3</ng-container>'
  );
  
  // Convert useEffect to ngOnInit/ngOnDestroy
  angularCode = angularCode.replace(
    /useEffect\(\(\)\s*=>\s*{([^{}]+)}\s*,\s*\[\]\)/g,
    'ngOnInit() {$1}'
  );
  
  angularCode = angularCode.replace(
    /useEffect\(\(\)\s*=>\s*{([^{}]+return\s*\(\)\s*=>\s*{([^{}]+)})}\s*,\s*\[\]\)/g,
    'ngOnInit() {$1\nngOnDestroy() {$2}'
  );
  
  // Convert useState to Component properties
  angularCode = angularCode.replace(
    /const\s+\[([^,]+),\s*set([^\]]+)\]\s*=\s*useState\(([^)]*)\)/g, 
    (match, prop, setter, defaultValue) => {
      const propName = prop.trim();
      // Capitalize first letter of setter
      const setterName = setter.trim();
      return `${propName}: any = ${defaultValue || 'null'};\n  
  set${setterName}(value: any) {
    this.${propName} = value;
  }`;
    }
  );
  
  return angularCode;
};

/**
 * Transform React component to Angular Component
 */
export const transformReactToAngularComponent = (
  reactCode: string,
  componentName = 'AppComponent'
): string => {
  try {
    // Extract JSX from functional component
    const jsxMatch = reactCode.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
    const jsxCode = jsxMatch ? jsxMatch[1] : '';
    
    // For class components we would need a different approach
    const isClassComponent = reactCode.includes('extends React.Component') || reactCode.includes('extends Component');
    
    // First apply advanced state management conversions
    let processedCode = reactCode;
    
    // Apply state management conversions
    processedCode = convertUseStateToAngular(processedCode);
    processedCode = convertUseReducerToAngular(processedCode);
    processedCode = convertContextApiToDI(processedCode);
    processedCode = convertUseEffectToLifecycle(processedCode);
    processedCode = convertReduxToNgrx(processedCode);
    
    // Extract hooks and state from the processed code
    const stateMatches = [...processedCode.matchAll(/const\s+\[([^,]+),\s*set([^\]]+)\]\s*=\s*useState\(([^)]*)\)/g)];
    const effectMatches = [...processedCode.matchAll(/useEffect\(\(\)\s*=>\s*{([\s\S]*?)}\s*,\s*\[(.*?)]\)/g)];
    
    // Extract functions and handlers
    const functionMatches = [...processedCode.matchAll(/const\s+([a-zA-Z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>\s*{([\s\S]*?)}/g)];
    
    // Convert JSX to Angular Template
    const template = transformJSXToAngular(jsxCode);
    
    // Generate Angular Component with state management
    let angularComponent = `import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  template: \`
${template}
  \`,
  styleUrls: ['./${componentName.toLowerCase()}.component.scss']
})
export class ${componentName} implements OnInit`;
    
    if (effectMatches.some(match => match[0].includes('return () =>'))) {
      angularComponent += ', OnDestroy';
    }
    
    if (processedCode.includes('ngOnChanges')) {
      angularComponent += ', OnChanges';
    }
    
    angularComponent += ` {
  // Properties converted from React state
`;
    
    // Add state properties
    stateMatches.forEach(match => {
      const propName = match[1].trim();
      const defaultValue = match[3].trim() || 'null';
      angularComponent += `  ${propName}: any = ${defaultValue};\n`;
    });
    
    angularComponent += `
  constructor() {}
  
`;
    
    // Add lifecycle methods from processed code
    if (processedCode.includes('ngOnInit')) {
      const ngOnInitMatch = processedCode.match(/ngOnInit\(\):\s*void\s*{([\s\S]*?)}/);
      if (ngOnInitMatch) {
        angularComponent += `  ngOnInit(): void {
    ${ngOnInitMatch[1].trim()}
  }
  
`;
      }
    }
    
    if (processedCode.includes('ngOnDestroy')) {
      const ngOnDestroyMatch = processedCode.match(/ngOnDestroy\(\):\s*void\s*{([\s\S]*?)}/);
      if (ngOnDestroyMatch) {
        angularComponent += `  ngOnDestroy(): void {
    ${ngOnDestroyMatch[1].trim()}
  }
  
`;
      }
    }
    
    if (processedCode.includes('ngOnChanges')) {
      const ngOnChangesMatch = processedCode.match(/ngOnChanges\(changes:\s*SimpleChanges\):\s*void\s*{([\s\S]*?)}/);
      if (ngOnChangesMatch) {
        angularComponent += `  ngOnChanges(changes: SimpleChanges): void {
    ${ngOnChangesMatch[1].trim()}
  }
  
`;
      }
    }
    
    // Add methods
    functionMatches.forEach(match => {
      const funcName = match[1].trim();
      const params = match[2].trim();
      const body = match[3].trim();
      
      angularComponent += `  ${funcName}(${params}): void {
    ${body}
  }
  
`;
    });
    
    angularComponent += '}';
    
    return angularComponent;
  } catch (error) {
    console.error('Error transforming React to Angular:', error);
    return `/* Conversion error: ${error instanceof Error ? error.message : String(error)} */\n\n${reactCode}`;
  }
};

// Sample demo conversion for the UI
export const getSampleConversion = (): { react: string; angular: string } => {
  const reactCode = `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
    
    return () => {
      document.title = 'React App';
    };
  }, [count]);
  
  const handleIncrement = () => {
    setCount(count + 1);
    setIsEven((count + 1) % 2 === 0);
  };
  
  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={handleIncrement}>
        Increment
      </button>
      <div>
        {isEven ? <span>Even</span> : <span>Odd</span>}
      </div>
      <ul>
        {[1, 2, 3].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Counter;`;

  const angularCode = transformReactToAngularComponent(reactCode, 'Counter');
  
  return { react: reactCode, angular: angularCode };
};
