const express  = require('express'),
      User     = require('../models/UserModel'),
      Helper   = require('../helpers/Helper'),
      router   = express.Router();

const { createError, serverError } = require('../helpers/ErrorHelper')
const Middlewares = require('../middlewares/Middlewares');

router.get('/token', Middlewares.verifyToken, (req, res, next) => {
  const { _id } = res.locals.decoded;
  User.findById(_id)
  .then(user => {
    user ? res.status(200).send({ user }) : next(createError("", 404, "user-not-found"))
  })
  .catch(err => next(serverError(err)))
})

router.get('/admin', Middlewares.verifyAdmin, (req, res, next) => {
  res.sendStatus(200);
})

router.post('/login', Middlewares.login, (req, res, next) => {
  const { user } = res.locals;
  Helper.token.generateUserToken(user)
  .then(token => res.send({ token, user }))
  .catch(err => next(serverError(err))); 
})

router.post('/register', Middlewares.registration, (req, res, next) => {
  const { username, email, password } = req.body;
  Helper.user.generateHash(password).then(hash => {
    User.create({ username, email, password: hash }).then(user => {
      Helper.token.generateUserToken(user).then(token => {
        res.status(200).send({ token, user })
      }).catch(err => next(serverError(err)))
    }).catch(err => next(serverError(err)))
  }).catch(err => next(serverError(err)))
})

router.post('/change-password', Middlewares.passwordChange, (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = res.locals;
  if(oldPassword === newPassword){
    next(createError("", 400, "same-password"))
  } else {
    Helper.user.generateHash(newPassword)
    .then(hash => {
      User.findByIdAndUpdate(user._id, {$set: { password: hash }}, {new: true}, (err, updatedUser) => {
        if(err) next(serverError(err))
        res.status(200).send({ user: updatedUser })
      })
    }).catch(err => next(serverError(err)))
  }
})

module.exports = router;