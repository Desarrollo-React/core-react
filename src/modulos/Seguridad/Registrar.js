import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useStateValue } from "../../sesion/store";
import { consumerFirebase } from '../../server';
import { registrarUsuario } from '../../sesion/actions/sesionAction';
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';
import { ValidarRuc } from '../../lib/ValidarRuc';
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.primary.main,
    }
  },
  main: {
    backgroundColor: '#ffffff',
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Registrar(props) {

  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;


  const [terminoreferencia, setTerminoreferencia] = React.useState(false);

  let [usuario, cambiarUsuario] = useState({
    ruc: '',
    nombreComercial: '',
    representanteLegal: '',
    telefono: '',
    email: '',
    password: ''
  });

  const onChange = e => {
    const { name, value } = e.target;
    cambiarUsuario(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const confirmar = e => {
    setTerminoreferencia(e.target.checked);
  }

  const registrar = async e => {
    
    e.preventDefault();
    let error = false;
    let mensaje = "";
    let validacionruc = ValidarRuc(usuario.ruc);
    
    if (validacionruc.name!='Error') {
      if (!terminoreferencia) { error = true; mensaje = "Debe aceptar las condiciones de uso y el aviso de privacidad"; }
      if (usuario.password === "") { error = true; mensaje = "Constraseña es obligatorio"; }
      if (usuario.email === "") { error = true; mensaje = "Correo electrónico es obligatorio"; }
      if (usuario.telefono === "") { error = true; mensaje = "Teléfono es obligatorio"; }
      if (usuario.representanteLegal === "") { error = true; mensaje = "Representante legal es obligatorio"; }
      if (usuario.nombreComercial === "") { error = true; mensaje = "Nombre es obligatorio"; }
      if (usuario.ruc === "") { error = true; mensaje = "RUC es obligatorio"; }
    } else {
      mensaje = validacionruc.message;
      error = true;
    }
    if (error) {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: mensaje,
        severity: "error"
      });
    } else {
      registrarUsuario(dispatch, firebase, usuario).then(dbDatos => {
       
        props.history.push("/editar/datosempresa")
        
      }).catch(error => {
        console.log(error)
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: error.mensaje,
          severity: "error"
        });
      });

    }
  }


  const classes = useStyles();

  return (
    <Container className={classes.main} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          CREAR CUENTA
        </Typography>
        <form className={classes.form}  >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="ruc"
                label="RUC"
                name="ruc"
                autoComplete="ruc"
                onChange={onChange}
                value={usuario.ruc}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="nombreComercial"
                label="Nombre comercial"
                name="nombreComercial"
                autoComplete="nombreComercial"
                onChange={onChange}
                value={usuario.nombreComercial}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="representanteLegal"
                name="representanteLegal"
                variant="outlined"
                required
                fullWidth
                id="representanteLegal"
                label="Nombre representante legal"
                onChange={onChange}
                autoFocus
                value={usuario.representanteLegal}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                variant="outlined"
                required
                fullWidth
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                onChange={onChange}
                value={usuario.telefono}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                type="email"
                onChange={onChange}
                value={usuario.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Clave"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChange}
                value={usuario.password}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={terminoreferencia} onChange={confirmar} value='1' color="primary" />}
                label={"Confirmo que he leído y acepto las"} /> <Link target="_blank" href={process.env.PUBLIC_URL + '/condiciones_de_uso.pdf'} rel="noopener">{'condiciones de uso'} </Link>
              {" y el "}  <Link target="_blank" href={process.env.PUBLIC_URL + '/aviso_de_privacidad.pdf'} rel="noopener">{"aviso de privacidad"}</Link>

            </Grid>
          </Grid>
          <Button

            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={registrar}
          >
            Crear cuenta
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link  component={RouterLink} to="/login" variant="body2">
                Ya tiene una cuenta? Ingresar
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

    </Container>
  );
}
export default consumerFirebase(Registrar);