# MajiSalama — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| vite | ^6.3.0 | Build tool |
| @vitejs/plugin-react | ^4.4.0 | Vite React plugin |
| tailwindcss | ^4.1.0 | Utility CSS |
| @tailwindcss/vite | ^4.1.0 | Tailwind Vite integration |
| gsap | ^3.12.0 | Animation engine (includes ScrollTrigger, SplitText plugins — all free) |
| lenis | ^1.3.0 | Smooth scroll with inertia |
| react-fast-marquee | ^1.6.0 | Partner logo infinite scroll |
| lucide-react | ^0.469.0 | Icon library |

No shadcn/ui components installed — the design is fully bespoke with no standard UI patterns (forms, dialogs, tables, dropdowns).

## Component Inventory

### Layout

| Component | Source | Reuse |
|-----------|--------|-------|
| Header | Custom | Shared — glass-morphism sticky bar, scroll-aware bg opacity, mobile hamburger → fullscreen overlay |
| Footer | Custom | Shared — warm 4-column editorial layout |
| LoadingScreen | Custom | Once — 3-phase sequence (bar → fade → hero trigger) |
| CustomCursor | Custom | Once — desktop only, lerp follow, expand on interactive hover |
| EmergencyPopup | Custom | Once — delayed entry alert demo |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Mascot SVG + canvas painting + particle overlay + starfield |
| RealTimeReportsSection | Custom | Stat cards with count-up + report card grid |
| HowItWorksSection | Custom | Tilted perspective grid + 3 feature cards + USSD banner |
| CommunityVoicesSection | Custom | 3D CSS carousel with 6 testimonial cards |
| PlatformArticlesSection | Custom | Staggered 2×2 article grid with image hover |
| PartnersSection | Custom | 3-category logo grid + marquee banner |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| ScrollReveal | Custom | All sections — IntersectionObserver wrapper, translateY+fade, stagger children |
| StatCard | Custom | RealTimeReportsSection — count-up number + label + description |
| ReportCard | Custom | RealTimeReportsSection — category tag + title + description + timestamp + status |
| ArticleCard | Custom | PlatformArticlesSection — image + tag + title + description + date |
| FeatureCard | Custom | HowItWorksSection — icon circle + step number + title + description + highlight |
| TestimonialCard | Custom | CommunityVoicesSection — quote + avatar + name + role + location |
| CategoryTag | Custom | ReportCard, ArticleCard — colored variant system (lime/amber/red/cyan/green) |
| GlassPanel | Custom | EmergencyPopup, USSD banner — backdrop-filter blur panel |
| StatusIndicator | Custom | HeroSection, ReportCard — pulsing dot + label |
| ScrollIndicator | Custom | HeroSection — gradient line + pulse |

### Hooks

