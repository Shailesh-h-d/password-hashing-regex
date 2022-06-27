//Password Verification in Node.js

const bcrypt = require("bcryptjs");
const md5 = require("md5");

const password = "shailesh";

let Salt;

bcrypt.genSalt(10, (err, salt) => {
    Salt = salt; 
    console.log(Salt);
    s();
})

var s = () => {bcrypt.hash(md5(password), Salt, (err, hashedPassword) => {
    if(err) {
        return err;
    }
    console.log("hash = " + hashedPassword); 
    bcrypt.compare(md5(password), "$2a$10$jRmdSb9SXsvlAgWVifXp.eF.hFXLvK9.tTXzuFIlhvUVijEgKWVI2", (err, isMatch) => { //hash string or hash.
        if(err) {
            return err;
        } 
        console.log(isMatch);
    })
})};  