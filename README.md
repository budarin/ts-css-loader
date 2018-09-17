# ts-css-loader

Webpack loader that works as a css-loader drop-in replacement to generate TypeScript typings for CSS modules on the fly

-   EOL
-   by default: none ??

-   modules:

```ts
declare interface IAppCss {
    readonly hello: string;
}

export const locals: ILocals;
```

modules + namedExport:

```ts
declare interface ILocals {
    readonly hello: string;
}

export const hello: string;
export const locals: ILocals;

declare interface IAppCss {
    readonly locals: ILocals;
}
declare const styles: IAppCss;

export default styles;
```

modules + namedExport + usable + source:

```ts
declare interface ILocals {
    readonly hello: string;
}

export const hello: string;
export const locals: ILocals;
export const source: string;
export const use: Function;
export const unuse: Function;

declare interface IAppCss {
    readonly locals: ILocals;
    readonly source: string;
    readonly use: Function;
    readonly unuse: Function;
}
declare const styles: IAppCss;

export default styles;
```
