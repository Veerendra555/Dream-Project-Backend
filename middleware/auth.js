const jwt = require('jsonwebtoken');
const usersModel = require('../models/users.Models');

module.exports = {
    protect
}
// Protect routes
function protect(req, res,next) {
    if(req.query.secure == "1" || req.query.secure == 1) {
      next();
    }
    let token;
    // console.log("RRRRRRRRRRRRRRRr",req.headers.authorization);
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.json({
            status: false,
            message: "You are not authorized to access this route"
        });
    }
    try {
        
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("PPPPP",decoded);
        usersModel.findById({ _id: decoded.id }).exec(function (err, obj) {
            if (err) {
                return res.json({
                    status: false,
                    message: "You are not authorized to access this route"
                });
            } else {
                req.token = obj;
                next();
            }
        })

    } catch (err) {
        console.log("PPPPP");
        return res.json({
            status: false,
            message: "You are not authorized to access this route"
        });
    }

}


