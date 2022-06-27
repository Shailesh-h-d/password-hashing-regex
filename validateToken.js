const jwt = require('jsonwebtoken');

let validateToken = (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer', '').trim();
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verified, req.body.email);      
        
        if(req.body.email) {
            if(verified == req.body.email) {
                next();
            } else {
                return res.send("NOT AUTHORIZED TO ACCESS THIS RPOFILE");
            }
        } else {
            if(verified === req.params.email) {
                next();
            } else {
                return res.send("NOT AUTHORIZED TO ACCESS THIS PROFILE");
            }
        }
    } catch (err) {
        return res.send("INVALID TOKEN");
    }
}

module.exports = validateToken;