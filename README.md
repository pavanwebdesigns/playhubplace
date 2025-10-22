# Play

A modern React application built with Vite and styled with Tailwind CSS.

## Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 18** - Modern React with TypeScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Mobile-first responsive design
- 🧩 **Components** - Reusable UI components

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd play
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   └── Card.tsx        # Card component
├── assets/             # Static assets
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles with Tailwind directives
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tailwind CSS Configuration

The project is configured with Tailwind CSS v4 with the following features:

- **Content paths**: Configured to scan all HTML, JS, TS, JSX, and TSX files
- **Dark mode**: Uses the `class` strategy for dark mode
- **Custom components**: Reusable Button and Card components with Tailwind classes

## Components

### Button Component

A flexible button component with multiple variants and sizes:

```tsx
<Button 
  variant="primary" 
  size="lg" 
  onClick={() => console.log('clicked')}
>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: function

### Card Component

A reusable card component for content containers:

```tsx
<Card title="Card Title" description="Card description">
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `title`: string (optional)
- `description`: string (optional)
- `className`: string (optional)

## Customization

### Adding New Tailwind Classes

The Tailwind configuration is in `tailwind.config.js`. You can extend the theme, add custom colors, or modify the configuration as needed.

### Styling Guidelines

- Use Tailwind utility classes for styling
- Follow the mobile-first approach
- Use semantic color names (e.g., `text-gray-800` instead of `text-black`)
- Leverage dark mode classes (`dark:text-white`, `dark:bg-gray-800`)

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

MIT