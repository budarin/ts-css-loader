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

export const hello: string;
export const locals: ILocals;
```

-   modules + server:

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly hello: string;
    readonly locals: ILocals;
    readonly source: string;
}
declare const styles: IAppCss;

export default styles;
```

-   modules + usable + server:
    (server => sourse + ILocals )

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

export default styles;
```

-   modules + namedExport +usable + server:
    (server => sourse + ILocals )

```ts
declare interface ILocals {
    readonly hello: string;
}

export const hello: string;
export const locals: ILocals;
export const use: Function;
export const unuse: Function;
export const source: string;
}
```
