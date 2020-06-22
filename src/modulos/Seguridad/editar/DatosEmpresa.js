import React, { useState, useEffect } from 'react';
import { useStateValue } from '../../../sesion/store';
import { Container, Avatar, Typography, Grid, TextField, Button, CssBaseline } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { consumerFirebase } from '../../../server';
import { openMensajePantalla } from '../../../sesion/actions/snackbarAction';
import { buscarEmpresa } from '../../../sesion/actions/sesionAction';
import ImageUploader from 'react-images-upload';
import logoTemp from "../../../logo.svg";
import uuid from 'uuid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring/web.cjs';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import PhotoIcon from '@material-ui/icons/Photo';
import Link from '@material-ui/core/Link';
import Constantes from '../../../constantes/Sistema';
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
    margin: 10,
    width: 200,
    height: 200

  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50ch',
      minWidth: 120,
    },
  },
  formControlSelect: {
    '& > *': {
      margin: theme.spacing(1),
      width: '44ch',
      minWidth: 120,

    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  combo: {
    borderTop: '0px'
  },
  logo: {
    maxWidth: 345,
  },
  media: {
    height: 250,
    marginTop: '10px'
  },
  titulo: {
    textAlign: 'center',
    marginTop: '10px'
  },
  subir: {
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  botonActualizar: {
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  papermodal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  jaapWrapper: {
    position: 'relative',
    marginTop: theme.spacing(3),
    backgroundColor: '#56ff34',
    float: 'right',
    marginRight: '50px'
  }
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

//componente react constante es decir sin estado

function DatosEmpresa(props) {
  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;
  const [buscar, setBuscar] = React.useState(true);
  //variable json llamada usuario local para los datos
  let [usuario, cambiarUsuario] = useState({
    email: '',
    ruc: '', // Numérico 13 Obligatorio
    nombreComercial: '', //Alfanumérico Max. 300 Obligatorio
    representanteLegal: '',
    nombreEtiqueta: '', //
    razonSocial: '', //Alfanumérico Max. 300 Obligatorio
    direccionMatriz: '', //Alfanumérico Max. 300 Obligatorio
    direccionSucursal: '', //Alfanumérico Max. 300 Obligatorio
    obligadoContabilidad: '',//Alfanumérico Max 2 Opcional --no editar
    contribuyenteEspecial: '', //Numérico Min. 3 y Max. 5 Opcional
    codigoEstablecimiento: '', //Numérico 3 Obligatorio --no editar
    codigoPuntoEmision: '', //Numérico 3 Obligatorio --no editar
    secuenciaOrdenPago: '',
    secuenciaFactura: '',
    logo: '', //Cargar logo para factura Opcional
    telefono: '',
    pais: '',
    provincia: '',
    canton: '',
    parroquia: '',
    claveFirmaElectronica: '',
    urlFirmaElectronica: ''
  });

  const onChange = e => {
    const { name, value } = e.target;
    cambiarUsuario(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const guardarCambiosFactura = e => {
      e.preventDefault();
let datosSri = {
  obligadoContabilidad : usuario.obligadoContabilidad,
  contribuyenteEspecial: usuario.contribuyenteEspecial,
  codigoEstablecimiento:usuario.codigoEstablecimiento,
  codigoPuntoEmision: usuario.codigoPuntoEmision,
  secuenciaOrdenPago: usuario.secuenciaOrdenPago,
  secuenciaFactura: usuario.secuenciaFactura,
}
firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(sesion.idEmpresa)
      .set(datosSri, { merge: true })
      .then(success => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: ("Datos actualizados con éxito"),
          severity: "success"
        });
        setOpen(false);
      })
      .catch(error => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: ("Error" + error),
          severity: "error"
        });
      })
    }

  const guardarCambios = e => {
    e.preventDefault();
    firebase.db
      .collection(Constantes.COLECCION_PRINCIPAL)
      .doc(sesion.idEmpresa)
      .set(usuario, { merge: true })
      .then(success => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: ("Datos actualizados con éxito"),
          severity: "success"
        });

      })
      .catch(error => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: ("Error" + error),
          severity: "error"
        });
      })
  }

  useEffect(() => {

    if (buscar) {

        buscarEmpresa(firebase, sesion.idEmpresa).then(dbDatos => {

        cambiarUsuario(dbDatos);
        setBuscar(false);
      })

    }
  });
  const subirFirma = event => { 

    const firma = event.target.files[0];
    const claveUnicaFirma =  usuario.rucjaap;
    const nombreFirma =firma.name; 
    const extensionFirma = nombreFirma.split('.').pop();
    const alias =  ("firmajaap_" + claveUnicaFirma + "." + extensionFirma).replace(/\s/g, "_").toLowerCase();
    firebase.guardarDocumento(alias, Constantes.CARPETA_FIRMAS, firma).then(metadata => {
      firebase.devolverDocumento(alias, Constantes.CARPETA_FIRMAS).then(urlFirma => {
        usuario.urlFirmaElectronica = urlFirma;
        firebase.db
          .collection(Constantes.COLECCION_PRINCIPAL)
          .doc(sesion.idEmpresa)
          .set(
            {
              urlFirmaElectronica: urlFirma,
              claveFirmaElectronica:usuario.claveFirmaElectronica
            },
            { merge: true }
          )
          .then(userDB => {
            
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: ("Firma subida con exito con éxito"),
              severity: "success"
            });
            setOpen(false);
          })

      })

    })
    
  }

  const subirFoto = fotos => {
    //1. Capturar la imagen
    const foto = fotos[0];
    //2. Renombrar la imagen
    const claveUnicaFoto =  usuario.rucjaap;
    //3. Obtener el nombre de la foto 
    const nombreFoto = foto.name;
    //4. Obtener la extension de la imagen
    const extensionFoto = nombreFoto.split('.').pop();
    //5. Crear el nuevo nombre de la foto - alias
    const alias = ("logojaap_" + claveUnicaFoto + "." + extensionFoto).replace(/\s/g, "_").toLowerCase();
    // V a xI.jpg  --->  v_a_xi_423454354423324423.jpg

    firebase.guardarDocumento(alias, Constantes.CARPETA_LOGOS, foto).then(metadata => {
      firebase.devolverDocumento(alias,Constantes.CARPETA_LOGOS ).then(urlFoto => {
        usuario.logo = urlFoto;
        firebase.db
          .collection(Constantes.COLECCION_PRINCIPAL)
          .doc(sesion.idEmpresa)
          .set(
            {
              logo: urlFoto
            },
            { merge: true }
          )
          .then(userDB => {
            
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: ("Logo subido con exito con éxito"),
              severity: "success"
            });
          })

      })

    })

  }
  let fotoKey = uuid.v4();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (idLectura, medidor, idSocio) => {
    let lectura = setOpen(true);

  }
  const actions = [
    { id: 1, icon: <PhotoIcon />, name: 'Logotipo' },
    { id: 2, icon: <FileCopyIcon />, name: 'Configuración factura' },
    { id: 3, icon: <VpnKeyIcon />, name: 'Firma electrónica' },
  ];
  const [openBoton, setOpenBoton] = React.useState(false);
  const [tipo, setTipo] = React.useState(0);
  const handleCloseBoton = () => {
    setOpenBoton(false);
  };

  const handleOpenBoton = () => {
    setOpenBoton(true);
  };

  const abrirVentana = (event, id) => {

    setTipo(id);
    setOpen(true);
  }
  const [modalStyle] = React.useState();
  //creamos la interfaz gráfica
  return (
    <React.Fragment>
      <Container className={classes.main} component="main" maxWidth="md" justify="center">
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <div className={classes.jaapWrapper}>
              <SpeedDial
                ariaLabel="MÁS INFORMACIÓN"
                className={classes.speedDial}
                icon={<SpeedDialIcon />}
                onClose={handleCloseBoton}
                onOpen={handleOpenBoton}
                open={openBoton}
                direction={"down"}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={(e) => {
                      abrirVentana(e, action.id)
                    }}
                  />
                ))}
              </SpeedDial>
            </div>
          </Grid>
        </Grid>

        <Typography className={classes.titulo} component="h1" variant="h5">
          DATOS DE LA EMPRESA
          </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="ruc"
                label="RUC"
                name="ruc"
                type="number"
                onChange={onChange}
                value={usuario.rucjaap}
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 13)
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
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

            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                autoComplete="nombreComercial"
                name="nombreComercial"
                variant="outlined"
                required
                fullWidth
                id="nombreComercial"
                label="Nombre comercial"
                onChange={onChange}
                autoFocus
                value={usuario.nombreComercial}
              />

            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="razonSocial"
                label="Razón social"
                name="razonSocial"
                autoComplete="razonSocial"
                onChange={onChange}
                value={usuario.razonSocial}
              />

            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="direccionMatriz"
                label="Dirección Matriz"
                name="direccionMatriz"
                autoComplete="direccionMatriz"
                onChange={onChange}
                value={usuario.direccionMatriz}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="direccionSucursal"
                label="Dirección sucursal"
                name="direccionSucursal"
                autoComplete="direccionSucursal"
                onChange={onChange}
                value={usuario.direccionSucursal}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="telefono"
                variant="outlined"
                fullWidth
                label="Teléfono"
                value={usuario.telefono}
                onChange={onChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                label="E-mail"
                value={usuario.email}
                onChange={onChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>        
              <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="pais"
                variant="outlined"
                fullWidth
                label="País"
                value={usuario.pais}
                onChange={onChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>        
              <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="provincia"
                variant="outlined"
                fullWidth
                label="Provincia"
                value={usuario.provincia}
                onChange={onChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="canton"
                variant="outlined"
                fullWidth
                label="Cánton"
                value={usuario.canton}
                onChange={onChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="parroquia"
                variant="outlined"
                fullWidth
                label="Parroquia"
                value={usuario.parroquia}
                onChange={onChange}
              />
            </FormControl>
          </Grid>
         
          <Grid item xs={12} className={classes.botonActualizar} >
            <FormControl variant="outlined" className={classes.formControl}>
              <Button
                type="submit"
                onClick={guardarCambios}
                variant="contained"
                color="primary"
                className={classes.submit} >
                Actualizar datos
                </Button>
            </FormControl>
          </Grid>
        </Grid>
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
          {tipo === 1 &&
            <div style={modalStyle} className={classes.papermodal}>
              <h2 id="spring-modal-title">LOGOTIPO DE LA EMPRESA</h2>

              <Grid item xs={12} >
                <Card className={classes.logo}>
                  <CardMedia
                    className={classes.media}
                    image={usuario.logo || logoTemp}
                    title="Logo de la empresa"
                  />
                </Card>

              </Grid>
              <Grid item xs={12} className={classes.subir}>
                <ImageUploader
                  withIcon={true}
                  key={fotoKey}
                  singleImage={true}
                  buttonText="Seleccione el logo de la empresa"
                  onChange={subirFoto}
                  imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
              </Grid>

            </div>
          }
          {tipo === 2 &&
            <div style={modalStyle} className={classes.papermodal}>
              <h2 id="spring-modal-title">CONFIGURACIÓN FACTURA</h2>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="contribuyenteEspecial"
                    variant="outlined"
                    fullWidth
                    label="Contribuyente Especial"
                    value={usuario.contribuyenteEspecial}
                    onChange={onChange}
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                    }}
                  />

                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControlSelect}>
                  <InputLabel htmlFor="obligadoContabilidad"> Obligado a llevar contabilidad ?</InputLabel>

                  <Select className={classes.combo}
                    native
                    value={usuario.obligadoContabilidad}
                    onChange={onChange}
                    inputProps={{
                      name: "obligadoContabilidad",
                      id: "obligadoContabilidad"
                    }}
                  >
                    <option value="NA">Seleccionar</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="codigoEstablecimiento"
                    variant="outlined"
                    fullWidth
                    label="Código Establecimiento"
                    value={usuario.codigoEstablecimiento}
                    onChange={onChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="codigoPuntoEmision"
                    variant="outlined"
                    fullWidth
                    label="Código Punto Emisión"
                    value={usuario.codigoPuntoEmision}
                    onChange={onChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="secuenciaOrdenPago"
                    variant="outlined"
                    fullWidth
                    label="Secuencia Orden Pago"
                    value={usuario.secuenciaOrdenPago}
                    onChange={onChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    name="secuenciaFactura"
                    variant="outlined"
                    fullWidth
                    label="Secuencia Factura"
                    value={usuario.secuenciaFactura}
                    onChange={onChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} className={classes.botonActualizar} >
                <FormControl variant="outlined" className={classes.formControl}>
                  <Button
                    type="submit"
                    onClick={guardarCambiosFactura}
                    variant="contained"
                    color="primary"
                    className={classes.submit} >
                    Guardar
                </Button>
                </FormControl>
              </Grid>
            </div>
          }
          {tipo === 3 &&
            <div style={modalStyle} className={classes.papermodal}>
              <h2 id="spring-modal-title">FIRMA ELECTRÓNICA</h2>

              <Grid item xs={12} >

                <Link className={classes.enlace} href={usuario.urlFirmaElectronica} variant="body2">
                  {"Descargar archivo de firma electrónica"}
                </Link>

              </Grid>

              <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                name="claveFirmaElectronica"
                id="claveFirmaElectronica"
                variant="outlined"
                fullWidth
                label="Clave firma electrónica"
                value={usuario.claveFirmaElectronica}
                onChange={onChange}
              />
            </FormControl>


              <Grid item xs={12} >
                <TextField
                  name="secuenciaOrdenPagox"
                  type="file"
                  variant="outlined"
                  fullWidth

                  onChange={subirFirma}
                />
              </Grid>

            </div>
          }
        </Fade>
      </Modal>

    </React.Fragment>

  );
}

export default consumerFirebase(DatosEmpresa);