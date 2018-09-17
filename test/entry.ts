import { locals as stylesBase } from './example.css';
import { locals as stylesCamelCase } from './example-camelcase.css';
import * as stylesNamedExport from './example-namedexport.css';
import * as stylesCamelCasedNamedExport from './example-camelcase-namedexport.css';
import './example-no-css-modules.css';
import * as compose from './example-compose.css';

const foo = stylesBase.foo;
console.log(foo);

const barBaz = stylesBase['bar-baz'];
console.log(barBaz);

const fooCamelCase = stylesCamelCase.foo;
console.log(fooCamelCase);
const barBazCamelCase = stylesCamelCase.barBaz;
console.log(barBazCamelCase);
const barBazDashedCamelCase = stylesCamelCase['bar-baz'];
console.log(barBazDashedCamelCase);

const fooNamedExport = stylesNamedExport.foo;
console.log(fooNamedExport);

const fooCamelCaseNamedExport = stylesCamelCasedNamedExport.foo;
console.log(fooCamelCaseNamedExport);
const barBazCamelCaseNamedExport = stylesCamelCasedNamedExport.barBaz;
console.log(barBazCamelCaseNamedExport);

const composed = compose.test;
console.log(composed);
