
/**
 * OpenRouter API service for fast code conversion using DeepSeek
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
 * Optimized for speed and complex conversions
 */
export const convertReactToAngularUsingAI = async (
  reactCode: string,
  componentName: string
): Promise<string> => {
  try {
    console.log('Starting optimized AI conversion...');
    
    // Create a more focused prompt for faster processing
    const prompt = `
Convert this React component to Angular:
Component name: ${componentName}
React code:
\`\`\`jsx
${reactCode}
\`\`\`
Return ONLY the converted Angular code without explanations.`;

    // Use AbortController to set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
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
        messages: [{role: 'user', content: prompt}],
        temperature: 0.1, // Lower temperature for more consistent and faster responses
        max_tokens: 2000, // Reduced from 4000 to speed up response
        stream: false,    // No streaming for faster first-response
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const data: ApiResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    // Process the response to extract only the code
    const convertedCode = data.choices[0].message.content.trim();
    
    // Clean up the code - remove markdown formatting if present
    return convertedCode.replace(/```(typescript|angular|ts|html)?\n([\s\S]*?)```/g, '$2').trim();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Conversion timed out. Please try a smaller component or try again later.');
    }
    console.error('Conversion error:', error);
    throw error;
  }
};
