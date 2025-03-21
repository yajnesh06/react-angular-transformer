import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Converts React code to Angular using OpenRouter AI with GPT-3.5/4 model.
 */
export const convertReactToAngularUsingAI = async (
  reactCode: string,
  componentName: string
): Promise<string> => {
  try {
    console.log('Starting AI conversion...');

    const response = await axios.post(
      API_URL,
      {
        model: 'openai/gpt-3.5-turbo', // Upgrade model for better accuracy
        messages: [
          {
            role: 'system',
            content: `
You are an expert in React and Angular. Convert React code into Angular while ensuring:
- Replace all React hooks ('useState', 'useEffect', etc.) with Angular's equivalents ('ngOnInit', services).
- Convert functional React components into Angular components using '@Component' with lifecycle methods ('ngOnInit', 'ngOnDestroy').
- Map React props and Context API to Angular’s '@Input()' and '@Output()'.
- Translate event listeners ('onClick', 'onChange') to Angular's '(event)="function()"' syntax.
- Convert JSX expressions and conditional rendering ('&&', ternary) to Angular's '*ngIf'.
- Convert array '.map()' rendering to Angular’s '*ngFor', ensuring 'trackBy' is used for optimization.
- Convert Higher-Order Components (HOCs) into Angular Directives.
- Handle React portals and 'useRef' using '@ViewChild' and 'ViewContainerRef'.
- Ensure lazy loading and dynamic rendering using 'NgModule' & 'DynamicComponentLoader'.
- Convert React Redux/Context API-based state management to Angular Services with Dependency Injection.
- Ensure proper use of 'RxJS' for handling API calls and reactive state.
- Optimize component communication using '@Input()', '@Output()', and Angular event emitters.
- Ensure all TypeScript types are correctly defined.
- Follow Angular best practices, including modularization, service-based logic separation, and efficient DOM updates.
- Use 'async' pipes in templates where applicable to handle observables efficiently.
- Maintain clean, readable, and maintainable code that adheres to Angular style guidelines.
- Return ONLY the Angular code. Do NOT include markdown formatting, explanations, or extra text.
            `
          },
          {
            role: 'user',
            content: `
Convert this React component named "${componentName}" into Angular while preserving all functionalities.
Ensure that:
- React state, hooks, and effects are properly mapped to Angular equivalents.
- Props, Context API, and Redux state are mapped to Angular Services and '@Input()'.
- Any lifecycle logic ('useEffect', 'componentDidMount') is properly handled using Angular lifecycle hooks ('ngOnInit', 'ngOnDestroy').
- Handle complex UI logic such as dynamic rendering ('Suspense', '.map()', conditionals) using Angular directives ('*ngIf', '*ngFor').
- Return ONLY the Angular code. Do not include markdown formatting, explanations, or unnecessary text.

React Code:
${reactCode}
            `
          }
        ],
        temperature: 0.2, // Lower temperature for more deterministic results
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-Title': 'React to Angular Converter',
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30-second timeout
      }
    );

    // Validate API response
    if (!response.data || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
      console.error('API Response:', response.data);
      throw new Error('Invalid or empty response from the API');
    }

    let angularCode = response.data.choices[0]?.message?.content?.trim();
    if (!angularCode) {
      console.error('API Choice:', response.data.choices[0]);
      throw new Error('No content in API response');
    }

    // Sanitize output: Remove unwanted markdown code block markers if present
    angularCode = angularCode.replace(/```[\s\S]*?```/g, '').trim();

    console.log('Conversion completed successfully');
    return angularCode;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Conversion timed out. Please try a smaller component.');
      }
      const errorMessage = error.response?.data?.error || error.message;
      console.error('API Error:', errorMessage);
      throw new Error(`API Error: ${errorMessage}`);
    }
    console.error('Unknown Error:', error);
    throw error;
  }
};
