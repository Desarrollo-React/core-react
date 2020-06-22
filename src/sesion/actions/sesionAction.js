import Constantes from '../../constantes/Sistema';
import Moment from 'moment';

export const refrescarSesion = firebase => {
  return new Promise((resolve, eject) => {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        user.getIdToken(true);
        resolve();
      }
    });
  });
};

export const iniciarSesion = (dispatch, firebase, email, password) => {

  return new Promise((resolve, eject) => {
    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(auth => {
        firebase.db
          .collection(Constantes.COLECCION_USUARIOS)
          .doc(auth.user.uid)
          .get()
          .then(doc => {
            const usuarioDB = doc.data();
            dispatch({
              type: Constantes.ACTION_TIPO.INICIAR_SESION,
              sesion: usuarioDB,
              autenticado: true
            });
            resolve(usuarioDB);
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

        eject({ status: false, mensaje: error });
      });
  });
};
/*
* REGISTRO DE LA EMPRESA Y EL USUARIO ADMINISTRADOR
*/
export const registrarUsuario = (dispatch, firebase, usuario) => {

  return new Promise(async (resolve, eject) => {

    //VERIFICAMOS QUE ESTA EMPRESA NO ESTA REGISTRADA
    let empresa = firebase.db.collection(Constantes.COLECCION_PRINCIPAL).doc(usuario.ruc.trim());
    const doc = await empresa.get();

    if (!doc.data()) {

      firebase.auth
        .createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then(async auth => {
          //CREAR LA EMPRESA
          usuario.usuario_creacion = await auth.user.uid;
          firebase.db
            .collection(Constantes.COLECCION_PRINCIPAL)
            .doc(usuario.ruc.trim())
            .set(
              {
                usuario_creacion: auth.user.uid,
                tipoPersona: Constantes.TIPO_PERSONA.JURIDICA,
                email: usuario.email,
                ruc: usuario.ruc, // Numérico 13 Obligatorio
                nombreComercial: usuario.nombreComercial, //Alfanumérico Max. 300 Obligatorio
                representanteLegal: usuario.representanteLegal,
                razonSocial: usuario.nombreComercial, //Alfanumérico Max. 300 Obligatorio
                direccionMatriz: 'Actualizar la dirección', //Alfanumérico Max. 300 Obligatorio
                direccionSucursal: 'Actualizar la dirección', //Alfanumérico Max. 300 Obligatorio
                obligadoContabilidad: 'NO',//Alfanumérico Max 2 Opcional --no editar
                contribuyenteEspecial: '000', //Numérico Min. 3 y Max. 5 Opcional
                codigoEstablecimiento: '001', //Numérico 3 Obligatorio --no editar
                codigoPuntoEmision: '001', //Numérico 3 Obligatorio --no editar
                secuenciaOrdenPago: '0',
                secuenciaFactura: '0',
                logo: 'ruta',
                //Cargar logo para factura Opcional
                telefono: usuario.telefono,
                estadoContrato: Constantes.ESTADO_CONTRATO.PRUEBA,
                estado: Constantes.ESTADO_FUNCIONAL.ACTIVO,
                fechaRegistro: Moment().format(Constantes.FORMATO_FECHA),
                fechaUltimoCambio: Moment().format(Constantes.FORMATO_FECHA),
                // perfil: Constantes.PERFIL.JAAP,
                fechaInicioContrato: '0000-00-00',
                fechaFinContrato: '0000-00-00',
                MotivoFinContrato: 'Historico: Fecha ------- motivo ----------',
                urlFirmaElectronica: '',
                claveFirmaElectronica: '',
                estadoBorrado: Constantes.ESTADO_BORRADO.NO_BORRADO,
              },
              { merge: true }
            )
            .then(async doc => {

              let usuarioSession = await {
                id: auth.user.uid,
                empresa: [usuario.ruc],
                perfil: [{ 'idEmpresa': usuario.ruc, perfil: ['ADMINISTRADOR'] }],
                identificacion: usuario.ruc,
                nombreUsuario: usuario.nombreComercial,
                email: usuario.email,
                telefono: usuario.telefono,
                estadoBorrado: Constantes.ESTADO_BORRADO.NO_BORRADO,
                fechaRegistro: Moment().format(Constantes.FORMATO_FECHA),
                estado: Constantes.ESTADO_FUNCIONAL.ACTIVO
              };
              //CREAR USUARIO ADMINISTRADOR
              firebase.db
                .collection(Constantes.COLECCION_USUARIOS)
                .doc(auth.user.uid)
                .set(usuarioSession, { merge: true })
                .then(async doc2 => {
                  usuarioSession.registro = await 'OK.';
                  dispatch({
                    type: Constantes.ACTION_TIPO.INICIAR_SESION,
                    sesion: usuarioSession,
                    autenticado: true
                  });

                  resolve({ status: true });
                })
                .catch(error => {
                  console.log("No se pudó crear el usuario ", error);
                  return false
                });
            })
            .catch(error => {
              console.log("No se registro la empresa ", error);
              return false
            });

          //fin
        })
        .catch(error => {
          console.log("error db", error);

          eject({ status: false, mensaje: "Este correo electrónico ya se encuentra registrado" });

        });
    } else {

      eject({ status: false, mensaje: 'Esta empresa ya se encuentra registrada' });

    }
  });

};

export const buscarEmpresa = (firebase, idEmpresa) => {
  return new Promise(async (resolve, eject) => {
    let JSdb = firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(idEmpresa);
    const doc = await JSdb.get();
    let data = doc.data();
    data.id = doc.id;
    let empresa = { ...data };

    resolve(empresa);
  })

}


export const buscarUsuario = (firebase) => {
  return new Promise(async (resolve, eject) => {
    let JSdb = firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(firebase.auth.currentUser.uid);
    const doc = await JSdb.get();
    let data = doc.data();
    data.id = doc.id;
    let usuario = { ...data };

    resolve(usuario);
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
