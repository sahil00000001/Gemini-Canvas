# Design Guidelines: AI Design Critique Studio

## Design Approach

**Hybrid Reference-Based + Custom 3D Innovation**

Drawing inspiration from modern AI tools (Midjourney, Runway) and 3D web experiences (Spline, Awwwards winners), combined with custom interactive 3D components that showcase the application's advanced capabilities. This is a tool for creatives, so the interface itself must demonstrate exceptional design craft.

---

## Core Layout Architecture

### Application Structure
**Full-screen split-panel layout:**
- **Left Panel (45% width)**: Image upload and preview zone with 3D frame
- **Right Panel (55% width)**: Scrollable 3D card grid for AI suggestions
- **Top Header**: Branding, model toggle switch, about link - fixed position with backdrop blur
- **About Page**: Full-screen overlay with 3D profile card, triggered by header link

### Spacing System
Use Tailwind units: **4, 6, 8, 12, 16, 24** for consistent rhythm
- Container padding: `px-8 py-6` on desktop, `px-4 py-4` on mobile
- Card gaps: `gap-6` for grid layouts
- Section spacing: `space-y-8` for vertical stacks
- Component internal padding: `p-6` for cards, `p-4` for smaller elements

---

## Typography Hierarchy

**Font Stack**: 
- Primary: 'Inter' (body text, UI elements) - clean, modern, excellent at small sizes
- Accent: 'Space Grotesk' (headings, numbers, emphasis) - geometric, tech-forward feel

**Type Scale**:
- Page title: `text-4xl font-bold` (Space Grotesk)
- Section headers: `text-2xl font-semibold` (Space Grotesk)
- Card titles: `text-lg font-medium` (Inter)
- Body text: `text-base` (Inter)
- Captions/metadata: `text-sm text-opacity-70` (Inter)
- Score numbers: `text-6xl font-bold` (Space Grotesk) - hero-sized for impact

---

## Component Library

### 1. 3D Image Upload Zone (Left Panel)
**Layout**:
- Centered vertical and horizontal in left panel
- Border with dashed style when empty, solid when image loaded
- Drag target area: `min-h-[400px]` with rounded corners `rounded-2xl`
- Upload icon/text centered with `flex flex-col items-center justify-center`

**3D Treatment**:
- Floating animation: subtle vertical oscillation (10px range)
- Depth shadow: layered shadows creating 3D lift effect
- On drag-over: scale to 1.02, increase glow intensity
- After upload: image displays with 3D photo frame effect (raised border, perspective tilt)

### 2. Model Toggle Switch (Header)
**Structure**:
- Large toggle with labels on both sides
- Left: "Light Mode" | Right: "Heavy Duty ⚡"
- Below Heavy Duty: Small badge showing "25 requests/day limit"
- Toggle track: `w-20 h-10 rounded-full`
- Toggle thumb: `w-8 h-8` circular knob

**3D Effect**:
- Track has inner shadow (inset depth)
- Thumb casts shadow and has glossy highlight
- Smooth spring animation on toggle (not instant)
- On hover: thumb slightly enlarges (scale 1.1)

### 3. Suggestion Cards Grid (Right Panel)
**Grid Layout**:
- `grid grid-cols-1 gap-6` on mobile
- `grid-cols-2 gap-6` on tablet/desktop for 2-column layout
- Each card: `rounded-xl` with consistent aspect ratio

**Card Categories** (7 types total):
1. Overall Impression - Large card spanning 2 columns
2. Visual Hierarchy - Standard card
3. Typography - Standard card
4. Color Analysis - Standard card with color swatches
5. Composition & Layout - Standard card
6. Score - Featured card with large number, spans 2 columns
7. Top 3 Improvements - Numbered list card, spans 2 columns

**Card Structure**:
```
- Header: Icon + Category name (text-lg font-medium)
- Content: AI-generated text (text-base leading-relaxed)
- For Score card: Giant number display (text-6xl) centered
- For Improvements: Numbered list with priority badges (1, 2, 3)
```

