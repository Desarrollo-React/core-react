export const initialState = {
  usuario : null,
  autenticado: false,
  opcionmenu:''
}

const sesionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu
      };
    case "CAMBIAR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu
      };
    case "SALIR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado,
        opcionmenu: action.opcionmenu
      };
      case "OPCION_MENU":
      return {
        ...state,
        opcionmenu: action.opcionmenu
      };
    default:
      return state;
  }
};

export default sesionReducer;