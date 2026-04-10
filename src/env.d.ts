/// <reference types="vite/client" />
/// <reference types="react" />

// Allow importing CSS/image assets without explicit type declarations
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';

// Third-party modules without types in the project
declare module 'dompurify';
declare module 'prismjs/components/*';
declare module 'react-dom/client';