| Hook | Purpose |
|------|---------|
| useMousePosition | Tracks cursor with optional lerp factor (custom cursor, mascot eye tracking, particle repulsion) |
| useLenis | Initializes Lenis, connects to ScrollTrigger.update, exposes scroll lock API for overlays |
| useInViewport | IntersectionObserver wrapper with configurable threshold for canvas culling and scroll reveals |

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Loading sequence (3-phase) | GSAP timeline | Sequenced tweens: bar width → overlay fade → remove DOM → dispatch custom event | Medium |
| Hero entrance (staggered) | GSAP timeline | Single timeline triggered by loading complete event; mascot fade → heading lines → sub-heading → CTAs → scroll indicator, each with incremental delay | Medium |
| Scroll-triggered reveals | GSAP + ScrollTrigger | ScrollTrigger.batch on `[data-reveal]` elements, translateY(60px)→0 + opacity, stagger 0.1s, threshold 0.15. Applied universally via ScrollReveal wrapper. | Low |
| Stat number count-up | GSAP | gsap.to() with snap modifier on a proxy object, update DOM on each tick. Triggered by IntersectionObserver at 50% visibility. | Low |
| Parallax layers | GSAP ScrollTrigger | ScrollTrigger with scrub:true per element, translateY based on data-parallax-speed attribute (0.3x–0.9x). | Low |
| Smooth scroll | Lenis | Lerp 0.1, duration 1.2. On('scroll') → ScrollTrigger.update. Paused during nav/search overlay. Disabled on mobile. | Low |
| Header scroll behavior | GSAP ScrollTrigger | ScrollTrigger at 100px toggle — background opacity 0.6↔0.95, border-color transition. | Low |
| Navigation overlay | GSAP timeline | Overlay fade-in → links stagger from bottom (translateY 30px, 0.08s stagger) → close button fade. Reverse on close. | Medium |
| Emergency popup | GSAP | Slide from translateX(400px)→0 on 3s delay; border glow pulse via CSS keyframes; slide-out on dismiss/timeout. | Low |
| **Mascot behavioral animation** | GSAP | State machine: idle (trunk sway sine 3s, breathe scaleY 2s, random blink 4-6s), eye tracking (pupil lerp 0.1 to mouse bounds), painting (trunk tip mapped to canvas stroke position), celebrate (jump + particle burst). Pure SVG + GSAP tween sequences. | **High** 🔒 |
| **Canvas painting system** | Canvas 2D + GSAP ScrollTrigger | ScrollTrigger scrub through hero maps progress 0→1. Each frame: clear canvas, render Catmull-Rom spline through 15 waypoints up to current progress. Brush: 3-5px #00E5FF, secondary strokes 1-2px. On >95%: trigger 50-particle burst. | **High** 🔒 |
| **Flood map particle system** | Canvas 2D (vanilla) | 800 particles (400 tablet, 100 mobile static). Perlin noise flow field (scale 0.003, time-evolving). requestAnimationFrame loop. Mouse repulsion within 100px radius (inverse-square). Semi-transparent black clear for trails. Paused via IntersectionObserver. | **High** 🔒 |
| Tilted grid effect | CSS | perspective(1000px) rotateX(60deg) rotateZ(-15deg) on oversized container. Grid via repeating-linear-gradient. Pulse animation per-line with staggered animation-delay. Parallax at 0.2x scroll via ScrollTrigger. Mobile: flat static grid. | Medium |
| **3D carousel** | CSS transforms + React state | Cards positioned with translateZ in circular arrangement. Active: translateZ(200px) scale(1); adjacent: rotateY(±20deg) scale(0.85); far: rotateY(±40deg) scale(0.7). Transition 0.6s. Prev/next buttons + swipe + keyboard arrows. Active card float animation (translateY oscillation 3s). | **High** 🔒 |
| Canvas noise transition | Canvas 2D + GSAP ScrollTrigger | Perlin noise at scale 50, animate threshold gradient 0→1. Solid #080808 below, transparent above. Organic wipe. Triggered once per section on scroll entry. | Medium |
| Starfield | CSS background | 200 radial-gradient dots at random positions, static. Parallax at 0.3x via ScrollTrigger. No animation loop. | Low |
| Scroll indicator pulse | CSS keyframes | Opacity pulse 0.5→1→0.5, 2s infinite. Fade out on scroll past hero. | Low |
| Status dot pulse | CSS keyframes | Opacity 1→0.4→1, 2s infinite. | Low |
| Marquee banner | react-fast-marquee | Partner names separated by " · ", speed auto, pauseOnHover. | Low |
| Logo grayscale→color | CSS transition | filter: grayscale(100%)→0%, opacity 0.6→1, 0.4s ease on hover. | Low |
| Water wave divider | CSS animation | SVG path with translateX oscillation over 8s infinite. | Low |
| Magnetic buttons | Custom hook | On hover, button center calculates distance to cursor, applies spring displacement (max 8px, strength 0.3). | Medium |
| Feature card float | CSS animation | Subtle translateY 0→-4px→0, 4s infinite, staggered animation-delay per card. | Low |
| Rain intensity bars | CSS/GSAP | Bars grow width 0→full, 0.05s stagger, 0.6s duration. Gradient from #00E5FF to #0055FF. | Low |
| Report card hover | CSS transition | border-color shift, translateY(-4px), box-shadow appear. 0.4s cubic-bezier. | Low |
| Article image hover | CSS transition | scale 1→1.05 within overflow:hidden wrapper, 0.6s. | Low |

