import axios from 'axios';

export const enviarCorreoElectronico = (email) => {
    return new Promise( async(resolve,eject) => {

        const dataResponse = await axios.post('https://us-central1-home-b0086.cloudfunctions.net/correoEnviar', email);

        resolve(dataResponse);

    } )

}



