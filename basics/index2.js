//Password encryption in Node.js using bcryptjs module.

const bcrypt = require('bcryptjs');

const password = "shailesh";
var hashedPassword;

bcrypt.genSalt(1, function(err, Salt) {
    console.log("Salt = " + Salt); //---------------------------------------
    bcrypt.hash(password, Salt, (err, hash) => {
        if(err) {
            return console.log("can't encrypt");
        }
        hashedPassword = hash;
        console.log("hash = "+hash); //-------------------------------------

        bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
            console.log(isMatch);
            if(isMatch) {
                console.log('Encrypted password is : ', password); 
                console.log('Hashed password is : ', hashedPassword);
            } else if(!isMatch) {
                console.log(hashedPassword + ' is not encryption of ' + password);
            }
        })
    })
})
