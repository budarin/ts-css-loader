by default: none ??

modules:

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
    readonly source: string;
}
declare const styles: IAppCss;

export default styles;
```

modules + namedExport:

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
    readonly source: string;
}

export const hello: string;
export const locals: ILocals;
export const source: string;

declare const styles: IAppCss;

export default styles;
```

namedExport + modules + usable:

```ts
declare interface ILocals {
    readonly hello: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
    readonly source: string;
    readonly use: Function;
    readonly unuse: Function;
}

export const hello: string;
export const locals: ILocals;
export const source: string;
export const use: Function;
export const unuse: Function;

declare const styles: IAppCss;

export default styles;
```
