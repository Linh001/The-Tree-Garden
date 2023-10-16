
const { mutiMongooseToObject, mongooseToObject, fuseSearchToPlainObject } = require('../../ulti/mongoose');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json()); // Cho JSON requests
app.use(express.urlencoded({ extended: true })); // Cho x-www-form-urlencoded requests
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const Fuse = require('fuse.js');
const Book = require('../models/book');

const PurchaseHistory = require('../models/historyPurchase');
const HireHistory = require('../models/historyHire');



class bookController {
  show(req, res, next) {
    Book.findOne({ slug: req.params.slug })
      .then((book) => {
        res.json(book);
        // res.render('news/show', { book: mongooseToObject(book) });
      })

  }


  create(req, res, next) {
    res.render('news/create')
  }


  store(req, res, next) {
    console.log(req.body);

    const book = new Book(req.body);
    book.save()
      .then(() => {
        console.log("Thành công");
        // res.render('news/store', { book: mongooseToObject(book) });
        res.json(book);
      })
      .catch(err => {
        // Xử lý lỗi ở đây
      });

  }


  async showAll(req, res, next) {
    try {
      let page = req.query.page;
      let size = 1;

      if (!page) {
        page = 1;
      }

      const limit = parseInt(1);
      const skip = (page - 1) * limit;

      const book = await Book.find()
        .sort({ votes: 1, _id: 1 })
        .skip(skip)
        .limit(limit);

      res.send({
        page,
        size,
        Info: book,
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }


  edit(req, res, next) {
    Book.findById(req.params.id)
      .then(book => res.render('news/edit', { book: mongooseToObject(book) }))
      .catch(next)

  }


  update(req, res, next) {
    Book.updateOne({ id: req.param.id }, req.body)
      .then(console.log(req.body))
      .then(() => res.redirect('/news/all'))
      .catch(next);
  }


  delete(req, res, next) {
    Book.deleteOne({ id: req.param.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }


  search(req, res, next) {
    Book.find({}).then(books => {
      const options = {
        keys: ['name', 'mota', 'slug'],
        threshold: 0.3
      };

      const fuse = new Fuse(books, options);
      console.log(req.body.search)
      const book = fuse.search(req.body.search);
      console.log(book);
      res.render('news/all', { book: fuseSearchToPlainObject(book) });

    });

  }


  value(req, res, next) {
    Book.find({ gia: { $gt: 10, $lt: 25 } })
      .then(book => res.json(book))
      .catch(next)
  }

  //thực hiện thuê 1 cuốn sách(thuê chỉ áp dụng 1 lần 1 cuốn sách)
  hireBook(res, req) {

    Book.findOne({ slug: req.params.slug })
      .then((book) => {
        //thời gian thuê
        const currentTime = new Date(); // Lấy thời gian hiện tại
        //thời gian tính theo ngày
        const duration = numberOfDays * 24 * 60 * 60 * 1000; // Giả sử là 30 phút (30 phút * 60 giây * 1000 milliseconds)
        const endTime = new Date(currentTime.getTime() + duration); // Tính thời gian kết thúc bằng cách cộng thời gian hiện tại và khoảng thời gian

        //Tiền
        const numberOfDays = 5; // Số ngày
        const unitPrice = book.price; // Đơn giá
        const totalPrice = numberOfDays * unitPrice; // Tính tổng tiền



        //lưu thông tin vào db
        const hireHistory = new HistoryHire({
          userId: userId,
          items: book,
          expirationTimestamp: endTime,
          totalPrice: totalPrice,
        });

        hireHistory
          .save()
          .then(() => {
            res.send('Thuê thành công và lịch sử thuê đã được lưu trữ');
          })
          .catch((err) => {
            console.error('Lỗi:', err);
            res.status(500).send('Đã xảy ra lỗi');
          });
      })



  }
  //lấy lịch sử mua
  getHistoryPurchase(req, res) {
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

module.exports = new bookController();
