const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {type: String},
 comments: []
});

const Book = mongoose.model('Book', bookSchema);
  
module.exports = {
 Book
}