**3D Card Effects**:
- Default state: slight elevation with shadow
- On hover: 
  - Float up 8px (transform translateY(-8px))
  - Tilt based on mouse position (subtle 3D rotation)
  - Increase shadow depth
  - Glassmorphism effect: semi-transparent background with backdrop blur
- On click/focus: expand slightly (scale 1.02), increase border glow

### 4. Loading States
**During AI Analysis**:
- Full-screen overlay with dark backdrop
- Center: 3D spinning geometric shape (rotating cube/octahedron)
- Below spinner: Progress text "Analyzing your design..." with animated ellipsis
- Spinner size: `w-24 h-24` with continuous rotation animation

### 5. About Section/Page
**Layout**:
- Full-screen overlay triggered from header
- Centered 3D profile card: `max-w-2xl mx-auto`
- Card contains:
  - Personal photo/avatar at top
  - Name in large heading `text-3xl font-bold`
  - Bio/description `text-lg leading-relaxed`
  - Social links/contact as icon buttons
- Footer: Personal details (name, credentials) with subtle text `text-sm opacity-60`
- Close button: top-right corner with `X` icon

**3D Treatment**:
- Card enters with scale-up + fade-in animation
- Card has deep shadow and slight perspective tilt
- Background: blurred version of main app (backdrop-filter)
- On hover over social icons: 3D pop-out effect

### 6. Empty States
**Before image upload**:
- Large cloud upload icon with animation (floating)
- Text: "Drop your design here or click to upload"
- Supported formats note: "PNG, JPG, WebP up to 10MB"
- All centered in upload zone with `space-y-4` vertical spacing

**Before analysis**:
- Right panel shows placeholder cards with shimmer loading effect
- Ghost cards match final layout grid

---

## Interactive 3D Behaviors

### Parallax Effects
- Background elements move at different speeds on scroll
- Cards have subtle depth parallax on mouse movement

### Particle System (Optional Enhancement)
- Subtle floating particles in upload zone background
- On successful upload: brief particle burst animation

### Depth-of-Field Simulation
- When hovering a card, slightly blur surrounding cards
- Creates focus effect similar to camera lens

### Smooth Transitions
- All state changes use spring physics (not linear easing)
- Transform properties: `transition-all duration-300 ease-out`
- Stagger animations when multiple cards appear (0.1s delay between each)

---

## Responsive Behavior

**Desktop (1024px+)**:
- Full split-panel layout as described
- 2-column card grid on right panel

**Tablet (768px - 1023px)**:
- Maintain split but adjust ratios: 40% left, 60% right
- Single column card grid with larger cards

**Mobile (<768px)**:
- Stack vertically: upload zone on top, cards below
- Single column layout throughout
- Reduce 3D effects intensity for performance
- Simplified shadows and animations

---

## Accessibility Considerations

- All interactive 3D elements have keyboard navigation fallbacks
- Focus states visible with outline rings
- Hover effects also trigger on keyboard focus
- Reduced motion support: disable 3D animations if user prefers reduced motion
- Alt text for uploaded images
- ARIA labels for icon-only buttons
- Contrast maintained even with glassmorphism effects

---

## Images

**No hero image needed** - this is a full-app interface, not a landing page.

**Required images**:
1. **User uploaded design image**: Displays in left panel upload zone after upload, contained within 3D frame effect
2. **About section avatar/photo**: User profile image in about card
3. **Placeholder/empty state icons**: Upload cloud icon, AI analysis icon (use icon library)

**Icon Library**: Use Heroicons (outline style) for UI elements - upload, settings, close, external links, etc.

---

## Project Identity

**Project Name**: "Critique AI Studio" or "Design Oracle AI"

**Tagline** (for header): "AI-Powered Design Analysis"

**About Footer Credits**: 
```
Created by [Your Name]
AI Design Consultant | [Your Title/Role]
[Contact Email] • [Portfolio Link]
```