export const initialState = {
  usuario : null,
  autenticado: false,
  opcionmenu:'',
  idEmpresa:0
}

const sesionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu,
        idEmpresa: action.idEmpresa
      };
    case "CAMBIAR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu,
        idEmpresa: action.idEmpresa
      };
    case "SALIR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu,
        idEmpresa: action.idEmpresa
      };
     
    default:
      return state;
  }
};

export default sesionReducer;