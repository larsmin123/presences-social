# presences.social — Style Guide

## Brand Identity

### Philosophy
Minimalist, Scandinavian design inspired by Dieter Rams and Apple. Clean, functional, and human-centered.

---

## Typography

### Font Family
**Primary:** Inter  
*Fallback:* -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif

### Type Scale

| Name | Size | Weight | Letter-spacing | Line-height | Usage |
|------|------|--------|----------------|-------------|-------|
| Display | clamp(3rem, 12vw, 10rem) | 500 | -0.04em | 0.9 | Hero title |
| Headline | clamp(1.5rem, 4vw, 3rem) | 500 | -0.02em | 1.1 | Section titles |
| Title | 1rem | 500 | -0.01em | 1.3 | Card titles, feature names |
| Body | 1rem | 400 | 0 | 1.6 | Paragraphs |
| Caption | 0.6875rem | 400 | 0.08em | 1.4 | Labels, metadata |
| Mono | 0.75rem | 400 | 0.02em | 1.4 | Numbers, codes |

### Typography Rules
- All headings use **Title Case** in English, **Sentence case** in Dutch
- Captions are **UPPERCASE** with wide letter-spacing
- Mono font used for section numbers (01, 02, 03...)

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Black | `#000000` | Text, borders, gates |
| White | `#FFFFFF` | Background |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Black 40% | `rgba(0,0,0,0.4)` | Secondary text, subtitles |
| Black 50% | `rgba(0,0,0,0.5)` | Body text |
| Black 60% | `rgba(0,0,0,0.6)` | Descriptions |
| Black 10% | `rgba(0,0,0,0.1)` | Borders, dividers |
| Neutral 50 | `#FAFAFA` | Section backgrounds |

### Color Usage
- **Hero title:** Black + Black 25% (for "presences")
- **Gates:** Black background, white text
- **Pipeline boxes:** White background, black border
- **End states:** Neutral background

---

## Spacing System

### Section Spacing
- **Large sections:** py-32 (128px vertical padding)
- **Medium sections:** py-24 (96px vertical padding)
- **Small sections:** py-16 (64px vertical padding)

### Content Spacing
- **Max-width:** max-w-5xl (1024px) for text content
- **Max-width wide:** max-w-7xl (1280px) for pipeline
- **Grid gap:** gap-8 (32px) standard
- **Component gap:** gap-4 (16px) for pipeline boxes

### Container Padding
- **Desktop:** px-16 (64px)
- **Tablet:** px-8 (32px)
- **Mobile:** px-4 (16px)

---

## Components

### Pipeline Box
```
Border: 1px solid rgba(0,0,0,0.2)
Background: white
Padding: 1rem (mobile) / 1.25rem (desktop)
Min-height: 100px (mobile) / 120px (desktop)
```

**Variants:**
- `.normal` — White bg, black border
- `.gate` — Black bg, white text
- `.end` — Neutral bg, black border

### Section Number
```
Font: Mono
Color: rgba(0,0,0,0.4)
Size: 0.75rem
```

### Language Switcher
```
Active: Black bg, white text
Inactive: Transparent, black/40 text
Hover: Black text
```

---

## Layout

### Grid System
- **12-column grid** for main layout
- **6-column grid** for pipeline (responsive to 3, then 2 columns)
- **2-column grid** for features

### Responsive Breakpoints
| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile | < 640px | 2 columns |
| Tablet | 640-1024px | 3 columns |
| Desktop | > 1024px | 6 columns |

---

## Animation

### Hero Animation
- Fade in + translate Y (20px → 0)
- Duration: 1000ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Stagger: 200ms between elements

### Scroll Reveal
- Trigger: 10% visibility
- Animation: fade in + translate Y (30px → 0)
- Duration: 800ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

---

## Content Structure

### Sections
1. **Hero** — "Social presences" with subtle animation
2. **Philosophy** — Human-in-the-loop explanation
3. **Pipeline** — Visual flow diagram
4. **Features** — What you get (8 items)
5. **Footer** — Contact + copyright

### Languages
- **English (EN)** — Default
- **Dutch (NL)** — Full translation

---

## File Structure
```
/src
  /App.tsx          — Main application
  /App.css          — Component styles
  /index.css        — Global styles + typography
/public
  /style-guide.md   — This file
```

---

## Design Principles

1. **Less is more** — Remove everything that doesn't serve a purpose
2. **White space is content** — Generous padding and margins
3. **Hierarchy through contrast** — Size, weight, and color create order
4. **Consistency** — Same patterns repeated throughout
5. **Human-centered** — Clear labels, no jargon

---

*Version 1.0 — February 2026*
