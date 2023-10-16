const plantController = require('../app/controllers/plantController');
const { checkJWT } = require('../middleware/JWTAction');
function plantRoute(app) {
    
    app.get('/plant/create',checkJWT, plantController.create);
    app.post('/plant/store', plantController.store);
    app.get("/plant/:slug", plantController.show);
    app.get("/plant/:id/edit",plantController.edit);
    app.put("/plant/:id",plantController.update);
    app.get("/plant/:id/delete",plantController.delete);
    app.post('/plant/search', plantController.search);
    app.get("/plant/all/loc",plantController.value);
    app.get('/plant', plantController.showAll);
}

module.exports = plantRoute;