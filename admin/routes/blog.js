const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const bcrypt = require('bcryptjs');
router.get('/', forwardAuthenticated, (req, res) => res.render('blog'));




module.exports = router;