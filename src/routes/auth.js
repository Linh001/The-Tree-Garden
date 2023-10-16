const authController = require('../app/controllers/authController');
const { checkJWT } = require('../middleware/JWTAction');
function authRouter(app) {

    app.get('/auth/login', authController.login);
    app.post('/auth/log-in' ,authController.checkLogin);
    // app.get('/auth/new', authController.signup);
    app.get('/auth/changepassword', authController.changePassword);
    app.post('/auth/sign-up', authController.checkSignUp);
    app.get('/auth/log-out', authController.checkLogOut);
    
}

module.exports = authRouter;