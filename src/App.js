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
import Consola from './modulos/Prueba/Consola';


function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [{ openSnackbar , sesion }, dispatch] = useStateValue();
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

   const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
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
  console.log('sesionsesionsesionsesion',sesion);
  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <div className={classes.root}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={openSnackbar ? openSnackbar.open : false}
          autoHideDuration={3000}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={

            <Alert severity={openSnackbar ? openSnackbar.severity : 'info'} >
              {openSnackbar ? openSnackbar.mensaje : ""}
            </Alert>

          }
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
        </Snackbar>
      </div>
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />

          <Grid container>
            <Switch>
        {!sesion && <Route path="/" component={Login} /> }
       
              
              <RutaAutenticada exact path='/' firebase={firebase} component={Consola} opcionmenu={'INCIO'} />
              <Route path="/login" component={Login} />
              <Route component={Page404} />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
      <Copyright />
    </React.Fragment>
  ) : null;
}

export default App;
