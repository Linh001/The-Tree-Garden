

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json()); // Cho JSON requests
app.use(express.urlencoded({ extended: true })); // Cho x-www-form-urlencoded requests
const mongoose = require('mongoose');
const Account = require('../models/account');
mongoose.Promise = global.Promise;
const JWTAction=require('../../middleware/JWTAction');

const bcrypt = require('bcrypt');
const { createJWT } = require('../../middleware/JWTAction');
const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

var cookieParser = require('cookie-parser')
app.use(cookieParser())



// mail
const nodemailer = require('nodemailer');


// Tạo một transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
    },
});

// Định nghĩa hàm gửi email
async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: 'your_email@gmail.com',
            to,
            subject,
            text,
        });
        console.log('Email đã được gửi thành công.');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
    }
}
class authController {


    login(req, res, next) {
        res.render('auth/login')
    }

    signup(req, res, next) {
        res.render('auth/signup')
    }



    async checkLogin(req, res, next) {
        try {
            const { username, password } = req.body;

            // Tìm người dùng trong cơ sở dữ liệu
            const user = await Account.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Tài khoản không tồn tại' });
            }

            // So sánh mật khẩu
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Mật khẩu không đúng' });
            }

            // Tạo JSON Web Token
            const accessToken = JWTAction.generateAccessToken(user);
            const refreshToken = JWTAction.generateRefreshToken(user);
            //lưu token vào cookies
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 5 *60 * 1000 
            });
            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đăng nhập thất bại' });
        }
    }


    async checkSignUp(req, res, next) {

        try {
            const { username ,password, role } = req.body;

            // Kiểm tra xem người dùng đã tồn tại chưa
            const existingUser = await Account.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'Tài khoản đã tồn tại' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const account = new Account({
                username,
                password: hashedPassword,
                role,
            });

            // Lưu vào cơ sở dữ liệu
            await account.save();

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đăng ký thất bại' });
        }
    };



    async changePassword(req, res) {
        const { username, oldPassword, newPassword, email } = req.body;

        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        const user = await Account.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        // So sánh mật khẩu cũ với mật khẩu đã lưu trong cơ sở dữ liệu
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Mật khẩu cũ không đúng.' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu
        user.password = hashedPassword;
        await user.save();

        // Gửi email xác nhận đổi mật khẩu
        const emailSubject = 'Xác nhận đổi mật khẩu';
        const emailText = 'Mật khẩu của bạn đã được thay đổi thành công.';
        sendEmail(email, emailSubject, emailText);

        return res.json({ message: 'Mật khẩu đã được thay đổi thành công và email xác nhận đã được gửi.' });
    }

    async checkLogOut(req, res) {
        res.clearCookie('jwt');
        res.json({ message: 'Đăng xuất thành công.' });
    }


}

module.exports = new authController();
