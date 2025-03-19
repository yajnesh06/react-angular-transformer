
/**
 * DeepSeek API service for accurate code conversion
 */

const DEEPSEEK_API_KEY = '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';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

type DeepseekResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
};

/**
 * Converts React code to Angular using the DeepSeek API
 */
export const convertReactToAngularUsingAI = async (
  reactCode: string,
  componentName: string
): Promise<string> => {
  try {
    const prompt = `
Convert the following React component code to an Angular component.
Please follow these guidelines:
- Convert JSX to Angular template syntax
- Convert useState hooks to component properties
- Convert useEffect hooks to appropriate lifecycle methods
- Convert event handlers (onClick, onChange, etc.)
- Add proper Angular decorators (@Component, @Input, etc.)
- Ensure the code is valid TypeScript for Angular
- Make the component name: ${componentName}

React component code:
\`\`\`jsx
${reactCode}
\`\`\`

Return ONLY the converted Angular code without explanations, with proper indentation, ready to be used:
`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-coder',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.95,
        max_tokens: 4000
      })
    });

    const data: DeepseekResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from DeepSeek API');
    }

    // Extract the converted code from the response
    const convertedCode = data.choices[0].message.content.trim();

    // Remove any markdown code blocks if present
    return convertedCode.replace(/```(typescript|angular|ts|html)?\n([\s\S]*?)```/g, '$2').trim();
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};

// Fallback function that uses our existing transformer in case the API fails
export const fallbackConversion = (reactCode: string, componentName: string): string => {
  // Import the existing transformer
  const { transformReactToAngularComponent } = require('../utils/codeTransformer');
  return transformReactToAngularComponent(reactCode, componentName);
};
