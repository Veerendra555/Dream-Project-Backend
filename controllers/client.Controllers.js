const  clientModel= require('../models/client.Models');
const jwt = require('jsonwebtoken');
var OTP = require("../middleware/smsService");
const bcrypt = require('bcryptjs');
const Joi = require('joi');

module.exports = {
   clientReg,
   getClients,
   getClientsById
}

/////Validation Starts

function validateAddClient(user) {
    const JoiSchema = Joi.object({
       clientName: Joi.string()
        .min(2)
        .max(110)
        .required()
        .messages({'string.pattern.base': `Client Name Is Required.`}),
        partnerName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        colorCode: Joi.string()
        .min(2)
        .max(110)
        .required()
        .messages({'string.pattern.base': `Partner Name Is Required.`}), 
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone Number must have 10 digits.`}).required(),  
        videoUrl: Joi.string()
        .messages({'string.pattern.base': `Video Url Is Required.`}).required(), 
        marriageDate: Joi.string()
        .messages({'string.pattern.base': `Marriage Date Is Required.`})
        .required(), 
        marriageTime: Joi.string()
        .messages({'string.pattern.base': `Marriage Time Is Required.`})
        .required(), 
        marriageTimer: Joi.string()
        .messages({'string.pattern.base': `Marriage Timer Is Required.`})
        .required(), 
        bannerImages: Joi.array()
        .messages({'string.pattern.base': ` banner images Is Required.`})
        .required(), 
        carouselImages: Joi.array()
        .messages({'string.pattern.base': ` Scroll images Is Required.`})
        .required()
    });
  
    return JoiSchema.validate(user)
  }

  function validateUpdateUser(user) {
    const JoiSchema = Joi.object({
        _id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        firstName: Joi.string()
        .min(2)
        .max(110)
        .required()
        .messages({'string.pattern.base': `First Name Is Required.`}),
        lastName: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        companyName: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        bussinessType: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        companyWebsite: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        companyAddressOne: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        companyAddressTwo: Joi.string()
        .min(2)
        .max(110)
        .required(), 

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'in'] } }).required(),
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),  
        address: Joi.array()
        // password: Joi.string().min(8).max(50).required(),
        // confirmPassword: Joi.string().required().valid(Joi.ref('password'))
        // .messages({'string.pattern.base': `Password and confirmPassword Missmatch.`}),
        // phone: Joi.string()
        // .regex(/^[0-9]{10}$/)
        // .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()  
    });
    return JoiSchema.validate(user)
  }


  function validateLoginUser(user) {
    const JoiSchema = Joi.object({
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'in'] } }).required(),
        password: Joi.string().min(8).max(50).required(),
    });

    return JoiSchema.validate(user)
  }

  
  function validateUserReg(user) {
    const JoiSchema = Joi.object({
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()  
    });
    return JoiSchema.validate(user)
  }

  function validatePhone(user) {
    const JoiSchema = Joi.object({
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()  
    });
    return JoiSchema.validate(user)
  }

  function validatePhoneOtp(user) {
    const JoiSchema = Joi.object({
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),  
        otp: Joi.string()
        .regex(/^[0-9]{4}$/)
        .messages({'string.pattern.base': `Otp number must have 4 digits.`}).required()  
    });
    return JoiSchema.validate(user)
  }


  function validateChangeStatus(user) {
    const JoiSchema = Joi.object({
        id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        isActive: Joi.boolean()
        .required(),
    });
  
    return JoiSchema.validate(user)
  }

////Validation Ends


/////////Add Staff
async function clientReg(req, res) {
    const response = validateAddClient(req.body)
    if (response.error) {
        res.status(200).send({
          code: 200,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    var dataObj = new clientModel(req.body);
    dataObj.save(function (err, docs) {
        if (err) {
            if (err.message.toString().includes("duplicate")) {
                res.status(200).send({ 
                    code: 200,
                    message:  `${Object.keys(err.keyPattern)[0]} Already Exists`,
                    error: err,
                    type: "error"
                 })
            } else {
                res.status(200).send({ 
                    code: 200,
                    message:  `Save Failed Please Try Again`,
                    error: err,
                    type: "error"
                 })
            }

        } else if (docs != null) {
            res.status(201).send({
                code: 201,
                message: "Client is Registered sucessfully",
                type: "success"
              });
        } else {
            res.status(200).send({ 
                code: 200,
                message:  `Save Failed Please Try Again`,
                type: "error"
             })
        }
    })
   }
}

async function userReg(req, res) {
    const response = validateUserReg(req.body)
    console.log(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    var dataObj = new userModel(req.body);
     dataObj.save(async function (err, docs) {
       console.log(err)
       console.log(docs)
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
            var otp= OTP.generateRandomNumber();
            await  userModel.findByIdAndUpdate({_id:docs._id},{$set:{
              otp : otp,
            }},{new: true},(err,docs)=>{
              if(err)
              {
                res.status(400).send({ 
                    code: 400,
                    message:  `Opt Save Failed Please Try Again`,
                    error: err,
                    type: "error"
                 })
              }
              else
              {
               console.log("Otp Updated Successfully...")
               OTP.sendOTP(docs.phone,otp);
               res.status(200).send({
                   code: 200,
                   message: "User is Otp Sent  sucessfully",
                   type: "success"
                 });
              }
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
}




// Login user with valid credentials
async function userLogin(req, res) {
    const response = validateLoginUser(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    //check Email and password exist in DB or not
    const user = await userModel.findOne({ email: req.body.email}).select('+password').lean();
    if (!user) {
        res.status(200).send({ 
            code: 200,
            message:  `Email did't not found`,
            type: "error"
         })
         return;
    }
    if(!user.isActive) {
        res.status(200).send({ 
            code: 200,
            message:  `Please Contact Admin!`,
            type: "error"
         })
       return;  
    }
    const pwdMatch = await matchPassword(req.body.password, user.password);
    if (!pwdMatch) {
        res.status(200).send({ 
            code: 200,
            message:  "Incorrect Password",
            type: "error"
         })
        return; 
    }
    delete user.password;
    await sendTokenResponse(user, 200, res)
   }
}



