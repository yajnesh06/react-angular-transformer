
// Advanced state management conversion utilities
// Handles conversion of React state management patterns to Angular equivalents

/**
 * Converts React useState hooks to Angular class properties and setters
 */
export const convertUseStateToAngular = (reactCode: string): string => {
  let angularCode = reactCode;
  
  // Convert useState hooks to class properties with setters
  angularCode = angularCode.replace(
    /const\s+\[([^,]+),\s*set([^\]]+)\]\s*=\s*useState(\<[^>]+\>)?\(([^)]*)\)/g, 
    (match, prop, setter, typeAnnotation, defaultValue) => {
      const propName = prop.trim();
      // Capitalize first letter of setter
      const setterName = setter.charAt(0).toUpperCase() + setter.slice(1).trim();
      const typeInfo = typeAnnotation ? typeAnnotation.replace(/[<>]/g, '') : 'any';
      
      return `${propName}: ${typeInfo} = ${defaultValue || 'null'};\n\n  set${setterName}(value: ${typeInfo}) {\n    this.${propName} = value;\n    // Consider using BehaviorSubject for reactive updates\n  }`;
    }
  );
  
  return angularCode;
};

/**
 * Converts React useReducer to Angular services with state management
 */
export const convertUseReducerToAngular = (reactCode: string): string => {
  let angularCode = reactCode;
  
  // First, extract reducer functions to be used in services
  const reducerMatches = [...reactCode.matchAll(/function\s+([a-zA-Z0-9_]+Reducer)\s*\(([^)]*)\)\s*{([\s\S]*?)}/g)];
  
  // Then convert useReducer hooks to Angular service references
  angularCode = angularCode.replace(
    /const\s+\[([^,]+),\s*([^\]]+)\]\s*=\s*useReducer\(([^,]+),\s*([^)]+)\)/g,
    (match, state, dispatch, reducer, initialState) => {
      const reducerName = reducer.trim();
      const serviceName = `${reducerName.replace('Reducer', '')}Service`;
      
      return `// Inject the service in constructor\nconstructor(private ${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}: ${serviceName}) {}\n\n  // Access state via this.${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}.state$\n  // Dispatch actions via this.${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}.dispatch(action)`;
    }
  );
  
  // For each found reducer, generate an Angular service template
  for (const reducerMatch of reducerMatches) {
    const reducerName = reducerMatch[1];
    const reducerParams = reducerMatch[2];
    const reducerBody = reducerMatch[3];
    const serviceName = reducerName.replace('Reducer', 'Service');
    
    // Add comment to suggest Angular service implementation
    angularCode += `\n\n/*
Generated Angular Service for ${reducerName}:

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${serviceName} {
  private stateSubject = new BehaviorSubject<any>(${reducerParams.includes(',') ? reducerParams.split(',')[1].trim() : 'initialState'});
  public state$ = this.stateSubject.asObservable();
  
  constructor() {}
  
  public dispatch(action: any): void {
    const currentState = this.stateSubject.getValue();
    const newState = this.reducer(currentState, action);
    this.stateSubject.next(newState);
  }
  
  private reducer(state: any, action: any): any {
    ${reducerBody.trim()}
  }
}
*/`;
  }
  
  return angularCode;
};

/**
 * Converts React Context API to Angular Dependency Injection
 */
export const convertContextApiToDI = (reactCode: string): string => {
  let angularCode = reactCode;
  
  // Convert createContext to Angular services
  angularCode = angularCode.replace(
    /const\s+([A-Z][a-zA-Z0-9_]*Context)\s*=\s*createContext\(([^)]*)\)/g,
    (match, contextName, defaultValue) => {
      const serviceName = contextName.replace('Context', 'Service');
      
      return `/*
Generated Angular Service for ${contextName}:

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${serviceName} {
  private valueSubject = new BehaviorSubject<any>(${defaultValue || 'null'});
  public value$ = this.valueSubject.asObservable();
  
  constructor() {}
  
  setValue(value: any): void {
    this.valueSubject.next(value);
  }
}
*/`;
    }
  );
  
  // Convert useContext hooks to service injection
  angularCode = angularCode.replace(
    /const\s+([a-zA-Z0-9_]+)\s*=\s*useContext\(([A-Z][a-zA-Z0-9_]*Context)\)/g,
    (match, variable, contextName) => {
      const serviceName = contextName.replace('Context', 'Service');
      
      return `// Inject in constructor:\n// constructor(private ${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}: ${serviceName}) {}\n\n// Access values via this.${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}.value$`;
    }
  );
  
  return angularCode;
};

