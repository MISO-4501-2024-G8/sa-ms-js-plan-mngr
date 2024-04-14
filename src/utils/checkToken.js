
const jwt = require('jsonwebtoken');
const secret = 'MISO-4501-2024-G8';

const checkToken = async (req, res) => {
    try {
        const auth = req.headers['authorization'];
        if (!auth) {
            return 'No se ha enviado el token de autenticación';
        }
        const token = auth.split(' ')[1];
        const payLoad = jwt.verify(token, secret)
        if (Date.now() > payLoad.exp) {
            return 'El token ha expirado';
        }
        const url = 'https://g7o4mxf762.execute-api.us-east-1.amazonaws.com/prod/login/validate_token';
        const myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        const rslt = await fetch(url, requestOptions);
        const result = await rslt.json();
        if (result.code !== 200) {
            return 'El token no es válido';
        }
        if (result.userType && result.userType !== 3) {
            return 'El usuario no tiene permisos para realizar esta acción';
        }
        return '';
    } catch (error) {
        return 'El token no es válido';
    }
}
module.exports = {
    checkToken
};