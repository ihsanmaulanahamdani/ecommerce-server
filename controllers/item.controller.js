const mongoose  = require('mongoose')
const secretKey = process.env.SECRETKEY_JWT
const jwt       = require('jsonwebtoken')
const User      = require('../models/user')
const Item      = require('../models/item')

module.exports = {
  createItem: (req, res) => {
    let { item, stock, image, price } = req.body

    let newItem = new Item({
      admin: req.headers.id,
      item,
      stock,
      image: req.file.cloudStoragePublicUrl,
      price,
      status: 'available'
    })

    newItem
      .save()
      .then(item => {
        User
          .findOneAndUpdate({
            _id: item.admin
          }, {
            $push: {
              list_items: item._id
            }
          })
          .then(result => {
            res
              .status(201)
              .json({
                message: 'create item success',
                item
              })
          })
      })
      .catch(err => {
        res
        .status(500)
        .json({
          message: 'something went wrong',
          err
        })
      })
  },
  getAllItem: (req, res) => {
    Item
      .find()
      .populate('admin')
      .exec()
      .then(items => {
        res
        .status(200)
        .json({
          message: 'read items success',
          items
        })
      })
      .catch(err => {
        res
        .status(500)
        .json({
          message: 'something went wrong',
          err
        })
      })
  },
  readItem: (req, res) => {
    Item
      .find({
        admin: req.headers.admin
      })
      .populate('admin')
      .exec()
      .then(items => {
        res
        .status(200)
        .json({
          message: 'read items success',
          items
        })
      })
      .catch(err => {
        res
        .status(500)
        .json({
          message: 'something went wrong',
          err
        })
      })
  },
  updateItem: (req, res) => {
    let { id } = req.params
    let { status } = req.body

    Item
      .findOneAndUpdate({
        _id: id
      }, {
        status
      })
      .then(itemUpdated => {
        res
          .status(200)
          .json({
            message: 'update item success',
            itemUpdated
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  updateStock: (req, res) => {
    let { id } = req.params
    let { stock } = req.body

    console.log(stock, 'ini stock')

    Item
      .findOneAndUpdate({
        _id: id
      }, {
        stock
      })
      .then(itemUpdated => {
        res
          .status(200)
          .json({
            message: 'update item success',
            itemUpdated
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  deleteItem: (req, res) => {
    let { id } = req.params
    console.log('masuk delete', id, req.headers.admin)

    User
      .findOne({
        _id: req.headers.admin
      })
      .then(admin => {
        let indexItem = admin.list_items.indexOf(id)

        admin.list_items.splice(indexItem, 1)

        User
          .update({
            _id: req.headers.user
          },
            admin
          )
          .then(userUpdated => {
            Item
              .findOneAndRemove({
                _id: id
              })
              .then(deletedItem => {
                res
                  .status(200)
                  .json({
                    message: 'delete item success',
                    deletedItem
                  })
              })
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  }
}