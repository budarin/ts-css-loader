# @budarin/ts-css-loader

This loader is a fork of the well-known loader [typings-for-css-modules-loader](https://github.com/Jimdo/typings-for-css-modules-loader)

The purpose of creating yet another typescript generation loader for css-modules is the ability to use it in an isomorphic application in conjunction with [style-loader/usable](https://github.com/webpack-contrib/style-loader) and [fake-style-loader](https://github.com/dferber90/fake-style-loader).

`style-loader/usable` adds 2 methods to the standard css-modules interface:

-   `use: Function`
-   `unuse: Function`

`fake-style-loader` adds a property to the standard css-modules interface:

-   `source: String`

## `Installation`

Install via npm `npm install --save-dev @budarin/ts-css-loader`

## `Options`

All options are available only when the parameter `modules` set to `true`(see options for [css-loader](https://github.com/webpack-contrib/css-loader#options))

|                   Name                    |    Type     | Default | Description                                      |
| :---------------------------------------: | :---------: | :-----: | :----------------------------------------------- |
|             **[`EOL`](#EOL)**             | `{String}`  | `CRLF`  | {'CRLF', 'LF'}                                   |
| **[`onlyNamedExport`](#onlyNamedExport)** | `{Boolean}` | `false` | Export only named items of interface             |
|          **[`usable`](#usable)**          | `{Boolean}` | `false` | Add `use` and `unuse` methods to interface       |
|          **[`server`](#server)**          | `{Boolean}` | `false` | Add `source` property to interface               |
|          **[`silent`](#silent)**          | `{Boolean}` | `false` | To silence the loader                            |
|          **[`banner`](#banner)**          | `{Boolean}` | `false` | Adds a "banner" prefix to each generated \*.d.ts |

the other parameters are the same as the `css-loader`:

This loader should be used instead of` css-loader ' because inside it uses it.

An example of using webpack at.config:

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
            },
        }
    ]
```

for style file:

```css
.foo {
    color: red;
}
```

the loader will generate a type definition:

```ts
declare interface IAppCss {
    readonly foo: string;
}
declare const styles: IAppCss;

export default styles;
```

### `EOL`

Default: `'CRLF'`
Defines a line separator in type definition file and must be equal to the parameter set in `git` to prevent constant overwriting of type definition file.
This parameter can take one of `{'CR LF','LF`}'

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                EOL: 'LF'
            }
        }
    ]
```

### `onlyNamedExport`

Default: `false`
This parameter determines whether only named exports are present in the module interface

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                onlyNamedExport: true
            }
        }
    ]
```

output:

```ts
export const foo: string;
```

### `usable`

The parameter determines the presence of `style-loader/disable` methods in the interface: `use` and `unuse`.

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader/usable',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                usable: true
            }
        }
    ]
```

output:

```ts
declare interface ILocals {
    readonly foo: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
    readonly use: Function;
    readonly unuse: Function;
}
declare const styles: IAppCss;

export default styles;
```

### `server`

Default: `false`
Determines the presence of the interface property `source: string` for `fake-style-loader` and presene all css classes in default export

```js
    test: /\.css$/,
    use: [
        {
            loader: 'fake-style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                server: true
            }
        }
    ]
```

output:

```ts
declare interface ILocals {
    readonly foo: string;
}
declare interface IAppCss {
    readonly foo: string;
    readonly locals: ILocals;
    readonly source: string;
}
declare const styles: IAppCss;

export default styles;
```

### `silent`

To silence the loader because you get annoyed by its warnings or for other reasons, you can simply pass the "silent" query to the loader and it will shut up.
e.g.:

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: false,
            }
        }
    ]
```

### `banner`

To add a "banner" prefix to each generated `*.d.ts` file, you can pass a string to this option as shown below. The prefix is quite literally prefixed into the generated file, so please ensure it conforms to the type definition syntax.

```js
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                banner: "// This file is automatically generated by typings-for-css-modules.\n// Please do not change this file!"
            }
        }
    ]
```

output:

```ts
// This file is automatically generated by typings-for-css-modules.
// Please do not change this file!"
declare interface ILocals {
    readonly foo: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
}
declare const styles: IAppCss;

export default styles;
```

For isomorphic applications, you can use the following configuration:

```js
    test: /\.css$/,
    use: [
        {
            loader: ...
        },
        {
            loader: '@budarin/ts-css-loader',
            options: {
                modules: true,
                usable: true,
                server: true
            }
        }
    ]
```

output:

```ts
declare interface ILocals {
    readonly foo: string;
}
declare interface IAppCss {
    readonly locals: ILocals;
    readonly use: Function;
    readonly unuse: Function;
    readonly source: string;
}
declare const styles: IAppCss;

export default styles;
```

### using `namedExport` with the `camelCase`-option

Using the `namedExport` as well as the `camelCase` options the generated file will look as follow:

```ts
export const someClass: string;
export const someOtherClass: string;
export const someClassSayWhat: string;
```

### Example in Visual Studio Code

![typed-css-modules](https://cloud.githubusercontent.com/assets/749171/16340497/c1cb6888-3a28-11e6-919b-f2f51a282bba.gif)

If you encounter the following errors:

```
error TS1192: Module '"xxxxx/xxxx/src/style.sass"' has no default export.
```

maybe you should export the styles as following:

```
import * as styles from './style.sass';
```

## Support

As the loader just acts as an intermediary it can handle all kind of css preprocessors (`sass`, `scss`, `stylus`, `less`, ...).
The only requirement is that those preprocessors have proper webpack loaders defined - meaning they can already be loaded by webpack anyways.

## Requirements

The loader uses `css-loader`(https://github.com/webpack/css-loader) under the hood. Thus it is a peer-dependency and the expected loader to create CSS Modules.

## Known issues

### Webpack rebuilds / builds slow

As the loader generates typing files, it is wise to tell webpack to ignore them.
The fix is luckily very simple. Webpack ships with a "WatchIgnorePlugin" out of the box.
Simply add this to your webpack plugins:

```
plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    ...
  ]
```

where `css` is the file extension of your style files. If you use `sass` you need to put `sass` here instead. If you use `less`, `stylus` or any other style language use their file ending.

### Typescript doesnt find the typings

As the webpack process is independent from your typescript "runtime" it may take a while for typescript to pick up the typings.
Any hints on how this could be fixed deterministically are welcome!
