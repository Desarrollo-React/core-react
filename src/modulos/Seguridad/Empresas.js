import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../../sesion/store';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.primary.main,
        }
    }

}));


function Login(props) {

    const classes = useStyles();
    const [{ sesion }, dispatch] = useStateValue();
    const firebase = props.firebase;
    const [open, setOpen] = React.useState(false);


    return (
        <React.Fragment>
            <div>
                EMPRESAS
            </div>
        </React.Fragment>
    );
}

export default compose(consumerFirebase)(Login);