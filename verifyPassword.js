let passwords = (req, res, next) => {
    return req.body.password != req.body.reEnterPassword ? res.send("Password doesn't match") : next();
};

module.exports = passwords;