/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const {Book} = require('../models/models.js');


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     // lean() function converts Mongoose object (which is immutable) to plain JavaScript object which properties can be changed
      Book.find({}).lean().then(function(data) {
        const dataArray = [];
        for (let i = 0; i < data.length; i++) {
          data[i].commentcount = data[i].comments.length;
          delete data[i].comments;
          delete data[i].__v;
          dataArray.push(data[i]);
        }
        res.json(dataArray);
      });
    })
    
    .post(async function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title === "") {
        res.json(`missing title`);
      } else {
        const newBook = new Book({
          title: title,
          comments: []
        })
        await newBook.save();
        await Book.find({title: title}).then(function(data) { 
          res.json({
            _id: data[0]._id,
            title: data[0].title,
            comments: data[0].comments
          });
        });
      }
    })
    
    .delete(function(req, res){
    //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(data) {
         res.json(`complete delete successful`);
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
    var bookid = req.params.id;
    const regex = /[a-z0-9]{24}/;
      // id must be a string of letters and numbers with a length equal to 24 characters
      if (regex.test(bookid) === false) {
        res.json(`Wrong id format. Id must be a string consisting of 24 characters.`);
      } else {
         //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        Book.find({_id: bookid}).then(function(data) {
          // if book doesn't exist return 'no book exists'
          if (data.length === 0) {
             res.json(`no book exists`);
          } else {
              res.json({
            _id: data[0]._id,
            title: data[0].title,
            comments: data[0].comments
            });
          }
        });
      }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
       Book.find({_id: bookid}).then(function(data) {
        data[0].comments.push(comment);
        data[0].save();
      
        res.json({
          _id: data[0]._id,
          title: data[0].title,
          comments: data[0].comments
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid).then(function(data){
        res.json(`delete successful`);
      });
    });
  
};
