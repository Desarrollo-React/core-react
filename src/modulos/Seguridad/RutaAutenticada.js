import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useStateValue } from '../../sesion/store';
import Constantes from '../../constantes/Sistema';

function RutaAutenticada({ component: Component, firebase, ...rest }) {

  const [{ autenticado, sesion, opcionmenu }, dispatch] = useStateValue();

  if (firebase.auth.currentUser !== null && !sesion) {
    firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(firebase.auth.currentUser.uid)
      .get()
      .then(doc => {
        const usuarioDB = doc.data();
      /*  dispatch({
          type: "INICIAR_SESION",
          sesion: usuarioDB,
          autenticado: true,
          opcion: rest.opcionmenu
        });*/
      });
  }
  



  return (
    <Route
      {...rest}
      render={(props) => (autenticado === true || firebase.auth.currentUser !== null)
        ? <Component {...props} {...rest} />
        : <Redirect to="/login" />
      }
    />
  )
}

export default RutaAutenticada;