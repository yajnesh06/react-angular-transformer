
# React to Angular Converter

A powerful web application that leverages AI to convert React components to Angular components with precision and elegance.



## Features

- **JSX to Angular Templates**: Convert JSX syntax to Angular templates with proper binding and directives
- **State & Props Conversion**: Transform React state and props to Angular @Input(), and component properties
- **Hooks Translation**: Convert React hooks to appropriate Angular lifecycle methods
- **Intelligent Conversion**: AI-powered translation that understands the patterns of both frameworks
- **Copy & Download**: Easily copy or download your converted Angular components
- **Error Handling**: Clear error messages and suggestions if conversion fails
- **Smooth Animations**: Enhanced user experience with GSAP animations and smooth scrolling

## How It Works

1. Paste your React component code into the editor
2. Click "Convert to Angular"
3. Get the equivalent Angular component with proper imports, decorators, and structure
4. Copy or download the result

The conversion is powered by OpenRouter API using GPT-3.5-turbo model, which has been trained to understand both React and Angular patterns and best practices.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenRouter API with GPT-3.5-turbo
- GSAP for animations
- Lenis for smooth scrolling

## Documentation

### Application Flow and Code Structure

#### Conversion Process Flow

```
┌──────────────────┐     ┌───────────────────────┐     ┌────────────────────┐
│  User Interface  │────►│  Conversion Service   │────►│  OpenRouter API    │
│ (ConversionPanel)│     │ (openRouterAPI.ts)    │     │  (GPT-3.5-turbo)   │
└──────────────────┘     └───────────────────────┘     └────────────────────┘
        ▲                            │                            │
        │                            ▼                            │
        │              ┌───────────────────────┐                 │
        └──────────────│   Response Handler    │◄────────────────┘
                       │ (codeTransformer.ts)  │
                       └───────────────────────┘
```

#### Key Components and Their Functions

1. **ConversionPanel.tsx**: The main UI component that manages:
   - Input area for React code
   - Output area for Angular code
   - Conversion button and utility controls
   - Error handling and loading states
   - Component name detection logic

2. **openRouterAPI.ts**: Core conversion service that:
   - Formats API requests with precise instructions
   - Handles communication with the OpenRouter API
   - Processes AI model responses
   - Applies post-processing to clean up the generated code
   - Manages error handling and timeouts

3. **codeTransformer.ts**: Utility for code processing that:
   - Extracts component names from React code
   - Sanitizes input and output code
   - Provides code validation functions
   - Handles code formatting and structure

4. **CodeEditor.tsx**: A specialized component that:
   - Provides syntax highlighting
   - Offers intuitive code editing experience
   - Supports different programming languages

5. **smoothScroll.ts**: Animation utility that:
   - Implements smooth scrolling with Lenis
   - Configures GSAP animations
   - Enhances user experience with subtle transitions

#### Code Transformation Process

The transformation from React to Angular follows these steps:

1. **Input Validation**: The user's React code is validated to ensure it contains valid component syntax.

2. **Component Analysis**: The code is analyzed to identify key elements:
   - Component name and type (functional/class)
   - State management patterns (useState, useReducer, Context)
   - Lifecycle methods and effects
   - Props structure and typing

3. **AI Transformation**: The validated code is sent to the OpenRouter API with detailed instructions:
   - JSX to Angular template conversion
   - React hooks to Angular lifecycle methods
   - State management to Angular services and properties
   - Event handlers to Angular event bindings

4. **Output Processing**: The AI-generated Angular code is:
   - Cleaned of any markdown formatting
   - Validated for syntax correctness
   - Structured following Angular best practices

5. **Delivery**: The processed Angular component is presented to the user with options to:
   - Copy to clipboard
   - Download as a file
   - Make further edits

#### Directory Structure

```
src/
├── components/             # UI Components
│   ├── Button.tsx          # Reusable button component
│   ├── CodeEditor.tsx      # Editor for code input/output
│   ├── ConversionPanel.tsx # Main conversion interface
│   ├── Footer.tsx          # Site footer
│   ├── Header.tsx          # Site navigation
│   └── ui/                 # shadcn/ui components
│
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx      # Responsive design detection
│   └── use-toast.ts        # Toast notification system
│
├── pages/                  # Application pages
│   ├── Index.tsx           # Main landing page
│   └── NotFound.tsx        # 404 error page
│
├── services/               # API and data services
│   └── openRouterAPI.ts    # AI conversion service
│
├── utils/                  # Utility functions
│   ├── codeHighlighter.ts  # Code syntax highlighting
│   ├── codeTransformer.ts  # Code transformation utilities
│   └── smoothScroll.ts     # Animation utilities
│
├── App.tsx                 # Application root component
└── main.tsx                # Entry point
```

#### Advanced Conversion Capabilities

The converter handles several complex React patterns and translates them to Angular:

1. **State Management**:
   - React's `useState` → Angular component properties with getters/setters
   - React's `useReducer` → Angular services with state management
   - Redux store/actions → NgRx store, actions, reducers, effects

2. **Context API to Dependency Injection**:
   - React Context providers → Angular services
   - `useContext` hooks → Service injection
   - Context consumers → Service dependency injection

3. **Lifecycle Methods**:
   - `useEffect` with empty deps → `ngOnInit`
   - `useEffect` with cleanup → `ngOnInit` + `ngOnDestroy`
   - `useEffect` with deps → Angular reactive patterns

4. **Templating Transformations**:
   - JSX expressions → Angular template syntax
   - Conditional rendering → `*ngIf` directives
   - List rendering → `*ngFor` with trackBy
   - Event handlers → Angular event bindings
   - Refs → ViewChild and ElementRef

5. **TypeScript Integration**:
   - React prop types → Angular input/output decorators
   - TypeScript interfaces → Angular class models
   - Generic types → Preserved in Angular components

### How to Use This Application

#### Use the web interface



#### Run locally

If you want to work locally using your own IDE, you can clone this repo and run it:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Conversion Examples

The converter handles various React patterns and features:

- Functional components with hooks
- Class components with lifecycle methods
- State management and props
- Event handlers and form inputs
- JSX expressions and conditional rendering
- Lists and array mapping

## How to edit this code?

There are several ways of editing this application:


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 


## License

This project is licensed under the MIT License - see the LICENSE file for details.
