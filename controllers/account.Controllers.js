const  accountModel= require('../models/account.Model');
// const Joi = require('joi');

module.exports = {
    addAccountDetails,
    getAccountDetails
}

function validateHealth(user) {
    const JoiSchema = Joi.object({
    healthDescription: Joi.string()
        .min(0)
        .max(10000)
        .required() 
    });
  
    return JoiSchema.validate(user)
  }


async function addAccountDetails(req, res) {
    //  const response = validateAccount(req.body)
    //  if (response.error) {
    //      res.status(400).send({
    //        code: 400,
    //        message: "Invalid data",
    //        error: response.error.details[0].message,
    //        type: "error"
    //      });
    //    } else {
     var dataObj = new accountModel(req.body);
     console.log(req.body)
     if(!!req.body._id)
     {
        accountModel.updateOne({ _id: req.body._id }, { $set: dataObj}, function (err, docs) {
            if (err) {
                res.status(400).send({
                    code: 400,
                    message: "Account Update Getting Error",
                    type: "error",
                    error: err
                  });
            } else if (docs != null) {
                res.status(200).send({
                    code: 200,
                    message: "Account Details Updated sucessfully",
                    type: "success",
                  });
            } else {
                res.status(400).send({
                    code: 400,
                    message: "Account Details Updated Fail Please Try Again",
                    type: "error",
                  });
            }
        });

     }
     else
     {
     dataObj.save(function (err, docs) {
         if (err) {
             if (err.message.toString().includes("duplicate")) {
                 res.status(400).send({ 
                     code: 400,
                     message:  `${Object.keys(err.keyPattern)[0]} Already Exists`,
                     error: err,
                     type: "error"
                  })
             } else {
                 res.status(400).send({ 
                     code: 400,
                     message:  `Save Failed Please Try Again`,
                     error: err,
                     type: "error"
                  })
             }
 
         } else if (docs != null) {
             res.status(201).send({
                 code: 201,
                 message: "Account Details is Save sucessfully",
                 type: "success"
               });
         } else {
             res.status(400).send({ 
                 code: 400,
                 message:  `Save Failed Please Try Again`,
                 type: "error"
              })
         }
     })
    }
    // }
 }



 
 async function getAccountDetails(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    accountModel.findOne(query).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Account Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Account Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Account Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}
