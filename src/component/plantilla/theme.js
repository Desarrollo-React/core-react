import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
   
    palette: {
        primary: {
          //  light: '#42a5f5',
             main: '#2196f3',
          // main: '#fff',
            dark: '#1565c0',
           // dark: '#fff',
            contrastText: '#ECFAD8',
           // contrastText: '#fff',
        },
         secondary:{
           main : green[500],
        },
       
    },

    spacing: 10

});

export default theme;
