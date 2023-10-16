const bookController = require('../app/controllers/bookController');

const {  authenticateTokenAdmin, authenticateTokenUser } = require('../middleware/JWTAction');
function bookRoute(app) {
    
    app.get('/book/create',authenticateTokenAdmin, bookController.create);
    app.post('/book/store',authenticateTokenAdmin, bookController.store);
    app.get("/book/:id",authenticateTokenAdmin,bookController.show);
    app.get("/book/:id/edit",authenticateTokenAdmin,bookController.edit);
    app.put("/book/:id",authenticateTokenAdmin,bookController.update);
    app.get("/book/:id/delete",authenticateTokenAdmin,bookController.delete);
    app.post('/book/search',authenticateTokenUser,authenticateTokenAdmin ,bookController.search);
    app.get("/book/all/loc",authenticateTokenUser,authenticateTokenAdmin,bookController.value);
    app.get('/book',authenticateTokenUser, authenticateTokenAdmin,bookController.showAll);

    //thuê
    app.get("/book/hire/:slug", bookController.hireBook);
    

    app.get("/book/hire/show/:slug", bookController.show);
  
}

module.exports = bookRoute;