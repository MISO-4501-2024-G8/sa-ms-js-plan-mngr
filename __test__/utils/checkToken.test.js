const { checkToken } = require('../../src/utils/checkToken');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../../src/utils/encrypt_decrypt');

const secret = 'MISO-4501-2024-G8';
const expirationTime = 30 * 60 * 1000; // 30 minutes

global.fetch = jest.fn(() => ({
    json: async () => ({ code: 200, userType: 3 }) // Simulamos una respuesta exitosa
}));

describe('checkToken', () => {

    const expiration_token = Date.now() + expirationTime;
    const token = jwt.sign({
        email: 'aaa@example.com',
        encryptPWD: encrypt('123456', secret),
        exp: expiration_token
    }, secret);

    const mockReq = {
        headers: {
            authorization: 'Bearer ' + token
        }
    };

    it('should return an error message if the user does not have the necessary permissions', async () => {
        const expiration_token = Date.now() + expirationTime;
        console.log('expiration_token', expiration_token);
        const tokenNew = jwt.sign({
            email: 'aaa@example.com',
            encryptPWD: encrypt('123456', secret),
            exp: expiration_token
        }, secret);
        console.log('tokenNew', tokenNew);
        fetch.mockImplementationOnce(() => ({
            json: async () => ({ code: 200, userType: 1 }) // Simulamos una respuesta con userType diferente de 3
        }));
        mockReq.headers['authorization'] = 'Bearer ' + tokenNew;
        const result = await checkToken(mockReq, {});
        expect(result).toBe('El usuario no tiene permisos para realizar esta acción');
    });

    it('should return an error message if no authorization token is provided', async () => {
        const mockReqNoToken = {
            headers: {}
        };
        const result = await checkToken(mockReqNoToken, {});
        expect(result).toBe('No se ha enviado el token de autenticación');
    });

    it('should return an error message if the token is expired', async () => {
        const expiration_token = Date.now() - 1000;
        const tokenExpired = jwt.sign({
            email: 'aaa@example.com',
            encryptPWD: encrypt('123456', secret),
            exp: expiration_token
        }, secret);
        mockReq.headers['authorization'] = 'Bearer ' + tokenExpired;
        const result = await checkToken(mockReq, {});
        expect(result).toBe('El token ha expirado');
    });

    it('should return an error message if the token is invalid', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        });
        const result = await checkToken(mockReq, {});
        expect(result).toBe('El token no es válido');
    });

    it('should return an error message if the token is not valid', async () => {
        fetch.mockImplementationOnce(() => ({
            json: async () => ({ code: 400 }) // Simulamos una respuesta con error
        }));
        const result = await checkToken(mockReq, {});
        expect(result).toBe('El token no es válido');
    });
    

    
});
