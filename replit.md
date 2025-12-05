# Design Oracle AI - Replit Agent Guide

## Overview

Design Oracle AI is an AI-powered design critique application that provides professional feedback on visual designs. Users upload design images and receive detailed analysis covering overall impression, visual hierarchy, typography, color analysis, composition, and actionable improvements. The application features a modern split-panel interface with interactive 3D visualizations powered by React Three Fiber.

The system uses Google's Gemini AI models (with light/heavy model options) to analyze design images and generate structured critiques presented in an engaging card-based interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with shadcn/ui component library (New York style variant)

**UI Component Strategy:**
The application uses shadcn/ui components with extensive customization. Components follow a design system with:
- Custom CSS variables for theming (light/dark mode support)
- Glass morphism effects and 3D visual elements
- Consistent spacing system based on Tailwind units (4, 6, 8, 12, 16, 24)
- Typography hierarchy using Inter (body) and Space Grotesk (headings)

**3D Visualization:**
- React Three Fiber (@react-three/fiber) for 3D rendering
- Drei (@react-three/drei) for helper components
- Custom 3D components: AnimatedOctahedron, ParticleField, FloatingCube, UploadScene, LoadingScene, BackgroundScene
- 3D elements enhance user experience during upload, loading, and background ambiance

**State Management:**
- React hooks for local component state
- TanStack Query for API data fetching and caching
- Theme context provider for light/dark mode
- Form state managed with react-hook-form (via @hookform/resolvers)

**Layout Structure:**
- Full-screen split-panel design (not implemented as ResizablePanel but conceptually split)
- Left panel: Image upload zone with 3D frame visualization
- Right panel: Scrollable grid of critique cards
- Fixed header with branding, model toggle, theme toggle, and about button
- Modal overlay for About page

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Node.js with ESM modules
- HTTP server created via Node's native `createServer`

**API Design:**
- RESTful endpoint: `POST /api/analyze`
- Request/response validation using Zod schemas
- Structured error handling with typed responses
- Processing time tracking for analytics

**AI Integration:**
- Google Gemini API (@google/genai package)
- Two model options: "gemini-2.5-pro" (heavy) and "gemini-2.5-flash" (light)
- Custom prompt engineering for structured design critique responses
- JSON response parsing with fallback handling for markdown-wrapped responses
- Image analysis via base64-encoded data URIs

**Request Flow:**
1. Client uploads image (base64 encoded) with model preference
2. Server validates request schema
3. AI service processes image with design critique prompt
4. Response parsed and validated against DesignCritique schema
5. Structured response returned with processing time and model metadata

**Build Process:**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.cjs`
- Server bundling includes allowlisted dependencies to reduce cold start syscalls
- Static file serving from built client assets

### Data Storage Solutions

**Current Implementation:**
- In-memory storage implementation (MemStorage class)
- Storage interface defined for potential database migration
- User schema defined but not actively used (future expansion)

**Database Preparation:**
- Drizzle ORM configured for PostgreSQL
- Schema file location: `shared/schema.ts`
- Migration output directory: `./migrations`
- Database credentials expected via `DATABASE_URL` environment variable
- Note: Database is configured but may not be actively used; application currently stateless

**Schema Definitions:**
All data structures defined using Zod schemas in `shared/schema.ts`:
- `DesignCritique`: Analysis results with scores and improvements
- `AnalyzeRequest`: Image data and model selection
- `AnalyzeResponse`: Success/error states with critique and metadata
- `SuggestionCard`: UI card representation of critique categories

### Authentication and Authorization

**Current State:**
- No authentication implemented
- Public access to all features
- Storage interface includes user methods (getUser, getUserByUsername, createUser) for future implementation

**Prepared Infrastructure:**
Dependencies installed for future auth implementation:
- passport and passport-local
- express-session with connect-pg-simple store
- jsonwebtoken for token management
- bcrypt for password hashing (implied by user schema pattern)

## External Dependencies

### Third-Party Services

**Google Gemini AI:**
- Service: Google Generative AI API
- Authentication: API key via `GEMINI_API_KEY` environment variable
- Models used: gemini-2.5-pro, gemini-2.5-flash
- Purpose: Design image analysis and critique generation
- API Package: @google/genai v1.31.0

### Database Services

**PostgreSQL (Prepared):**
- ORM: Drizzle with drizzle-kit for migrations
- Connection: Via `DATABASE_URL` environment variable
- Session store: connect-pg-simple (configured but may not be active)
- Note: Database infrastructure is ready but application currently operates statelessly

### Build and Development Tools

**Vite:**
- Development server with HMR
- Custom plugins: runtime error modal, cartographer (Replit), dev banner (Replit)
- Path aliases: @ → client/src, @shared → shared, @assets → attached_assets

**TypeScript:**
- Strict mode enabled
- Path resolution via tsconfig baseUrl and paths
- ESNext module system with bundler resolution

### UI Libraries

**shadcn/ui:**
- Radix UI primitives for accessible components
- Tailwind CSS for styling
- Custom theme with CSS variables
- Components configured in components.json

**3D Graphics:**
- Three.js (peer dependency of React Three Fiber)
- @react-three/fiber for React integration
- @react-three/drei for utility components

### Utility Libraries

**Frontend:**
- class-variance-authority: Component variant management
- clsx + tailwind-merge: Conditional className utilities
- react-dropzone: File upload interface
- date-fns: Date formatting
- lucide-react: Icon system
- cmdk: Command palette infrastructure

**Backend:**
- multer: Multipart form handling (@types/multer)
- nanoid: Unique ID generation
- zod + zod-validation-error: Schema validation

**Validation:**
All request/response data validated with Zod schemas ensuring type safety across client-server boundary.