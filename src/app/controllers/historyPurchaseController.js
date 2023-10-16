const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const Cart = require('../models/cart');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

class HistoryPurchaseController {


  //lấy lịch sử mua
  getBookHistoryPurchase(req, res) {
    const userId = req.params.userId;

    PurchaseHistory.find({ userId: userId })
      .then((purchaseHistories) => {
        res.json(purchaseHistories);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }
  //lấy lịch sử mua
  getBookHistoryPurchase(req, res) {
    const userId = req.params.userId;

    PurchaseHistory.find({ userId: userId })
      .then((purchaseHistories) => {
        res.json(purchaseHistories);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  //lấy lịch sử mua tất cả khách
  getAllHistoryPurchase(req, res) {
    PurchaseHistory.find({})
      .then((purchaseHistories) => {
        res.json(purchaseHistories);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }

  //lấy lịch sử thuê
  getHireHistory(req, res) {
    const userId = req.params.userId;

    HireHistory.find({ userId: userId })
      .then((hireHistory) => {
        res.json(hireHistory);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        res.status(500).send('Đã xảy ra lỗi');
      });
  }
}

module.exports = new HistoryPurchaseController();