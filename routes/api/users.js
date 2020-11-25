const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ ssn: req.body.ssn }).then(user => {
    if (user) {
      return res.status(400).json({ ssn: "SSN already exists" });
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
      lastname: req.body.lastname,
      telnumber: req.body.telnumber,
      fulladdress: req.body.fulladdress,
      ssn: req.body.ssn
      });

      //Hash SSN before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.ssn, salt, (err, hash) => {
          if (err) throw err;
          newUser.ssn = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // const email = req.body.email;

  // const password = req.body.password;
const firstname = req.body.firstname;
const lastname = req.body.lastname;
const ssn = req.body.ssn;
  // Find user by email
  User.findOne({ firstname,lastname }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ firstnamenotfound: "Firstname not found" });
    }
    if (!user) {
      return res.status(404).json({ lastnamenotfound: "Lastname not found" });
    }
   
    //Check ssn
    bcrypt.compare(ssn, user.ssn).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,

        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ ssnincorrect: "SSN incorrect" });
      }
    });
  });
});

router.get("/list", (req, res) => {
  
  User.find({ }).then(user => {
    console.log('Data:',user);
    res.json(user);
  })
  .catch((error)=>{
    console.log('Error:',error)
  })
});
module.exports = router;
