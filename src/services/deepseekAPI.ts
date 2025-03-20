
/**
 * OpenRouter API service for React to Angular code conversion
 */

import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Converts React code to Angular using the OpenRouter API with GPT-3.5 model
 */
export const convertReactToAngularUsingAI = async (
  reactCode: string,
  componentName: string
): Promise<string> => {
  try {
    console.log('Starting AI conversion using axios...');
    
    const response = await axios.post(
      API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in both React and Angular. Convert React code to equivalent Angular code while maintaining functionality and best practices.'
          },
          {
            role: 'user',
            content: `Convert this React component named "${componentName}" to Angular. Include all necessary imports, decorators, and maintain component structure:\n\n${reactCode}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'React to Angular Converter',
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data || !response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
      console.error('API Response:', response.data);
      throw new Error('Invalid or empty response from the API');
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('API Choice:', response.data.choices[0]);
      throw new Error('No content in API response');
    }

    console.log('Conversion completed successfully');
    return content;
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
