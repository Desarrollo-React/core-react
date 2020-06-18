import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import config from './config';

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.db = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();
        this.authorization = app.auth;
        this.storage.ref().constructor.prototype.guardarDocumentos = function (documentos) {
            var ref = this;
            return Promise.all(documentos.map(function (file) {
                return ref.child(file.alias).put(file).then(snapshot => {
                    return ref.child(file.alias).getDownloadURL();
                })
            }))
        }

    }

    estaIniciado() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        }) 
    }

    guardarDocumento = (nombreDocumento,carpeta, documento) => this.storage.ref(carpeta).child(nombreDocumento).put(documento);

    devolverDocumento = (documentoUrl,carpeta) => this.storage.ref(carpeta).child(documentoUrl).getDownloadURL();

    guardarDocumentos = (documentos,carpeta) => this.storage.ref(carpeta).guardarDocumentos(documentos);

    eliminarDocumento = (documento,carpeta) => this.storage.ref(carpeta).child(documento).delete();

    cambiarClave= (email) => this.auth.sendPasswordResetEmail(email);
    
}

export default Firebase;