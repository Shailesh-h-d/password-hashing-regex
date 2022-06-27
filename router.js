const express=require('express');
const jwt = require('jsonwebtoken');
const bcrypt_js = require('bcryptjs');
const md5 = require('md5');
const dotenv = require('dotenv');

const router = express.Router();
router.use(express.json());
dotenv.config();

// IMPORT FROM PASSWORDHASH FOLDER
const db = require('./database.js');
const validateToken = require('./validateToken.js');
const verifyPassword = require('./verifyPassword.js');
const checkPassword = require('./checkPassword.js');

// create();
function create(req, res) {
    // var sql = 'CREATE TABLE bcrypt (id INT AUTO_INCREMENT, name VARCHAR(255), phone VARCHAR(13) UNIQUE, email VARCHAR(255) UNIQUE, password VARCHAR(255), PRIMARY KEY(id))';
    // db.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log('TABLE CREATED');
    // });

    // var sql = 'CREATE TABLE hashstore (email VARCHAR(255) UNIQUE, hash VARCHAR(255))';
    // db.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log('TABLE CREATED');
    // });
}

// CREATE NEW PROFILE
router.post('/sign-up', verifyPassword, (req, res, next) => {

    let count = 0;
    for(let key in Object.keys(req.body)) {
        count++;
    }
    if(count < 5) {
        return res.send("ENTER ALL DETAILS");
    }
    let sql = `INSERT INTO bcrypt (name, phone, email, password) VALUES (?, ?, ?, ?)`;
    var {name, phone, email, password} = req.body;
    // shaileshhd.com@gmail.com

    var regexname = /^(?=.*[^\W])[\w]{3,20}$/;
    if(!regexname.test(name)) return res.send("length should be minimum of 3 and maximum of 20 characters and should not contain any special character/s");
    var regexphone = /^[\d]{10}$/;
    if(!regexphone.test(phone)) return res.send("phone number should be of 10 digits");
    var regexemail = /^([\w\-\.]+)@[\w]+\.(\w{2,3})$/;
    if(!regexemail.test(email)) return res.send("enter valid email");
    var regexpassword = /^(?=.*[\d]+)(?=.*[\W]+)(?=.*[A-Z]+)(?=.*[a-z]+)[\S]{8,18}$/;
    if(!regexpassword.test(password)) return res.send("password should be minimum of 8 characters with atleast one number, special character(except white space), uppercase and lowercase letters");

    let salt = bcrypt_js.genSaltSync(10);
    let hashed = bcrypt_js.hashSync(password, salt);
    db.query(sql, [name, phone, email, hashed], (err, result) => {
        if (err) return res.send(err);
        else return res.send(req.body);
    });
}); 

// GET ALL PROFILES
router.get('/profiles', (req, res) => {
    let sql = `SELECT * FROM bcrypt ORDER BY id`;
    try {
        db.query(sql, (err, result) => {
            if(err) throw err;
            return res.send(result);
        })
    } catch (err) {
        return res.send(err);
    }
});

//SHOW USER PROFILE INFO
router.get('/profiles/:email', validateToken, (req, res) => {
    let email = req.params.email;
    let sql = `SELECT id, name, email, phone FROM bcrypt WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if(err) res.send(err);
            return res.send(result);
        });
    } catch(err) {
        return res.send(err);
    }
});

// LOGIN AND GENERATE TOKEN USING EXISTING PROFILE CREDENTIALS
router.post('/login', checkPassword, (req, res) => {
    let token = jwt.sign(req.body.email, process.env.SECRET_KEY);
    return res.status(200).send("logged in successfully. token is: " + token);
})

// UPDATE USING EXISTING PROFILE CREDENTIALS
router.patch('/update', validateToken, (req, res) => {
    let email = req.body.email; 
    for(let [key, value] of Object.entries(req.body)) {
        if(key != 'email' && key != 'id') {
            let sql =`UPDATE bcrypt SET ${key} = '${value}' WHERE email = '${email}'`;
            if(key === 'password') {
                let salt = bcrypt_js.genSaltSync(10);
                let hashed = bcrypt_js.hashSync(value, salt);
                sql = `UPDATE bcrypt SET ${key} = '${hashed}' WHERE email = '${email}'`;
            }
            db.query(sql, (err, result) => {
                if(err) throw err;
            });
        }
    }
    return res.send(req.body);
});

module.exports = router;