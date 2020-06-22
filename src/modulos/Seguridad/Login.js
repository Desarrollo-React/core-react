import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom'
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring/web.cjs';
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import { iniciarSesion } from '../../sesion/actions/sesionAction';
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';
import { useStateValue } from '../../sesion/store';
import FormControl from '@material-ui/core/FormControl';
import Backdrop from '@material-ui/core/Backdrop';
import Constantes from '../../constantes/Sistema';

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
    marginTop: theme.spacing(8),
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  enlace: {
    paddingTop: '30px',
    paddingBottom: '20px'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0px',
    marginRight: '0px',

  },
  papermodal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '500px'
  },
  formControl: {
    '& > *': {
      margin: theme.spacing(1),
      width: '40ch',
    },
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {

  const { in: open, children, onEnter, onExited, ...other } = props;

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

function Login(props) {

  const classes = useStyles();
  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;
  const [open, setOpen] = React.useState(false);

  let [usuario, cambiarUsuario] = useState({
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);

  }

  const onSubmit = async e => {
    e.preventDefault();
    const { email, password } = usuario;

    iniciarSesion(dispatch, firebase, email, password).then(async dbUsuario => {
      if (dbUsuario.identificacion === password) {
        props.history.push("/cambiarclave");
      } else {
        let empresas = await dbUsuario.empresa;
        //Si el usuario esta asignado más de una empresa debe seleccionar la empresa a trabajar
        if (empresas.length === 1) {
          dispatch({
            type: Constantes.ACTION_TIPO.INICIAR_SESION,
            sesion: dbUsuario,
            idEmpresa: empresas[0],
            autenticado: true
          });
          props.history.push("/consola");
        } else {
          props.history.push("/empresas");
        }
      }

    }).catch(error => {
      console.log("Error al buscar los datos desde firebase", error);
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: error.mensaje.message,
        severity: "error"
      });
    });

    //let callback = await iniciarSesion(dispatch, firebase, email, password);

    /*  if (callback.status) {
        props.history.push("/");
      } else {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: callback.mensaje.message,
          severity: "error"
        });
      }*/
  }

  const cambiarClave = () => {
    firebase.cambiarClave(usuario.email).then(function () {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: ("Fue enviando a su correo un enlace para el cambio de clave"),
        severity: "success"
      });
    }).catch(function (error) {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: ("Error: Este correo esta registrado"),
        severity: "error"
      });
    });

  }

  const [modalStyle] = React.useState();
  return (
    <React.Fragment>
      <Container className={classes.main} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresar al sistema
        </Typography>
          <form className={classes.form} onChange={onChange} onSubmit={onSubmit}>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Clave"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Guardar la sesión iniciada"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Ingresar
          </Button>
            <Grid container>
              <Grid item>
                <Link className={classes.enlace} component={RouterLink} to="/registrar" variant="body2">
                  {"No tiene una cuenta? Crear nueva cuenta"}
                </Link>
              </Grid>
              <Grid item>
                <Link className={classes.enlace} onClick={handleOpen} variant="body2">
                  {"No recuerda la clave?"}
                </Link>

              </Grid>
            </Grid>
          </form>

        </div>



      </Container>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>


          <div style={modalStyle} className={classes.papermodal}>
            <h2 id="spring-modal-title">RESTABLECER LA CONTRASEÑA</h2>
            <Grid container >
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="email"
                    type='email'
                    variant="outlined"
                    label="Correo electrónico"
                    value={usuario.email}
                    onChange={onChange}
                  />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={cambiarClave}
                  >
                    Restablecer contraseña
          </Button>
                </FormControl>
              </Grid>
            </Grid>
          </div>

        </Fade>
      </Modal>
    </React.Fragment>
  );
}

export default compose(consumerFirebase)(Login);