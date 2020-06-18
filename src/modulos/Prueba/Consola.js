import React from "react";
import {consumerFirebase} from '../../server';



function Consola(props) {
    return (
        <h1>prueba</h1>
    );
}

export default consumerFirebase(Consola);