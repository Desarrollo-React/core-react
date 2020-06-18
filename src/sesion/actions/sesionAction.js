import Constantes from '../../constantes/Sistema';
import Moment from 'moment';

export const iniciarSesion = (dispatch, firebase, email, password) => {
 
  return new Promise((resolve, eject) => {
    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(auth => {
        localStorage.setItem(Constantes.ID_JAAP, auth.user.uid);
        firebase.db
          .collection(Constantes.COLECCION_PRINCIPAL)
          .doc(auth.user.uid)
          .get()
          .then(doc => {
            const usuarioDB = doc.data();                    
              dispatch({
                type: Constantes.ACTION_TIPO.INICIAR_SESION,
                sesion: usuarioDB,
                autenticado: true
              });                     
            resolve({ status: true });
          });
      })
      .catch(error => {
        console.log("error", error);
        if (error.code === "auth/user-not-found") {
          error.message = "El Usuario no existe";
        }
        if (error.code === "auth/wrong-password") {
          error.message = "Clave inconrrecta";
        }
       
        resolve({ status: false, mensaje: error });
      });
  });
};

export const crearJaap = (dispatch, firebase, usuario) => {
  return new Promise((resolve, eject) => {
    firebase.auth
      .createUserWithEmailAndPassword(usuario.email, usuario.password)
      .then(auth => {
        firebase.db
          .collection(Constantes.COLECCION_PRINCIPAL)
          .doc(auth.user.uid)
          .set(
            {
              id: auth.user.uid,
              tipoPersona: Constantes.TIPO_PERSONA.JURIDICA,
              email: usuario.email,
              rucjaap: usuario.rucjaap, // Numérico 13 Obligatorio
              nombreComercial: usuario.nombreComercial, //Alfanumérico Max. 300 Obligatorio
              representanteLegal: usuario.representanteLegal,
              nombreEtiqueta: usuario.nombreComercial, //
              razonSocial: usuario.nombreComercial, //Alfanumérico Max. 300 Obligatorio
              direccionMatriz: 'Actualizar la dirección', //Alfanumérico Max. 300 Obligatorio
              direccionSucursal: 'Actualizar la dirección', //Alfanumérico Max. 300 Obligatorio
              obligadoContabilidad: 'NO',//Alfanumérico Max 2 Opcional --no editar
              contribuyenteEspecial: '000', //Numérico Min. 3 y Max. 5 Opcional
              codigoEstablecimiento: '001', //Numérico 3 Obligatorio --no editar
              codigoPuntoEmision: '001', //Numérico 3 Obligatorio --no editar
              secuenciaOrdenPago:'0',
              secuenciaFactura:'0',
              logo: 'ruta',
              //Cargar logo para factura Opcional
              telefono: usuario.telefono,
              estadoContrato: Constantes.ESTADO_CONTRATO.PRUEBA,
              estado: Constantes.ESTADO_FUNCIONAL.ACTIVO,
              fechaRegistro: Moment().format(Constantes.FORMATO_FECHA),
              fechaUltimoCambio: Moment().format(Constantes.FORMATO_FECHA),
              perfil: Constantes.PERFIL.JAAP,
              fechaInicioContrato: '0000-00-00',
              fechaFinContrato: '0000-00-00',
              MotivoFinContrato: 'Historico: Fecha ------- motivo ----------',
              urlFirmaElectronica:'',
              claveFirmaElectronica:'',
              estadoBorrado: Constantes.ESTADO_BORRADO.NO_BORRADO,
              secuencialMedidor:'1'
            },
            { merge: true }
          )
          .then(doc => {
            usuario.id = auth.user.uid;
            usuario.nombreEtiqueta = usuario.nombreComercial;
            dispatch({
              type: Constantes.ACTION_TIPO.INICIAR_SESION,
              sesion: usuario,
              autenticado: true
            });
            resolve({ status: true });
          });
      })
      .catch(error => {
        console.log("error", error);
        if (error.code === "auth/email-already-in-use") {
          error.message = "Este correo electrónico ya se encuentra registrado";

        }
        eject({ status: false, mensaje: error });

      });
  });
};

export const buscarJaap = (firebase) => {
  return new Promise(async (resolve, eject) => {
    let jaapdb = firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(firebase.auth.currentUser.uid);
    const doc = await jaapdb.get();
    let data = doc.data();
    data.id = doc.id;
    let jaap = { ...data };

    resolve(jaap);
  })

}

export const salirSesion = (dispatch, firebase) => {
  return new Promise((resolve, eject) => {
    firebase.auth.signOut().then(salir => {
      dispatch({
        type: Constantes.ACTION_TIPO.SALIR_SESION,
        nuevoUsuario: null,
        autenticado: false
      });
      localStorage.clear();
      resolve();
    })
  })
}
