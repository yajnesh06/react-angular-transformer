
# React to Angular Converter - Documentation

## Overview

The React to Angular Converter is a web application that allows developers to convert React components to Angular components using AI technology. The application provides a simple interface where users can input React code and receive the equivalent Angular code.

## Architecture Flow

```
┌─────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│                 │     │                   │     │                  │
│  User Interface │────►│ Conversion Logic  │────►│  OpenRouter API  │
│                 │     │                   │     │   (GPT-3.5-turbo) │
└─────────────────┘     └───────────────────┘     └──────────────────┘
        ▲                        │                         │
        │                        │                         │
        └────────────────────────┴─────────────────────────┘
                              Response
```

### Flow Description:

1. **User Input**: The user provides React component code through the UI.
2. **Preprocessing**: The application performs initial preprocessing, like detecting the component name.
3. **API Request**: The code is sent to OpenRouter API using GPT-3.5-turbo with instructions to convert to Angular.
4. **Response Processing**: The AI-generated Angular code is cleaned of markdown formatting and code block markers.
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
│   └── openRouterAPI.ts     # API service for conversion using GPT-3.5-turbo
│
├── utils/
│   ├── codeHighlighter.ts   # Utilities for code highlighting
│   ├── codeTransformer.ts   # Utilities for code transformation
│   └── smoothScroll.ts      # Utilities for smooth scrolling with Lenis and GSAP
│
├── App.tsx                  # Main application component
└── main.tsx                 # Entry point
```

## Key Components

### ConversionPanel

This is the main component where users interact with the converter. It provides:
- Input area for React code
- Output area for Angular code
- Conversion button and utility buttons (copy, download, clear)
- Status indicators during conversion
- Animated feedback for successful conversions and errors
- Auto-detection of component names

### openRouterAPI

This service handles the API communication with OpenRouter to leverage GPT-3.5-turbo for the code conversion:
- Formats and sends the request to the API
- Processes and cleans the response, removing code block markers
- Handles errors and timeouts
- Ensures no markdown formatting is returned in the final code

### smoothScroll

This utility provides smooth scrolling and animations using Lenis and GSAP:
- Smooth page scrolling with configurable easing
- GSAP animations for UI elements
- ScrollTrigger for scroll-based animations
- Helper functions for programmatic scrolling

## Conversion Process Details

1. **Component Detection**:
   - The application automatically detects the React component name from the code
   - This is used for generating appropriate Angular component file names and metadata

2. **API Conversion**:
   - The React code is sent to OpenRouter API with GPT-3.5-turbo
   - The prompt instructs the model to convert React to Angular while maintaining functionality
   - The system message specifically requests clean code without markdown or code block markers

3. **Response Cleaning**:
   - Additional cleaning is performed to remove any remaining code block markers
   - Any explanatory text is stripped to provide only the clean Angular code

4. **User Experience Enhancements**:
   - Animated status messages during conversion
   - Visual feedback for successful conversions and errors
   - Copy and download functions with success confirmations
   - GSAP animations for smooth transitions and feedback

## User Interface Features

- **Code Editors**: Syntax-highlighted editors for both input and output
- **Status Messages**: Dynamic, animated status messages during conversion process
- **File Type Labels**: Clear labeling of React (JSX) and Angular (TypeScript) code
- **Utility Functions**: Copy to clipboard and download as file with proper naming
- **Error Handling**: Clear error messages if conversion fails
- **Smooth Animations**: GSAP animations for smoother transitions and feedback
- **Auto-Detection**: Automatic detection of component names and structure

## Error Handling

The application handles several types of errors:
- Empty code submissions
- API request failures
- Timeout errors for large components
- Invalid or empty API responses
- Network connectivity issues

Each error is presented with clear messaging and visual feedback to help the user understand and resolve the issue.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn-ui
- **Animation**: GSAP, Lenis for smooth scrolling
- **API Integration**: Axios for API requests to OpenRouter
- **AI Model**: GPT-3.5-turbo via OpenRouter API
- **Build Tool**: Vite for fast development and building

## Future Development

Potential enhancements for future versions:
- Support for batch conversions of multiple files
- More configuration options for output style
- Project-level conversion for entire React applications
- Offline conversion option using a client-side model
- Advanced options for controlling the conversion process
- Support for custom TypeScript configurations
