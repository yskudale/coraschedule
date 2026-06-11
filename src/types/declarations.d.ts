// ============================================
// Type Declarations
// Tells TypeScript that non-TS file types
// are valid imports — without this TS errors.
// ============================================

// SCSS module files (.module.scss)
declare module '*.module.scss' {
  const styles: Record<string, string>;
  export default styles;
}

// Plain SCSS files (.scss)
declare module '*.scss' {
  const styles: Record<string, string>;
  export default styles;
}

// Image files
declare module '*.png'  { const src: string; export default src; }
declare module '*.jpg'  { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.svg'  { const src: string; export default src; }
declare module '*.webp' { const src: string; export default src; }