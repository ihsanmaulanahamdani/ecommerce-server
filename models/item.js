const mongoose = require('mongoose')
const Schema   = mongoose.Schema

let itemSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  item: {
    type: String,
    required: [true, 'please write something item']
  },
  stock: Number,
  image: String,
  price: Number,
  status: String
}, {
  timestamps: true
})

let Item = mongoose.model('Item', itemSchema)

module.exports = Item