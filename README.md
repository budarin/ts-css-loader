# ts-css-loader

Webpack loader that works as a css-loader drop-in replacement to generate TypeScript typings for CSS modules on the fly

-   EOL
-   by default: none ??

-   modules :

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly hello: string;
    readonly locals: ILocals;
}
declare const styles: IAppCss;

export default styles;
```

-   modules + namedExport :

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly hello: string;
    readonly locals: ILocals;
}
declare const styles: IAppCss;

export const hello: string;
export const locals: ILocals;
export default styles;
```

-   modules + namedExport + usable + server:
    (server => sourse + styles)

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly hello: string;
    readonly locals: ILocals;
    readonly use: Function;
    readonly unuse: Function;
    readonly source: string;
}
declare const styles: IAppCss;

export const hello: string;
export const locals: ILocals;
export const use: Function;
export const unuse: Function;
export const source: string;
export default styles;
```
