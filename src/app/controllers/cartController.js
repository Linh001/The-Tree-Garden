const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const Cart = require('../models/cart');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

class cartController {

  cartAddBook(req, res, next) {
    const { itemId, quantity } = req.body;

    //kiểm tra có tồn tại trong giỏ hàng chưa
    CartModel.findOneAndUpdate(
      { 'items.itemId': itemId },
      { $set: { 'items.$.quantity': quantity } }
    )
      .then(() => {
        res.send('Số lượng mặt hàng đã được cập nhật');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });


    //chưa thì tạo mới
    const cartItem = {
      type: 'book',
      itemId: itemId,
      quantity: quantity
    };

    CartModel.findOneAndUpdate({}, { $push: { items: cartItem } }, { upsert: true })
      .then(() => {
        res.send('Sách đã được thêm vào giỏ hàng');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  cartAddPlant(req, res, next) {
    const { itemId, quantity } = req.body;

    const cartItem = {
      type: 'plant',
      itemId: itemId,
      quantity: quantity
    };

    Cart.findOneAndUpdate({}, { $push: { items: cartItem } }, { upsert: true })
      .then(() => {
        res.send('Cây đã được thêm vào giỏ hàng');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  cartfindAll(req, res, next) {
    Cart.findOne({})
      .then((cart) => {
        res.json(cart.items);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });


  }
  //tìm sách trong giỏ hàng
  cartfindBook(req, res) {
    Cart.findOne({ type: book })
      .then((cart) => {
        res.json(cart.items);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  //tìm cây trong giỏ hàng
  cartfindPlant(req, res) {
    Cart.findOne({ type: plant })
      .then((cart) => {
        res.json(cart.items);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }


  //xóa 1 phần tử nào đó trong giỏ hàng
  cartDelete(req, res) {
    const itemId = req.params.itemId;

    CartModel.findOneAndUpdate({}, { $pull: { items: { itemId: itemId } } })
      .then(() => {
        res.send('Mặt hàng đã được xóa khỏi giỏ hàng');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  cartDeleteAll(req, res) {
    CartModel.findOneAndUpdate({}, { $set: { items: [] } })
      .then(() => {
        res.send('Giỏ hàng đã được xóa');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  checkOut(req, res) {
    const { userId, items, totalPrice } = req.body;

    // Thực hiện quá trình thanh toán ở đây
  

    

    // Sau khi thanh toán thành công, lưu lịch sử mua hàng và xóa giỏ hàng
    const purchaseHistory = new PurchaseHistoryModel({
      userId: userId,
      items: items,
      totalPrice: totalPrice,
    });

    purchaseHistory
      .save()
      .then(() => {
        // Xóa giỏ hàng
        return CartModel.findOneAndUpdate({}, { $set: { items: [] } });
      })
      .then(() => {
        res.send('Thanh toán thành công và lịch sử mua hàng đã được lưu trữ');
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }
  getHistoryPurchase(req, res) {
    const userId = req.params.userId;

    PurchaseHistoryModel.find({ userId: userId })
      .then((purchaseHistories) => {
        res.json(purchaseHistories);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

}

module.exports = new cartController();