import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import BarSession from "./bar/BarSession";
import { withStyles } from "@material-ui/styles";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { StateContext } from "../../sesion/store";
import Constantes from '../../constantes/Sistema'
import { salirSesion } from "../../sesion/actions/sesionAction";
const styles = theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
 
});

class AppNavbar extends Component {
  static contextType = StateContext;

  state = {
    firebase: null
  };

  salirSesionApp = () => {
    const { firebase } = this.state;
    const [{ sesion }, dispatch] = this.context;

    salirSesion(dispatch, firebase).then(success => {
      this.props.history.push("/login");
    });
  };


  componentDidMount() {
    const { firebase } = this.state; 
    const [ { sesion },dispatch] = this.context; 
     
    if (sesion && !sesion.usuario ) {
     // this.salirSesionApp();
     this.props.history.push("/login");
     /* firebase.db
        .collection(Constantes.COLECCION_PRINCIPAL)
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          const usuarioDB = doc.data();
          dispatch({
            type: "INICIAR_SESION",
            sesion: usuarioDB,
            autenticado: true
          });
        });*/
    }
  }
/*
  static getDerivedStateFromProps(nextProps, prevState) {
    let nuevosObjetos = {};
    if (nextProps.firebase !== prevState.firebase) {
      nuevosObjetos.firebase = nextProps.firebase;
    }
    return nuevosObjetos;
  }
*/
  render() {
    const [{sesion}] = this.context;

    return sesion ? (sesion.usuario ? (
        <div>
          <AppBar position="static">
            <BarSession />
          </AppBar>
        </div>
      )
      :null
      ) 
    :null;
  }
}

export default compose(
  withStyles(styles),
  consumerFirebase
)(AppNavbar);
