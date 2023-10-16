
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
const Plant = require('../models/plant');

const PurchaseHistory = require('../models/historyPurchase');
const HireHistory = require('../models/historyHire');



class PlantController {
  show(req, res, next) {
    Plant.findOne({ slug: req.params.slug })
      .then((plant) => {
        // 
        res.json(plant)
      })

  }


  // create(req, res, next) {
  //   res.render('news/create')
  // }


  store(req, res, next) {
   

    const plant = new Plant(req.body);
    plant.save()
      .then(() => {
        console.log("Thành công");
        res.render('news/store', { plant: mongooseToObject(plant) });
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

      const plant = await Plant.find()
        .sort({ votes: 1, _id: 1 })
        .skip(skip)
        .limit(limit);

      res.send({
        page,
        size,
        Info: plant,
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }


  // edit(req, res, next) {
  //   Plant.findById(req.params.id)
  //     // .then(Plant => res.render('news/edit', { Plant: mongooseToObject(Plant) }))
  //     .then((plant)=>res.json(plant))
  //     .catch(next)

  // }


  update(req, res, next) {
    Plant.updateOne({ id: req.param.id }, req.body)
      .then(console.log(req.body))
      .then((plant) => res.json(plant))
      .catch(next);
  }


  delete(req, res, next) {
    Plant.deleteOne({ id: req.param.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }


  search(req, res, next) {
    Plant.find({}).then(plants => {
      const options = {
        keys: ['name', 'mota', 'slug'],
        threshold: 0.3
      };

      const fuse = new Fuse(plants, options);
 
      const plant = fuse.search(req.body.search);
      res.json(plant);
      // res.render('news/all', { Plant: fuseSearchToPlainObject(Plant) });

    });

  }


  value(req, res, next) {
    Plant.find({ gia: { $gt: 10, $lt: 25 } })
      .then(Plant => res.render('news/all', { Plant: mutiMongooseToObject(Plant) }))
      .catch(next)
  }

  
  //lấy lịch sử mua theo khách hàng
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

  //lấy lịch sử mua tất cả người dùng
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

  
}

module.exports = new PlantController();
