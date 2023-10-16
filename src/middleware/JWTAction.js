var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { Account } = require('../app/models/account');

const JWT_Sercet = 'MinhHuu123';
// const createJWT = () => {
//     let payload = ;
//     let key = JWT_Sercet;
//     var token = jwt.sign(payload, key, { expiresIn: '15m' } );
//     console.log(token);
//     return token;
// }


const verifyToken = (token) => {
  let key = JWT_Sercet;
  let data = null;

  try {
    let decoded = jwt.verify(token, key);

    data = decoded;
  } catch (error) {
    console.log(error);
  }

  return data;

}

const checkJWT = (req, res, next) => {
  let cookies = req.cookies;
  if (cookies && cookies.jwt) {

    let decoded = verifyToken(cookies.jwt);
    if (decoded) {
      console.log('check jwt', decoded);
      next();
    } else {
      res.send('token khong hop le:');
    }
    console.log('my jwt:', cookies.jwt)
  }

}

const checkPermission = (req, res, next) => {
  if (req.user) {
    let email = req.accounts.email;
    let currentPath = req.path;
    if (email != '121@1') {
      res.send('khong co quyen truy cap');
    }

    // }else{

  }



}
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_Sercet,
    { expiresIn: '15m' } // Thời gian hết hạn của Access Token: 15 phút
  );
}
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    'your-refresh-token-secret-key'
  );
}

// const authenticateToken = async (req, res, next) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//         return res.sendStatus(401);
//     }

//     try {
//         const user = await Account.findOne({ refreshToken });

//         if (!user) {
//             return res.sendStatus(403);
//         }

//         // Kiểm tra và cấp lại access token nếu cần thiết

//         // Gán thông tin người dùng vào request để sử dụng trong các route khác
//         req.user = user;
//         next();
//     } catch (error) {
//         console.log('Error authenticating token:', error);
//         res.sendStatus(500);
//     }
// };


//kiem tra quyen admin
const authenticateTokenAdmin = (req, res, next) => {
  try {
    // Lấy Access Token từ header hoặc query parameter
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'Access Token không tồn tại!' });
    }

    // Xác thực và giải mã Access Token
    jwt.verify(token, JWT_Sercet, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Access Token không hợp lệ!' });
      }

      // Lưu thông tin người dùng vào request để sử dụng sau này
      req.user = decoded;

      // Kiểm tra phân quyền
      // Ví dụ: Kiểm tra xem người dùng có quyền 'admin' để truy cập vào route '/admin'
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      // Nếu Access Token hợp lệ và phân quyền thành công, tiếp tục thực hiện middleware tiếp theo hoặc controller
      next();
    });
  } catch (error) {
    console.error('Lỗi xác thực và phân quyền:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi!' });
  }
};


//kiem tra quyen user
const authenticateTokenUser = (req, res, next) => {
  try {
    // Lấy Access Token từ header hoặc query parameter
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'Access Token không tồn tại!' });
    }

    // Xác thực và giải mã Access Token
    jwt.verify(token, 'secret-key', (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Access Token không hợp lệ!' });
      }

      // Lưu thông tin người dùng vào request để sử dụng sau này
      req.user = decoded;

      // Kiểm tra phân quyền
      // Ví dụ: Kiểm tra xem người dùng có quyền 'admin' để truy cập vào route '/admin'
      if ( req.user.role !== 'user') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      // Nếu Access Token hợp lệ và phân quyền thành công, tiếp tục thực hiện middleware tiếp theo hoặc controller
      next();
    });
  } catch (error) {
    console.error('Lỗi xác thực và phân quyền:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi!' });
  }
};

function refreshToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (refreshToken == null) {
    return res.status(401).json({ message: 'Refresh Token không hợp lệ' });
  }

  jwt.verify(refreshToken, 'your-refresh-token-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh Token không hợp lệ' });
    }

    const accessToken = generateAccessToken(user);
    req.accessToken = accessToken;
    next();
  });
}
module.exports = {
  generateAccessToken,
  verifyToken,
  checkJWT,
  generateRefreshToken,
  authenticateTokenUser,
  authenticateTokenAdmin,
  refreshToken
}