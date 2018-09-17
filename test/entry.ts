import stylesBase from './example.css';
import stylesCamelCase from './example-camelcase.css';
import * as stylesNamedExport from './example-namedexport.css';
import * as stylesCamelCasedNamedExport from './example-camelcase-namedexport.css';
import './example-no-css-modules.css';
import * as compose from './example-compose.css';

const foo = stylesBase.locals.foo;
console.log(foo);

const barBaz = stylesBase.locals['bar-baz'];
console.log('barBaz', barBaz);

const fooCamelCase = stylesCamelCase.locals.foo;
console.log('fooCamelCase', fooCamelCase);

const barBazCamelCase = stylesCamelCase.locals.barBaz;
console.log('barBazCamelCase', barBazCamelCase);
const barBazDashedCamelCase = stylesCamelCase.locals['bar-baz'];
console.log('barBazDashedCamelCase', barBazDashedCamelCase);

const fooNamedExport = stylesNamedExport.foo;
console.log('fooNamedExport', fooNamedExport);

const fooCamelCaseNamedExport = stylesCamelCasedNamedExport.foo;
console.log('fooCamelCaseNamedExport', fooCamelCaseNamedExport);
const barBazCamelCaseNamedExport = stylesCamelCasedNamedExport.barBaz;
console.log('barBazCamelCaseNamedExport', barBazCamelCaseNamedExport);

const composed = compose.test;
console.log('composed', composed);
