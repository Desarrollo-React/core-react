import React from "react";
import { validateFormWithSchema, string, email, stringCI } from '../../../lib/Validar';
import { Formik, Field, getIn } from "formik";
import { MTableEditRow, MTableEditField } from 'material-table';
import Constantes from '../../../constantes/Sistema';
import { openMensajePantalla } from '../../../sesion/actions/snackbarAction';
import Moment from 'moment';

const fecha = Moment(new Date()).format(Constantes.FORMATO_FECHA);
const productoRowSchema = {
    identificacion: stringCI({ valCi: '' }),
    nombreUsuario: string({ maxLen: 256 }),
    telefono: string({ maxLen: 64 }),
    email: email({ maxLen: 256 }),
    estado: string({ maxLen: 16 })
};
export const validarDatos = data => {

    return validateFormWithSchema(productoRowSchema, data);

}


/**
 * Guarda los datos en firebase
 * @param {*} firebase 
 * @param {*} datos 
 */
export const save = (firebase, sesion, datos) => {
    return new Promise((resolve, eject) => {
console.log('datos',datos);

        //Creamos el usuario para la autentificación de googl (Authentication)
        //La clave será la identificación hay que validar 
        //cuando sea la identificación igual a la contraseña se debe solicitar el cambio de clave
        firebase.auth
            .createUserWithEmailAndPassword(datos.email, datos.identificacion)
            .then(async usuario => {
                datos.id = await usuario.user.uid;
                datos.fechaRegistro = fecha;
                datos.estadoBorrado = Constantes.ESTADO_BORRADO.NO_BORRADO;
                datos.empresa = [sesion.idEmpresa];
                datos.perfiles = [{ 'idEmpresa': sesion.idEmpresa, 'perfil': datos.perfil }];
                
                firebase.db.collection(Constantes.COLECCION_USUARIOS)
                    .doc(usuario.user.uid)
                    .set(datos, { merge: true })
                    .then(doc => {
                        let id = doc.id;
                        resolve(id);
                        // return id;
                    })
                    .catch(error => {
                        console.log("Error al guardar el socio: ", error);
                        //  return false
                    });

                resolve('id');
            })


    });
}

/**
 * Actualiza los datos en firebase
 * @param {*} firebase 
 * @param {*} dispatch 
 * @param {*} datos 
 */
export const update = async (firebase, dispatch, datos) => {
    //datos.tableData.editing = null;
    firebase.db.collection(Constantes.COLECCION_USUARIOS)
        .doc(datos.id)
        .set(datos)
        .then(success => {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: ("Socio actualizado con éxito"),
                severity: "success"
            });
        })
        .catch(error => {
            console.log("Error al actualizar el socio: ", error);
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: ("Ocurrio un error al actualizar el socio"),
                severity: "error"
            });


        });
}
/**
 * Actualiza el estado de borrado
 * @param {*} firebase 
 * @param {*} dispatch  
 * @param {*} datos 
 */
export const deleteLogico = async (firebase, dispatch, datos) => {

    firebase.db.collection(Constantes.COLECCION_PRINCIPAL).doc(firebase.auth.currentUser.uid).collection(Constantes.COLECCION_SOCIOS)
        .doc(datos.id)
        .update({
            estadoBorrado: Constantes.ESTADO_BORRADO.BORRADO
        })
        .then(success => {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: ("Socio eliminado con éxito"),
                severity: "success"
            });
        })
        .catch(error => {
            console.log("Error al eliminar el socio: ", error);
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: ("Ocurrio un error al eliminar el socio"),
                severity: "error"
            });
        });
}

