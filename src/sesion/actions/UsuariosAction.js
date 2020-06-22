import Constantes from '../../constantes/Sistema';

export const obtenerData = (firebase, idEmpresa) => {
    console.log('idEmpresaidEmpresaidEmpresa',idEmpresa);
    return new Promise(async (resolve, eject) => {
        let socios = firebase.db
            .collection(Constantes.COLECCION_USUARIOS)
            .where("estadoBorrado", "==", Constantes.ESTADO_BORRADO.NO_BORRADO)
            .where("empresa", "array-contains", idEmpresa)
            .orderBy("nombreUsuario");

        const snapshot = await socios.get();

        const arrayFilas = snapshot.docs.map(doc => {
            let data = doc.data();
            data.id = doc.id;
            return { ...data }
        })

        resolve({ arrayFilas });
    })

}

export const buscarSocio = (firebase, idSocio) => {
    return new Promise(async (resolve) => {
        let socioDb = firebase.db.collection(Constantes.COLECCION_PRINCIPAL).doc(firebase.auth.currentUser.uid)
            .collection(Constantes.COLECCION_USUARIOS).doc(idSocio);
        const doc = await socioDb.get();

        let data = doc.data();
        let id = doc.id;
        let socio = { id, ...data };

        resolve(socio);
    })
}

export const buscarSocioIdentificacion = (firebase, identificacion) => {

    return new Promise(async (resolve) => {
        let socios = firebase.db
            .collection(Constantes.COLECCION_USUARIOS)
            .where("identificacion", "==", identificacion);
        const snapshot = await socios.get();
        const arrayFilas = snapshot.docs.map(doc => {
            let data = doc.data();
            data.id = doc.id;
            return { ...data }
        })
        resolve({ arrayFilas });
    });
}

export const buscarSocioIdentificacion2 = (firebase, identificacion, id) => {

    return new Promise(async (resolve) => {
        let socios = firebase.db
            .collection(Constantes.COLECCION_PRINCIPAL).doc(firebase.auth.currentUser.uid).collection(Constantes.COLECCION_USUARIOS)
            .where("identificacion", "==", identificacion)
            .where("id", ">", id)
            .where("id", "<", id);

        const snapshot = await socios.get();

        const arrayFilas = snapshot.docs.map(doc => {
            let data = doc.data();
            data.id = doc.id;
            return { ...data }
        })

        resolve({ arrayFilas });
    });
}