## State & Logic Plan

### Global Event Bus

A lightweight custom event bus (EventTarget-based) coordinates cross-component interactions without prop drilling:

- `page:loaded` — LoadingScreen → HeroSection (triggers entrance timeline)
- `nav:open` / `nav:close` — hamburger/close → Header overlay + Lenis scroll lock/unlock
- `alert:show` / `alert:dismiss` — timer(3s)/dismiss button → EmergencyPopup
- `mascot:state` — scroll position → mascot SVG state transitions (idle↔painting↔celebrate)

### Loading → Hero Orchestration

LoadingScreen owns a GSAP master timeline. After Phase 2 (fade out), it dispatches `page:loaded` and removes itself from DOM. HeroSection listens for this event and starts its entrance animation timeline. The 3s emergency alert timer starts after `page:loaded`.

### Canvas Lifecycle Management

The hero canvas painting and flood particle systems share a single canvas element. They must:

1. Initialize only when hero is in viewport (IntersectionObserver)
2. Share a single `requestAnimationFrame` loop to avoid competing render cycles
3. Pause RAF when off-screen (visibility check each frame)
4. Clean up on unmount

The painting system drives progress from ScrollTrigger scrub; particles run independently in the same loop. Both render to the same canvas context — particles first (background layer), painting stroke on top.

### Carousel State Machine

CommunityVoicesSection carousel manages:
- `activeIndex` (0–5), controlled by prev/next buttons, swipe gestures, keyboard arrows, dot clicks
- `isTransitioning` flag to prevent mid-animation navigation
- Swipe detection: touchstart→touchend deltaX threshold 50px
- 3D positions computed from activeIndex — no hardcoded card transforms, derived mathematically from index offset

### Reduced Motion Coordination

A single `prefers-reduced-motion` check at app level sets a React context value. All animation-consuming components read this context and:
- Skip particle/canvas rendering entirely (show static fallback)
- Disable parallax, smooth scroll, tilted grid perspective
- Reduce all transition durations to 0.2s or instant
- Replace 3D carousel with flat horizontal layout

## Other Key Decisions

### Single Canvas Architecture

The hero contains two visual systems (flood particles + painting stroke) that both require Canvas 2D. Instead of two canvas elements (z-index layering complexity, competing RAF loops), use a single canvas with a unified render loop: particles render first as background, painting stroke renders on top. This eliminates z-fighting, halves the RAF overhead, and simplifies lifecycle management.

### Perlin Noise: Simplex Noise Implementation

Both the particle flow field and canvas noise transition require Perlin/simplex noise. Implement a lightweight 2D/3D simplex noise function inline (~80 lines) rather than importing a library. The design uses it in three places (particle field, noise transition, and possibly the painting stroke jitter) — a custom implementation avoids a dependency for one algorithm.

### Mascot SVG Strategy

The Maji elephant mascot is a complex animated illustration with eye tracking, trunk painting, and state-driven pose changes. Build as an inline SVG with individual `<g>` elements for each animatable part (body, trunk, ears, eyes, pupils). GSAP targets specific SVG elements by ref. Eye tracking updates pupil `transform` attributes directly via rAF (not GSAP) for 60fps responsiveness. State transitions (idle↔painting↔celebrate) use GSAP timelines per state.

### Carousel: CSS 3D vs WebGL

The 3D carousel uses CSS 3D transforms (perspective + translateZ + rotateY), not WebGL/Three.js. The effect is achievable with pure CSS and React state — the depth illusion comes from translateZ values and rotateY angles, not true 3D rendering. This avoids the Three.js dependency (~150KB) for one effect.
