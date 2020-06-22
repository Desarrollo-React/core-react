import React, { useEffect } from "react";
import MaterialTable, { MTableEditField, MTableEditRow } from 'material-table';
import Constantes from '../../constantes/Sistema';
import { useStateValue } from "../../sesion/store";
import { consumerFirebase } from '../../server';
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';
import { obtenerData, buscarSocioIdentificacion, buscarSocioIdentificacion2 } from "../../sesion/actions/UsuariosAction";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { localization } from '../../lib/MensajesGrid';
import { Formik, Field, getIn } from "formik";

import Moment from 'moment';
import { validarDatos, save, update, deleteLogico } from './modelos/ModelosUsuarios';

function Usuarios(props) {
  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;

  const [loading, setLoading] = React.useState(false);
  const fecha = Moment(new Date()).format(Constantes.FORMATO_FECHA);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Identificación', field: 'identificacion' },
      { title: 'Nombre usuario', field: 'nombreUsuario' },
      { title: 'Teléfono', field: 'telefono', filtering: false },
      { title: 'E-mail', field: 'email', filtering: false },
      { title: 'Fecha registro', field: 'fechaRegistro', editable: 'never', initialEditValue: fecha },
      {
        title: 'Perfil', field: 'perfil', lookup: Constantes.PERFIL_USUARIO, initialEditValue: Constantes.PERFIL_USUARIO.OPERADOR_A, cellStyle: function (data) {
          return { color: data === Constantes.PERFIL_USUARIO.ADMINISTRADOR ? '#FF0000' : '#000000' };
        }
      },
      {
        title: 'Estado', field: 'estado', lookup: Constantes.ESTADO_FUNCIONAL, initialEditValue: Constantes.ESTADO_FUNCIONAL.ACTIVO, cellStyle: function (data) {
          return { color: data === Constantes.ESTADO_FUNCIONAL.DESACTIVADO ? '#FF0000' : '#000000' };
        }
      },

    ],
    data: [],
    buscar: true,
    title: 'USUARIOS'
  });

  useEffect(function () {

    if (state.buscar && sesion.idEmpresa) {
      obtenerData(firebase, sesion.idEmpresa).then(dbDatos => {
        setLoading(true);

        let datos = dbDatos.arrayFilas;
        if (datos.length > 0) {

          setState(prev => ({
            ...prev,
            ['data']: datos,
            ['buscar']: false

          }));
        } else {
          setState(prev => ({
            ...prev,
            ['buscar']: false

          }));
        }
        setLoading(false);
      })
        .catch(error => {
          console.log("Error al buscar los datos desde firebase", error);
        });

    }
  });

  // VALIDACIÓN SI EL USUARIO EXISTE

  const MuiTableEditRow = ({ onEditingApproved, ...props }) => {
    return (

      <Formik
        initialValues={props.data ? props.data : { id: 0, estado: Constantes.ESTADO_FUNCIONAL.ACTIVO }}

        validate={values => {

          if (!values) return {};
          // const { errors } = validateFormWithSchema(productoRowSchema, values);
          const { inputs, errors } = validarDatos(values);
          return errors;
        }}

        onSubmit={values => {
          if (values) {

            onEditingApproved(props.mode, values, props.data); //(mode, newData, oldData)

          }
        }}
        children={({ submitForm }) => (
          <MTableEditRow {...props} onEditingApproved={submitForm} />
        )}

      />
    );
  };

  const FormikMTInput = props => {

    return (
      <Field name={props.columnDef.field}>
        {({ field, form, meta }) => {
          const { name } = field;
          const { errors, setFieldValue } = form;
          const showError = !!getIn(errors, name);

          return (
            <div>
              <MTableEditField
                {...props}
                {...field}
                error={showError}
                onChange={newValue => cambiarCampo(name, newValue, setFieldValue)}
              // onChange={newValue => setFieldValue(name, newValue)}
              />
              {errors[field.name] && <div>{errors[field.name]}</div>}
            </div>
          );
        }}
      </Field>
    );
  };

  const cambiarCampo = (name, newValue, setFieldValue) => {
    if (name === 'identificacion') {
      setFieldValue(name, newValue);
      buscarSocioIdentificacion(firebase, newValue).then(dbDatos => {

        if (dbDatos.arrayFilas.length > 0) {
          const dbUsuario = dbDatos.arrayFilas[0];
          setFieldValue('email', dbUsuario.email);
          setFieldValue('nombreUsuario', dbUsuario.nombreUsuario);
          setFieldValue('telefono', dbUsuario.telefono);
          setFieldValue('id', dbUsuario.id);

        } 
      })
    }else {
      setFieldValue(name, newValue);
    }
  }

  //FIN VALIDACIÓN SI EL USUARIO EXISTE


  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <MaterialTable
          title={state.title}
          columns={state.columns}
          isLoading={loading}
          data={state.data}
          options={{
            exportButton: true,
            emptyRowsWhenPaging: true,
            exportAllData: true,
          }}
          components={{
            EditRow: MuiTableEditRow,
            EditField: FormikMTInput
          }}

          editable={{
            onRowAdd: newData =>
              new Promise(async (resolve, reject) => {

                if (newData.id != 0) {

                  update(firebase, dispatch, newData);
                  resolve();
                } else {
                  let id = save(firebase, sesion, newData);
                  if (id) {
                    resolve(id);
                  } else {
                    reject("Error al guardar el socio en la base de datos");
                  }
                }

                /* buscarSocioIdentificacion(firebase, newData.identificacion).then(dbDatos => {
 
                   if (dbDatos.arrayFilas.length <= 0) {
                     //inicio grabar
                     let id = save(firebase, sesion, newData);
                     if (id) {
                       resolve(id);
                     } else {
                       reject("Error al guardar el socio en la base de datos");
                     }
                     //fin grabar
                   } else {
                     reject("Ya existe un socio con la misma identificación");
                   }
                 })*/
              })
                .then(idbd => {
                  //Actualizamos la lista con los datos guardados
                  newData.id = idbd;
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                  //Mostramos mensaje de guardado con éxito
                  openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: ("Socio guardado con éxito"),
                    severity: "success"
                  });
                }
                ).catch(error => {
                  //mostramos mensaje de error
                  console.log(error);
                  openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: error,
                    severity: "error"
                  });
                }
                ),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                buscarSocioIdentificacion2(firebase, newData.identificacion, newData.id).then(dbDatos => {

                  // si no existe entonces actualizar
                  if (dbDatos.arrayFilas.length <= 0) {
                    update(firebase, dispatch, newData);
                    setTimeout(() => {
                      if (oldData) {
                        setState(prevState => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                      resolve();
                    }, 600);
                  } else {
                    openMensajePantalla(dispatch, {
                      open: true,
                      mensaje: "Ya existe un socio con la misma identificación",
                      severity: "error"
                    });
                    resolve();
                  }
                })

              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteLogico(firebase, dispatch, oldData);
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              }),

          }}
          localization={localization}
        >

        </MaterialTable>
      </Container>
    </React.Fragment>
  );
}

export default consumerFirebase(Usuarios);

//https://material-table.com/#/docs/features/localization