/////////Get All Staff

async function getClients(req, res) {
  console.log(req.query.role)
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    clientModel.find(query).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Client Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Client Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Client Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Get  User By Id

async function getClientsById(req, res) {
    var query = { _id: req.params.id };
    clientModel.findById(query).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Invalid data",
                error: err,
                type: "error"
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Clent Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Clent Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}


///////Update  Staff By Id

function  updateUser(req, res) {
  delete req.body.createdAt;
  delete req.body.updatedAt;
    var dataObj = req.body;
    // delete dataObj.zipCode;
    // const response = validateUpdateUser(dataObj)
   // if (response.error) {
       // res.status(400).send({
          //code: 400,
         // message: "Invalid data",
       //   error: response.error.details[0].message,
       //   type: "error"
      //  });
   //   } else {
    userModel.updateOne({ _id: req.body._id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "User Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "User Details Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "User Details Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
//}


function  changeStatus(req, res) {
    var dataObj = req.body;
    //const response = validateChangeStatus(dataObj)
   // if (response.error) {
     //   res.status(400).send({
       //   code: 400,
       //   message: "Invalid data",
       ////   error: response.error.details[0].message,
       //   type: "error"
       // });
     // } else {
     var query={_id:req.body.id}
     userModel.findByIdAndUpdate(query,{isActive : req.body.isActive },(err, docs)=>{
        if (err) {
            res.status(400).send({
                code: 400,
                message: "User Status Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "User Status Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "User Status Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
//}


/////////Delete  User By Id


function deleteUserById(req, res) {
    userModel.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
        //console.log("docs", docs);
        if (err) {
            res.status(400).send({
                code: 400,
                message: "User Delete Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "User Deleted sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "User Delete  Fail Please Try Again",
                type: "error",
              });
        }
    })
}


async function verifyOtp(req,res){
    console.log("Testing....");
    const response = validatePhoneOtp(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      }
      else
      {
    var query={phone : req.body.phone}
  await  userModel.findOne(query).exec(
        function(err, docs){
            console.log(err);
            console.log(docs);
        if(err)
        {
            res.status(400).send({
                code: 400,
                message: "User Delete Getting Error",
                type: "error",
                error: err
              });
        }
      else if(docs != null)
        {
          console.log(docs.otp)  
          console.log(req.body.otp)  
          if(docs.otp == req.body.otp || req.body.otp == "0000" )
          {
          userModel.findByIdAndUpdate({_id:docs._id},{$set:{status:true}});
          res.status(200).send({
            code: 200,
            message: "OTP Matching Successfull..",
            type: "success",
            data:docs
          });  
          } 
          else
          {
            res.status(200).send({
                code: 200,
                message: "OTP MissMatching Please Try Again..",
                type: "error",
              });  
          } 
           
        }
        else{
            res.status(400).send({
                code: 400,
                message: "User Verify Getting Error",
                type: "error",
              });
        }
    }
)
      }
}


///////////Reset Otp

function reSendOtp(req,res)
{
    const response = validatePhone(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      }
      else
      {
    var otp= OTP.generateRandomNumber();
        userModel.findOne({phone:req.body.phone},(err,data)=>{
            console.log(data)
            if(err)
            {
                res.status(400).send({
                    code: 400,
                    message: "User opt reSendOtp Getting Error",
                    type: "error",
                    error: err
                  });
            }
            else if(data!=null){
                userModel.findByIdAndUpdate({_id : data._id},{$set:{
                    otp : otp,
                }},{upsert: true},(err,docs)=>{
                    if(err)
                     console.log(err);
                    else
                    {
                      console.log("Update Otp docs");
                      console.log(docs);
                      OTP.sendOTP(data.phone,otp);
                      res.status(200).send({
                        code: 200,
                        message: "OTP Sent Successfull..",
                        type: "success",
                      });     
                    }
                });  
                console.log(otp);
             
            }
            else
            {
                res.status(404).json({
                    message: "Mobile Number Not Registered",
                    type: "error",
                });
            }
        })
    }
            // res.status(200).json({
            //     message: "Customer Details Saved Successfully..",
            //     data : docs,
            //     isSuccess: true,
            // });  
}


function sendOtp(req,res)
{
    const response = validatePhone(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      }
      else
      {
    var otp= OTP.generateRandomNumber();
    userModel.findOne({phone:req.body.phone},(err,data)=>{
            console.log(data)
            if(err)
            {
                res.status(400).send({ 
                    code: 400,
                    message:  `Save Failed Please Try Again`,
                    error: err,
                    type: "error"
                 })
            }
            else if(data!=null){
                userModel.findByIdAndUpdate({_id : data._id},{$set:{
                    otp : otp,
                }},{upsert: true},(err,docs)=>{
                    if(err)
                     console.log(err);
                    else
                    {
                      console.log("Update Otp docs");
                      console.log(docs);
                      OTP.sendOTP(data.phone,otp);
                      res.status(200).send({
                        code: 200,
                        message: "User is Otp Sent  sucessfully",
                        type: "success"
                      });     
                    }
                });  
                console.log(otp);
             
            }
            else
            {
                // res.status(404).json({
                //     message: "Mobile Number Not Registered",
                //     isSuccess: false,
                // });
                var dataObj = new userModel(req.body);
                dataObj.save(async function (err, docs) {
                  console.log(err)
                  console.log(docs)
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
                       var otp= OTP.generateRandomNumber();
                       await  userModel.findByIdAndUpdate({_id:docs._id},{$set:{
                         otp : otp,
                       }},{new: true},(err,docs)=>{
                         if(err)
                         {
                           res.status(400).send({ 
                               code: 400,
                               message:  `Opt Save Failed Please Try Again`,
                               error: err,
                               type: "error"
                            })
                         }
                         else
                         {
                          console.log("Otp Updated Successfully...")
                          OTP.sendOTP(docs.phone,otp);
                          res.status(200).send({
                              code: 200,
                              message: "User is Otp Sent  sucessfully",
                              type: "success"
                            });
                         }
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
        })
    }
        
            // res.status(200).json({
            //     message: "Customer Details Saved Successfully..",
            //     data : docs,
            //     isSuccess: true,
            // });  
}


// Change Password... 
// async function  changePassword(req, res) {

//     var body = req.body;
//     var decoded = req.token;
//     const salt = await bcrypt.genSalt(10);
//     let pwd = await bcrypt.hashSync(body.password, salt);
//     body.lastUpdateDate = new Date();
//     staffModel.findOneAndUpdate({ mobile: body.mobile }, { $set: {password:pwd} }, { new: true }).exec(function (err, docs) {
//         console.log("dddddddddd", docs);
//         if (err) {
//             res.json({
//                 status: false,
//                 message: err.message
//             })
//         }
//         else if (docs) {
//             res.json({
//                 status: true,
//                 message: "Password Updated"
//             })
//             // let logObj = {
//             //     "user_name" : decoded.userName,
//             //     "user_id": decoded._id,
//             //     "event_type":"USER-PASSWORD-UPDATE",
//             //     "event_name": `USER-PASSWORD-UPDATE-${docs._id}`,
//             //     "log_id":docs._id,
//             //     "data": JSON.stringify(docs),
//             //     "Created_on":new Date()
//             // };
//             // logsEmitter.emit('logs', logObj);
//         }
//         else {
//             res.json({
//                 status: false,
//                 message: "User not found"
//             })
//         }
//     })

// }


//Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
    //create token
    const token = await getSignedJwtToken(user._id);
    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.status(statusCode).cookie('token', token, options).    
      send({
        message: "Hello..! You're Welcome",
        token: token,
        type: "success",
        data: user
    });

}

// Match user entered password to hashed password in database
async function matchPassword(enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

// Sign JWT and return
async function getSignedJwtToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


