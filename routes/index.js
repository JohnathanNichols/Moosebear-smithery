const express = require ('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Article = require('../models/article');
const User = require('../models/user');

//verified 8/24
router.get('/articles', function(req, res) {
  Article.find(function(err, articles) {
    res.json(articles);
  });
});

//Unused?
// router.get('/articles/:id', function(req, res) {
//   Article.findById(req.params.id, function(err, article) {
//     if (!article) {
//       res.status(404).send('No result found');
//     } else {
//       res.json(article);
//     }
//   });
// });

//verified 8/23
router.post('/articles', function(req, res) {
  let article = new Article(req.body);
  article.save()
    .then(article => {
      res.send(article);
    })
    .catch(function(err) {
      res.status(422).send('Article add failed');
    });
});

//Verified 8/24
//Possible error where booleans are incorrectly set to true :: attempted fix = remove default from models.article.js
router.patch('/articles/:id', function(req, res) {
  Article.findByIdAndUpdate(req.params.id, req.body)
    .then(function() {
      res.json('Article updated');
    })
    .catch(function(err) {
      res.status(422).send("Article update failed.");
    });
});

//Verified 8/24
router.delete('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (!article) {
      res.status(404).send('Article not found');
    } else {
      Article.findByIdAndRemove(req.params.id)
        .then(function() { res.status(200).json("Article deleted") })
        .catch(function(err) {
          res.status(400).send("Article delete failed.");
        })
    }
  });
});

//Validated 8/22
router.post('/login', function(req, res) {
  User.findOne({$and:[{email:req.body.email},{username:req.body.username}]}, function(err,doc) {
    if(err){
      res.status(422).send('User not found');
    }
    if(doc){
      bcrypt.compare(req.body.password, doc.password).then(function(result){
        if(result === true){
          res.send(doc);
        }else{
          res.status(422).send('User not found');
        }
      });
    }else{
      res.status(422).send('User not found');
    }
  });
});

//Validated 8/22
router.post('/register', function(req, res) {
  const username = req.body.username;
  const email = req.body.email;

  bcrypt.hash(req.body.password, 10, function(err, hash){
    User.findOne({$or:[{email:email},{username:username}]}, async (err,doc) =>{
      if(err){
        res.status(422).send('User add failed');
      }
      if(doc){
        res.status(422).send('User add failed');
      }else{
        const newUser = new User({
          email:email,
          username:username,
          password:hash
        });
        newUser.save()
          .then(newUser => {
            res.send(newUser);
          })
          .catch(function(err) {
            res.status(422).send('User add failed');
          });
      }
    });
  });
});

//Verified 8/24
router.patch('/users/:id', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(function() {
      res.json('User updated');
    })
    .catch(function(err) {
      res.status(422).send("User update failed.");
    });
});

//Verified 8/24
router.post('/sendEmail', function(req, res) {
  async function sendMail(){
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user:process.env.OUTLOOK_EMAIL, // generated ethereal user
        pass:process.env.OUTLOOK_PASS, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: `"Moosebears Smithery" <${process.env.OUTLOOK_EMAIL}>`, // sender address
      to: process.env.RECIPIENT_EMAIL, // list of receivers
      subject: "Moosebear's Smithery Customer Message", // Subject line
      text: req.body.message, // plain text body
    });

    // console.log("Message sent: %s", info.messageId);
  }
  sendMail();
  res.send("Received");
});

//Verified 8/24
router.get('/verifyAdmin', function(req, res) {
  bcrypt.compare(req.query.adminCode, process.env.ADMIN_CODE_HASH).then(function(result){
    res.send(result)
  });
});

module.exports = router;
