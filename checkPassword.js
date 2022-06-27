const db = require('./database.js');
const bcrypt_js = require('bcryptjs');
const md5 = require('md5');

let pass = (req, res, next) => {
    let {email, password} = req.body;
    let sql = `SELECT * FROM bcrypt WHERE email = '${email}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        else {
            if(result.length === 0) {
                return res.send("Email not registered");
            } else {
                let hash = result[0].password;
                bcrypt_js.compare(password, hash, (err, isMatch) => {
                    if(err) throw err;
                    else {
                        if(isMatch) {
                            next();
                        } else {
                            return res.send('incorrect password');
                        }
                    }
                })
            }
        }
    })
}
module.exports = pass;