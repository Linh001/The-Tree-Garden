const cartController = require('../app/controllers/cartController');
const {  authenticateTokenAdmin, authenticateTokenUser } = require('../middleware/JWTAction');
function cartRoute(app) {

    app.get('/cart/:id',authenticateTokenUser ,cartController.cartfindAll);

    app.post('/cart/add-book/:id',authenticateTokenUser,cartController. cartAddBook);
    app.post('/cart/add-plant', authenticateTokenUser,cartController. cartAddPlant);

    app.delete("/cart/delete/:slug",authenticateTokenUser,cartController.cartDelete); 
    app.delete("/cart/delete",authenticateTokenUser,cartController.cartDeleteAll);
    app.delete("/cart/find/book",authenticateTokenUser,cartController.cartfindBook);
    app.delete("/cart/find/plant",authenticateTokenUser,cartController.cartfindPlant);
    app.post('/cart/checkout',authenticateTokenUser,cartController.checkOut);
  
}

module.exports = cartRoute;