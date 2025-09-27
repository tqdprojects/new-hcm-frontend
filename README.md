# VibhoHCM Frontend

React-based frontend application for the VibhoHCM Enterprise HRMS platform.

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Local state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard widgets
│   ├── Layout/         # Layout components
│   └── UI/             # Basic UI components
├── pages/              # Page components
│   ├── Auth/           # Login, register pages
│   ├── Dashboard/      # Dashboard pages
│   ├── Employees/      # Employee management
│   ├── Performance/    # Performance management
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # Zustand stores
├── providers/          # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Features

### Core Modules
- Employee Management
- Attendance Tracking
- Leave Management
- Performance Management
- Payroll Processing
- Recruitment
- Asset Management
- Document Management

### Performance Management
- Goal setting and tracking
- Review cycles
- Manager-employee workflows
- Calibration process
- Compensation linkage

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component and function names

### State Management
- Use Zustand for local UI state
- Use React Query for server state
- Avoid prop drilling with context when needed

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing (8px grid)
- Use semantic color names

### Performance
- Implement code splitting for routes
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper loading states

## API Integration

The frontend communicates with the backend API through:
- `apiClient.ts` - Axios-based HTTP client
- Service files for each module (e.g., `performanceApi.ts`)
- React Query hooks for data fetching
- Real-time updates via Socket.io

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## Deployment

The frontend can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

## Environment Variables

See `.env.example` for all available environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run linting and tests
5. Submit a pull request

## Support

For technical support or questions:
- Check the documentation
- Create an issue in the repository
- Contact the development team