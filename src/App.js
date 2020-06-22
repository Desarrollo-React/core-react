import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppNavbar from "./component/plantilla/AppNavbar";
import Copyright from './component/plantilla/Copyright';
import theme from "./component/plantilla/theme";
import Page404 from './component/Page404';
import { FirebaseContext } from "./server";
import { useStateValue } from "./sesion/store";
import RutaAutenticada from './modulos/Seguridad/RutaAutenticada';
import Login from "./modulos/Seguridad/Login";
import Registrar from "./modulos/Seguridad/Registrar";
import Consola from './modulos/Prueba/Consola';
import ListaUsuarios from "./modulos/Seguridad/ListaUsuarios";
import Usuarios from "./modulos/Seguridad/Usuarios";
import DatosEmpresa from './modulos/Seguridad/editar/DatosEmpresa';
import CambiarClave from './modulos/Seguridad/CambiarClave';

import store from "./redux/store";
import { Provider } from "react-redux";

function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [{ openSnackbar, sesion }, dispatch] = useStateValue();
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
  }));

  const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseInicial(val);
    }).catch(function (error) {
      console.log("Error de autentificación ", error);

    });
  });
  const classes = useStyles();

  return autenticacionIniciada !== false ? (
    <Provider store={store}>
      <React.Fragment>
        <div className={classes.root}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSnackbar ? openSnackbar.open : false}
            autoHideDuration={6000}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            onClose={() =>
              dispatch({
                type: "OPEN_SNACKBAR",
                openMensaje: {
                  open: false,
                  mensaje: ""

                }
              })
            }
          >
            <Alert severity={openSnackbar ? openSnackbar.severity : 'info'} >
              {openSnackbar ? openSnackbar.mensaje : ""}
            </Alert>
          </Snackbar>
        </div>
        <Router>
          <MuiThemeProvider theme={theme}>
            <AppNavbar />

            <Grid container>
              <Switch>
                <Route path="/registrar" component={Registrar} />
                {!sesion && <Route path="/" component={Login} />}

                <RutaAutenticada exact path='/consola' firebase={firebase} component={Consola} opcionmenu={'INCIO'} />
                <RutaAutenticada exact path='/listaUsuarios' firebase={firebase} component={ListaUsuarios} opcionmenu={'ROLES'} />
                <RutaAutenticada exact path='/usuarios' firebase={firebase} component={Usuarios} opcionmenu={'USUARIOS'} />
                <RutaAutenticada exact path='/datosempresa' firebase={firebase} component={DatosEmpresa} opcionmenu={'Datos Empresa'} />
                <RutaAutenticada exact path='/cambiarclave' firebase={firebase} component={CambiarClave} opcionmenu={'Cambiar Clave'} />
                
                <Route path="/login" component={Login} />

                <Route component={Page404} />
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Router>
        <Copyright />
      </React.Fragment>
    </Provider>
  ) : null;
}

export default App;