/**
 * Converts React useEffect hooks to Angular lifecycle methods
 */
export const convertUseEffectToLifecycle = (reactCode: string): string => {
  let angularCode = reactCode;
  
  // Convert useEffect with empty dependency array to ngOnInit
  angularCode = angularCode.replace(
    /useEffect\(\(\)\s*=>\s*{([\s\S]*?)}\s*,\s*\[\s*\]\)/g,
    (match, effectBody) => {
      // Check for cleanup function
      if (effectBody.includes('return')) {
        const [setupCode, cleanupCode] = effectBody.split(/return\s*(?:function\s*\(\)\s*)?(?:\(\)\s*=>\s*)?{/);
        
        return `ngOnInit(): void {\n  ${setupCode.trim()}\n}\n\nngOnDestroy(): void {\n  ${cleanupCode.replace(/}$/, '').trim()}\n}`;
      }
      
      return `ngOnInit(): void {\n  ${effectBody.trim()}\n}`;
    }
  );
  
  // Convert useEffect with dependencies to ngOnChanges and property setters
  angularCode = angularCode.replace(
    /useEffect\(\(\)\s*=>\s*{([\s\S]*?)}\s*,\s*\[\s*([^\]]*)\s*\]\)/g,
    (match, effectBody, dependencies) => {
      if (!dependencies.trim()) return match; // Skip empty dependencies, already handled
      
      const deps = dependencies.split(',').map(d => d.trim());
      
      if (deps.length === 1) {
        // If single dependency, use setter pattern
        return `// For ${deps[0]} changes, use a setter or ngOnChanges\nprivate _${deps[0]} = this.${deps[0]};\n\nset ${deps[0]}(value: any) {\n  this._${deps[0]} = value;\n  ${effectBody.trim()}\n}\n\n// Alternative: implement OnChanges\nngOnChanges(changes: SimpleChanges): void {\n  if (changes['${deps[0]}']) {\n    ${effectBody.trim()}\n  }\n}`;
      } else {
        // For multiple dependencies use ngOnChanges
        return `// Implement OnChanges for multiple dependencies\nngOnChanges(changes: SimpleChanges): void {\n  if (${deps.map(d => `changes['${d}']`).join(' || ')}) {\n    ${effectBody.trim()}\n  }\n}`;
      }
    }
  );
  
  return angularCode;
};

/**
 * Converts Redux patterns to NGRX or NGXS
 */
export const convertReduxToNgrx = (reactCode: string): string => {
  let angularCode = reactCode;
  
  // Convert mapStateToProps and mapDispatchToProps to store select and dispatch
  angularCode = angularCode.replace(
    /const\s+mapStateToProps\s*=\s*\(state\)\s*=>\s*\(\s*{([\s\S]*?)}\s*\)/g,
    (match, stateSelections) => {
      const selections = stateSelections.split(',').map(s => s.trim());
      
      return `/* 
In Angular NGRX:
constructor(private store: Store) {}

// Create selectors in a separate file
${selections.map(s => `${s}$ = this.store.select(select${s.charAt(0).toUpperCase() + s.slice(1)});`).join('\n')}
*/`;
    }
  );
  
  angularCode = angularCode.replace(
    /const\s+mapDispatchToProps\s*=\s*\(dispatch\)\s*=>\s*\(\s*{([\s\S]*?)}\s*\)/g,
    (match, dispatchActions) => {
      const actions = dispatchActions.split(',').map(a => {
        const actionParts = a.split(':');
        const actionName = actionParts[0].trim();
        const actionCreator = actionParts[1]?.trim() || actionName;
        
        return `${actionName}() {\n  this.store.dispatch(${actionCreator}());\n}`;
      });
      
      return `/*
In Angular NGRX:
constructor(private store: Store) {}

// Action dispatchers
${actions.join('\n\n')}
*/`;
    }
  );
  
  // Convert connect to Angular component with store
  angularCode = angularCode.replace(
    /export\s+default\s+connect\(mapStateToProps,\s*mapDispatchToProps\)\(([A-Z][a-zA-Z0-9_]*)\)/g,
    (match, componentName) => {
      return `/*
In Angular NGRX:
@Component({
  selector: 'app-${componentName.toLowerCase()}',
  templateUrl: './${componentName.toLowerCase()}.component.html',
  styleUrls: ['./${componentName.toLowerCase()}.component.scss']
})
export class ${componentName}Component {
  constructor(private store: Store) {}
  
  // Selectors and action dispatchers as shown above
}
*/

export default ${componentName};`;
    }
  );
  
  return angularCode;
};
