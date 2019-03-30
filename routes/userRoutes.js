const express  = require('express'),
      User     = require('../models/UserModel'),
      Helper   = require('../helpers/Helper'),
      router   = express.Router();

const createError = require('../helpers/ErrorHelper').createError;

// Middlewares
const Middlewares = require('../middlewares/Middlewares');

router.get('/token', Middlewares.verification.verifyToken);
router.get('/admin', [
  Middlewares.verification.verifyToken,
  Middlewares.verification.verifyAdmin
])
router.use('/login', Middlewares.verification.verifyPassword);
router.use('/register', [
  Middlewares.validation.validateUsernameInput,
  Middlewares.validation.validateEmailInput,
  Middlewares.validation.validatePasswordInput,
  Middlewares.validation.validateUserNotExist,
  Middlewares.limit.createAccountLimiter,
])
router.use('/change-password', [
  Middlewares.verification.verifyToken,
  Middlewares.verification.verifyPassword,
  Middlewares.validation.validatePasswordInput,
])

// Routes

router.get('/token', (req, res, next) => {
  const { _id } = res.locals.decoded;
  User.findById(_id)
  .then(user => {
    user ? res.status(200).send({ user }) : next(createError("", 404, "user-not-found"))
  })
  .catch(err => next(Helper.error.serverError(err)))
})

router.get('/admin', (req, res, next) => {
  res.sendStatus(200);
})

router.post('/login', (req, res, next) => {
  const { user } = res.locals;
  Helper.token.generateUserToken(user)
  .then(token => res.send({ token, user }))
  .catch(err => next(Helper.error.serverError(err))); 
})

router.post('/register', (req, res, next) => {
  const { username, email, password } = req.body;
  Helper.user.generateHash(password)
  .then(hash => {
    User.create({ username, email, password: hash })
    .then(user => {
      Helper.token.generateUserToken(user)
      .then(token => {
        res.status(200).send({ token, user })
      }).catch(err => next(Helper.error.serverError(err)))
    }).catch(err => next(Helper.error.serverError(err)))
  }).catch(err => next(Helper.error.serverError(err)))
})

router.post('/change-password', (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = res.locals;
  if(oldPassword === newPassword){
    next(createError("", 400, "same-password"))
  } else {
    Helper.user.generateHash(newPassword)
    .then(hash => {
      User.findByIdAndUpdate(user._id, {$set: { password: hash }}, {new: true})
      .then(updatedUser => res.status(200).send({ user: updatedUser }))
      .catch(err => next(Helper.error.serverError(err)))
    })
    .catch(err => next(Helper.error.serverError(err)))
  }
})

module.exports = router;