const router                                                        = require('express').Router()
const { createItem, getAllItem, readItem, updateItem, deleteItem, updateStock  } = require('../controllers/item.controller')
const { loginAuthentication, loginAuthorization }                   = require('../middlewares/auth')
const { multer, sendUploadToGCS }                                   = require('../helpers/image')

router.post('/add', loginAuthentication, loginAuthorization, multer.single('image'), sendUploadToGCS, createItem)
      .get('/seller', loginAuthentication, loginAuthorization, readItem)
      .get('/', getAllItem)
      .put('/update/:id', loginAuthentication, updateItem)
      .put('/updatestock/:id', loginAuthentication, updateStock)
      .delete('/delete/:id', loginAuthentication, loginAuthorization, deleteItem)

module.exports = router