
# React to Angular Converter - Documentation

## Overview

The React to Angular Converter is a web application that allows developers to convert React components to Angular components using AI technology. The application provides a simple interface where users can input React code and receive the equivalent Angular code.

## Architecture Flow

```
┌─────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│                 │     │                   │     │                  │
│  User Interface │────►│ Conversion Logic  │────►│  OpenRouter API  │
│                 │     │                   │     │                  │
└─────────────────┘     └───────────────────┘     └──────────────────┘
        ▲                        │                         │
        │                        │                         │
        └────────────────────────┴─────────────────────────┘
                              Response
```

### Flow Description:

1. **User Input**: The user provides React component code through the UI.
2. **Preprocessing**: The application performs initial preprocessing, like detecting the component name.
3. **API Request**: The code is sent to OpenRouter API (using GPT-3.5-turbo) with instructions to convert to Angular.
4. **Response Processing**: The AI-generated Angular code is cleaned and formatted.
5. **Output Display**: The converted code is displayed to the user with options to copy or download.

## File Structure

```
src/
├── components/
│   ├── Button.tsx           # Reusable button component
│   ├── CodeEditor.tsx       # Code editor component for React/Angular code
│   ├── ConversionPanel.tsx  # Main panel for code conversion
│   ├── Footer.tsx           # Site footer
│   ├── Header.tsx           # Site header
│   └── ui/                  # UI components from shadcn/ui
│
├── hooks/
│   ├── use-mobile.tsx       # Hook for mobile detection
│   └── use-toast.ts         # Hook for toast notifications
│
├── pages/
│   ├── Index.tsx            # Main landing page
│   └── NotFound.tsx         # 404 page
│
├── services/
│   └── deepseekAPI.ts       # API service for conversion
│
├── utils/
│   ├── codeHighlighter.ts   # Utilities for code highlighting
│   └── codeTransformer.ts   # Utilities for code transformation
│
├── App.tsx                  # Main application component
└── main.tsx                 # Entry point
```

## Key Components

### ConversionPanel

This is the main component where users interact with the converter. It provides:
- Input area for React code
- Output area for Angular code
- Conversion button and utility buttons (copy, download)
- Status indicators during conversion

### deepseekAPI

This service handles the API communication with OpenRouter to leverage GPT-3.5-turbo for the code conversion:
- Formats and sends the request to the API
- Processes and cleans the response
- Handles errors and timeouts

## Conversion Process Details

1. **Component Detection**:
   - The application attempts to detect the React component name from the code
   - This is used for generating appropriate Angular component file names

2. **API Conversion**:
   - The React code is sent to OpenRouter API with GPT-3.5-turbo
   - The prompt instructs the model to convert React to Angular while maintaining functionality

3. **Response Cleaning**:
   - Removes any code block markers from the response
   - Ensures the output is clean, formatted Angular code

## User Interface Features

- **Code Editors**: Syntax-highlighted editors for both input and output
- **Status Messages**: Dynamic status messages during conversion process
- **File Type Labels**: Clear labeling of React (JSX) and Angular (TypeScript) code
- **Utility Functions**: Copy to clipboard and download as file
- **Error Handling**: Clear error messages if conversion fails

## Error Handling

The application handles several types of errors:
- Empty code submissions
- API request failures
- Timeout errors for large components
- Invalid or empty API responses

## Future Development

Potential enhancements for future versions:
- Support for batch conversions of multiple files
- More configuration options for output style
- Project-level conversion for entire React applications
- Offline conversion option using a client-side model
