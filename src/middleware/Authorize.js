// Chỉ dành cho admin
function authAdmin(req, res, next) {
    if(req.user.role !== 'admin') {
      return res.status(403).send('Admin only!'); 
    }
    next();
  }
  
  // Chỉ dành cho user
  function authUser(req, res, next) {
    if(req.user.role !== 'user') {
      return res.status(403).send('User only!');
    }
    next();
  }

  module.exports = {
    authAdmin,
    authUser,
    
}