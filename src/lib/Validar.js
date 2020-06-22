import { ValidarRuc } from './ValidarRuc';
const validator = require('validator');
/**
 * isEmptyObj
 * @param {*} obj 
 */
export const isEmptyObj = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
/**
 * numericString
 * @param {*} param0 
 */
  export const  numericString= ({ fallback, abrv, len, minLen, maxLen } = {}) => (
    ctx,
    value
  ) => {
    if (!value) {
      if (fallback || fallback === '') return fallback;
  
      return abrv
        ? new Error(`Obligatorio`)
        : new Error(`"${ctx.name}" es requerido`);
    }
  
    if (typeof value !== 'string')
      return abrv
        ? new Error(`Inválido`)
        : new Error(`"${ctx.name}" debe de ser tipo string`);
  
    const min = minLen || 1;
    if (len && value.length !== len)
      return abrv
        ? new Error(`Inválido`)
        : new Error(`"${ctx.name}" debe tener exactamente ${len} caracteres.`);
    else if (maxLen && value.length > maxLen)
      return abrv
        ? new Error(`Inválido`)
        : new Error(`"${ctx.name}" debe de tener menos de ${maxLen} caracteres.`);
    else if (value.length < minLen)
      return abrv
        ? new Error(`Inválido`)
        : new Error(`"${ctx.name}" debe de tener más de ${min} caracteres.`);
  
    if (!validator.isNumeric(value))
      return abrv
        ? new Error(`Inválido`)
        : new Error(`"${ctx.name}" debe de ser una cadena de dígitos`);
  
    return value;
  };
/**
 * string
 * @param {*} param0 
 */
  export const string = ({ fallback, maxLen, allowEmpty } = {}) => (ctx, value) => {
    if (value === null || value === undefined) {
      if (fallback || fallback === '') return fallback;
      return new Error(`requerido`);
    }
  
    if (typeof value !== 'string')
      return new Error(`debe de ser un string`);
  
    if (value.length > maxLen)
      return new Error(
        `no puede tener más de ${maxLen} caracteres`
      );
  
    if (!allowEmpty && value === '')
      return new Error(`no puede ser un string vacio`);
  
    return value;
  };
/**
 * int
 * @param {*} args 
 */
  export const int = (args = {}) => (ctx, value) => {
    const { fallback, max, min, abrv } = args;
    const { name } = ctx;
  
    if (!value && value !== 0) {
      if (fallback || fallback === null || fallback === 0) return fallback;
  
      return abrv
        ? new Error('Obligatorio')
        : new Error(`"${name}"requerido`);
    }
  
    if (typeof value === 'string') return int(args)(ctx, parseInt(value, 10));
  
    const bounds = max ? { min: min || 0, max: max } : { min: min || 0 };
    if (typeof value !== 'number' || !validator.isInt('' + value, bounds))
      return abrv
        ? new Error('Inválido')
        : new Error(`"${name}" debe de ser un entero`);
  
    return value;
  };
/**
 * float
 * @param {*} args 
 */
  export const float = (args = {}) => (ctx, value) => {
    const { fallback, min, max } = args;
    if (!value) {
     
      if (fallback || fallback === 0){ 
        return fallback;
      }else{
        return new Error(`requerido`);
      }
      
    }
  
    if (typeof value === 'string') return float()(ctx, parseFloat(value, 10));
  
    const bounds = max ? { min: min || 0, max: max } : { min: min || 0 };
    if (typeof value !== 'number' || !validator.isFloat('' + value, bounds))
      return new Error(`debe de ser un número decimal`);
  
    return value;
  };

  /**
  * string
  * @param {*} param0 
  */
  export const email = (args = {}) => (ctx, value) => {
    const { fallback } = args;
    if (!value) {
      if (fallback || fallback === '') return fallback;
      return new Error(`es requerido`);
    }
  
    if (typeof value !== 'string')
      return new Error(`debe de ser un string`);
  
    if (!validator.isEmpty(value) && !validator.isEmail(value))
      return new Error('e-mail inválido');
  
    return value;
  };

  //*********************VALIDAR */

  /**
   * validateObjectWithSchema
   * @param {*} schema 
   * @param {*} data 
   * @param {*} path 
   */
   const validateObjectWithSchema = (schema, data, path) => {
    const keys = Object.keys(schema);
    return keys.reduce((res, dataKey) => {
      const validatorFn = schema[dataKey];
      const rawValue = data[dataKey];
      const name = path ? path + '.' + dataKey : dataKey;
      res[dataKey] = validatorFn({ name }, rawValue);
      return res;
    }, {});
  };

  export const validateFormWithSchema = (schema, data) => {
    const validated = validateObjectWithSchema(schema, data);
    const output = Object.keys(validated).reduce(
      (res, key) => {
        const maybeError = validated[key];
        if (maybeError instanceof Error) {
          res.inputs = null;
          res.errors[key] = maybeError.message;
        } else if (res.inputs != null) {
          res.inputs[key] = maybeError;
        }
        return res;
      },
      { inputs: {}, errors: {} }
    );
  
    if (output.inputs != null) output.errors = null;
    return output;
  };

  /**
 * string
 * @param {*} param0 
 */
export const stringCI = ({ valCi } = {}) => (ctx, value) => {
  if (!value) return false;
  if (valCi || valCi === ''){
    var cad = value;
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;
   
    if (cad !== "" && longitud === 10){
      
      for(let i = 0; i < longcheck; i++){
        if (i%2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      let total1 = cad.charAt(longitud-1);
      total = total % 10 ? 10 - total % 10 : 0;
     
      if (parseInt(total1) ===parseInt(total)) {
       
      }else{
        return new Error(`Identificador Inválido`);
      }
    } else {
      return ValidarRuc(cad);
    }
  }
 
  return value;
};