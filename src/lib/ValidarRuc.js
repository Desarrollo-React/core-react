export const ValidarRuc = (numero) => {

    let suma = 0;
    let residuo = 0;
    let pri = false;
    let pub = false;
    let nat = false;
    let numeroProvincias = 22;
    let modulo = 11;
    let digitos = "0123456789";
    let i;
    //verificamos que no tenga letras
    for (i = 0; i < numero.length; i++) {
        if (digitos.indexOf(numero.charAt(i), 0) === -1) {
            return new Error(`Error en el RUC: Contiene letras`);
           
        }

    }
 

    /* Aqui almacenamos los digitos de la cedula en variables. */
    let d1 = numero.substr(0, 1);
    let d2 = numero.substr(1, 1);
    let d3 = numero.substr(2, 1);
    let d4 = numero.substr(3, 1);
    let d5 = numero.substr(4, 1);
    let d6 = numero.substr(5, 1);
    let d7 = numero.substr(6, 1);
    let d8 = numero.substr(7, 1);
    let d9 = numero.substr(8, 1);
    let d10 = numero.substr(9, 1);

    /* El tercer digito es: */
    /* 9 para sociedades privadas y extranjeros */
    /* 6 para sociedades publicas */
    /* menor que 6 (0,1,2,3,4,5) para personas naturales */

    if (d3 == 7 || d3 == 8) {
       
        return new Error(`Error en el RUC: El tercer dígito ingresado es inválido`);
       
    }

        let p1 = 0;
        let p2 = 0;
        let p3 = 0;
        let p4 =0;
        let p5 = 0;
        let p6 = 0;
        let p7 = 0;
        let p8 = 0;
        let  p9 = 0;

    /* Solo para personas naturales (modulo 10) */
    if (d3 < 6) {
        nat = true;
         p1 = d1 * 2; if (p1 >= 10) p1 -= 9;
         p2 = d2 * 1; if (p2 >= 10) p2 -= 9;
         p3 = d3 * 2; if (p3 >= 10) p3 -= 9;
         p4 = d4 * 1; if (p4 >= 10) p4 -= 9;
         p5 = d5 * 2; if (p5 >= 10) p5 -= 9;
         p6 = d6 * 1; if (p6 >= 10) p6 -= 9;
         p7 = d7 * 2; if (p7 >= 10) p7 -= 9;
         p8 = d8 * 1; if (p8 >= 10) p8 -= 9;
         p9 = d9 * 2; if (p9 >= 10) p9 -= 9;
        modulo = 10;
    }

    /* Solo para sociedades publicas (modulo 11) */
    /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
    else if (d3 == 6) {
        pub = true;
        p1 = d1 * 3;
        p2 = d2 * 2;
        p3 = d3 * 7;
        p4 = d4 * 6;
        p5 = d5 * 5;
        p6 = d6 * 4;
        p7 = d7 * 3;
        p8 = d8 * 2;
        p9 = 0;
    }

    /* Solo para entidades privadas (modulo 11) */
    else if (d3 == 9) {
        pri = true;
        p1 = d1 * 4;
        p2 = d2 * 3;
        p3 = d3 * 2;
        p4 = d4 * 7;
        p5 = d5 * 6;
        p6 = d6 * 5;
        p7 = d7 * 4;
        p8 = d8 * 3;
        p9 = d9 * 2;
    }

    suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
    residuo = suma % modulo;

    /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
  let  digitoVerificador = residuo == 0 ? 0 : modulo - residuo;

    /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
    if (pub == true) {
        if (digitoVerificador != d9) {
           // alert('El ruc de la empresa del sector público es incorrecto.');
            return new Error(`Error en el RUC : Es incorrecto`);
           
        }
        /* El ruc de las empresas del sector publico terminan con 0001*/
        if (numero.substr(9, 4) != '0001') {
           // alert('El ruc de la empresa del sector público debe terminar con 0001');
            return new Error(`Error en el RUC : Es incorrecto`);
        }
    }
    else if (pri == true) {
        if (digitoVerificador != d10) {
           // alert('El ruc de la empresa del sector privado es incorrecto.');
            return new Error(`Error en el RUC : Es incorrecto`);
        }
        if (numero.substr(10, 3) != '001') {
           // alert('El ruc de la empresa del sector privado debe terminar con 001');
            return new Error(`Error en el RUC : Es incorrecto`);
        }
    }

    else if (nat == true) {
        if (digitoVerificador != d10) {
          //  alert('El número de cédula de la persona natural es incorrecto.');
            return new Error(`Error en la Cédula : Es incorrecto`);
        }
        if (numero.length > 10 && numero.substr(10, 3) != '001') {
           // alert('El ruc de la persona natural debe terminar con 001');
            return new Error(`Error en el RUC : Es incorrecto`);
        }
    }
    return true;
}