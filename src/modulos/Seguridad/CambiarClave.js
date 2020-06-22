import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import { iniciarSesion } from '../../sesion/actions/sesionAction';
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';
import { useStateValue } from '../../sesion/store';
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



function CambiarClave(props) {

    const classes = useStyles();
    const [{ sesion }, dispatch] = useStateValue();
    const firebase = props.firebase;


    let [usuario, cambiarUsuario] = useState({
        password: '',
        password2: ''
    });

    const onChange = e => {
        const { name, value } = e.target;
        cambiarUsuario(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const onSubmit = async e => {
        e.preventDefault();
        const { password, password2 } = usuario;

        if (password === password2) {

            var user = firebase.auth.currentUser;
            user.updatePassword(password).then(function () {
                props.history.push("/login");
            }).catch(function (error) {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: 'Error: no puede cambiar la contraseña',
                    severity: "error"
                });
            });

        } else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Error: La contraseña no coinciden',
                severity: "error"
            });
        }

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
                        Cambio de clave
        </Typography>
                    <form className={classes.form} onChange={onChange} onSubmit={onSubmit}>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Clave"
                            type="password"
                            id="password"

                            onChange={onChange}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password2"
                            label="Repetir Clave"
                            type="password"
                            id="password2"

                            onChange={onChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Cambiar clave
          </Button>

                    </form>

                </div>



            </Container>


        </React.Fragment>
    );
}

export default compose(consumerFirebase)(CambiarClave);