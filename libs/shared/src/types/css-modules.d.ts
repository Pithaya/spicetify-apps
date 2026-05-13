declare module '*.module.css' {
    const classes: Record<string, string>;
    export default classes;
}

declare module '*.module.scss' {
    const classes: Record<string, string>;
    export default classes;
}

// Plain CSS/SCSS side-effect imports (`import './foo.css'`). TS 6+ requires
// a declaration for these: without it, the import errors with TS2882.
declare module '*.css';
declare module '*.scss';
