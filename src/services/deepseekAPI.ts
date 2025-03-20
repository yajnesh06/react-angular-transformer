
/**
 * OpenRouter API service for accurate code conversion using DeepSeek
 */

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

type ApiResponse = {
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
 * Converts React code to Angular using the OpenRouter API with DeepSeek model
 */
export const convertReactToAngularUsingAI = async (
  reactCode: string,
  componentName: string
): Promise<string> => {
  try {
    console.log('Starting AI conversion process...');
    
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

    console.log('Sending request to OpenRouter API...');
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'React to Angular Converter'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    console.log('Received response from OpenRouter API:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API response not OK:', response.status, errorData);
      throw new Error(`API error: ${response.status} ${errorData}`);
    }

    const data: ApiResponse = await response.json();
    console.log('API Response data received:', !!data);

    if (data.error) {
      console.error('API returned error:', data.error);
      throw new Error(data.error.message);
    }

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from API');
    }

    // Extract the converted code from the response
    const convertedCode = data.choices[0].message.content.trim();
    console.log('Converted code received, length:', convertedCode.length);

    // Remove any markdown code blocks if present
    return convertedCode.replace(/```(typescript|angular|ts|html)?\n([\s\S]*?)```/g, '$2').trim();
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};
