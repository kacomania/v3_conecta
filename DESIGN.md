---
name: Cidadão Conecta
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#434750'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#345f99'
  primary: '#00254d'
  on-primary: '#ffffff'
  primary-container: '#003b73'
  on-primary-container: '#7fa7e5'
  inverse-primary: '#a7c8ff'
  secondary: '#165eae'
  on-secondary: '#ffffff'
  secondary-container: '#71aaff'
  on-secondary-container: '#003d79'
  tertiary: '#222628'
  on-tertiary: '#ffffff'
  tertiary-container: '#383b3e'
  on-tertiary-container: '#a2a5a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#174780'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a8c8ff'
  on-secondary-fixed: '#001b3c'
  on-secondary-fixed-variant: '#00468a'
  tertiary-fixed: '#e0e3e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#44474a'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is rooted in the **Corporate / Modern** aesthetic, specifically tailored for institutional trust and civic engagement. The brand personality is secure, official, and accessible, prioritizing clarity and ease of use for a diverse citizenry. 

The visual language follows a disciplined, functionalist approach. It avoids excessive ornamentation in favor of high legibility, structured information density, and a calm, authoritative presence. The UI should evoke a sense of digital sovereignty and reliability, ensuring users feel their data and interactions are handled with governmental-grade security.

## Colors

The palette is anchored by **Navy Blue (#003B73)**, representing stability and institutional authority. This is complemented by a secondary blue for interactive states and a very light tertiary gray for surface grounding.

- **Primary:** Use for headers, primary actions, and brand identification.
- **Background:** Always Pure White (#FFFFFF) to maintain a clean, high-contrast environment.
- **Borders:** A consistent fine border (#D9D9D9) is used to define structure without adding visual weight.
- **Functional Colors:** Success and error states use subdued, professional tones rather than overly vibrant hues to maintain the serious tone of the application.

## Typography

This design system utilizes **Inter** exclusively to leverage its systematic, utilitarian nature. The type scale is designed for high legibility across all age groups.

- **Headlines:** Use Bold weights for primary page titles and Semi-Bold for section headers.
- **Body Text:** Regular weight is the standard for readability. Tighten letter spacing slightly for larger headlines to maintain a modern, compact appearance.
- **Labels:** Use Medium weight for micro-copy and form labels to ensure they are distinct from input text.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for mobile devices, moving to a centered fixed-width container on larger tablets.

- **Mobile Rhythm:** Use a 4-column grid with 20px outside margins.
- **Spacing Scale:** All spacing must be multiples of 4px. Use `md` (16px) as the standard padding for cards and containers.
- **Vertical Flow:** Group related elements with `xs` (8px) or `sm` (12px) spacing; use `lg` (24px) or `xl` (32px) to separate major sections or distinct information blocks.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. Depth is communicated through subtle surface shifts.

- **Level 0 (Base):** Pure White background.
- **Level 1 (Cards/Inputs):** Defined by a 1px solid border (#D9D9D9). 
- **Active State:** On tap, an element may use a very soft, ambient shadow (4px blur, 5% opacity, Neutral Black) to provide tactile feedback.
- **Overlay:** Modals and bottom sheets use a 40% opacity black backdrop to focus attention, emphasizing the "Official" layer of interaction.

## Shapes

The shape language is "Soft" (0.25rem / 4px), striking a balance between the rigidity of "Sharp" corners and the casual nature of "Rounded" corners. 

- **Primary Elements:** Buttons, inputs, and cards use the 4px base radius.
- **Large Containers:** Modals and large sections may use `rounded-lg` (8px) to feel more approachable while remaining professional.
- **Iconography:** Use geometric, stroke-based icons with consistent 2px weights to match the border language.

## Components

- **Buttons:** Primary buttons are solid Navy Blue with white text. Secondary buttons use a Navy Blue outline and text. Minimum tap target is 48px.
- **Input Fields:** Use 1px #D9D9D9 borders. Labels are placed above the field in `label-md`. Focus state uses a 2px primary blue border.
- **Cards:** White background with #D9D9D9 borders. Avoid drop shadows; use internal padding of 16px.
- **Lists:** Use subtle 1px dividers between items. Chevron icons should be used to indicate drill-down actions.
- **Chips/Status Tags:** Subtle background tints (e.g., light green for "Active") with dark text. Keep corners slightly more rounded than buttons to differentiate them as metadata.
- **Navigation:** A clean bottom tab bar with 1px top stroke. Active state is indicated by the primary color and a small top-accent line.
