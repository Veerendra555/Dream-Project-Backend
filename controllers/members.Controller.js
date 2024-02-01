const  memberModel= require('../models/member.Model');
const  userModel= require('../models/users.Models');
// const  serviceRequestModel= require('../models/serviceRequest.Model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

module.exports = {
    addMember,
    getMembers,
    getMembersCount,
    getMemberById,
    updateMember,
    deleteMemberById,
    changeStatus,
    memberLogin,
    // changePassword
}

/////Validation Starts

function validateAddMember(member) {
    const JoiSchema = Joi.object({
       firstName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        lastName: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        role: Joi.string()
        .min(1)
        .max(110)
        .required(), 
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'in'] } }).required(),
        password: Joi.string().min(8).max(50).required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password'))
        .messages({'string.pattern.base': `Password and confirmPassword Missmatch.`}),
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()  
    });
  
    return JoiSchema.validate(member)
  }

  function validateUpdateMember(member) {
    const JoiSchema = Joi.object({
        _id: Joi.string()
        .min(20)
        .max(40)
        .required(),
       firstName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        lastName: Joi.string()
        .min(2)
        .max(110)
        .required(), 
        role: Joi.string()
        .min(1)
        .max(110)
        .required(), 
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'in'] } }).required(),
        // password: Joi.string().min(8).max(50).required(),
        // confirmPassword: Joi.string().required().valid(Joi.ref('password'))
        // .messages({'string.pattern.base': `Password and confirmPassword Missmatch.`}),
        phone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
    });
  
    return JoiSchema.validate(member)
  }


  

  function validateChangeStatus(member) {
    const JoiSchema = Joi.object({
        _id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        isActive: Joi.boolean()
        .required(),
    });
  
    return JoiSchema.validate(member)
  }


  function validateLoginMember(member) {
    const JoiSchema = Joi.object({
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'in'] } }).required(),
        password: Joi.string().min(8).max(50).required(),
        // role:  Joi.string().min(2)
        // .max(110)
        // .required(),
    });
  
    return JoiSchema.validate(member)
  }

////Validation Ends


/////////Add Staff
async function addMember(req, res) {
    const salt = await bcrypt.genSalt(10);
     req.body.phone = req.body && req.body.phone.toString();
    const response = validateAddMember(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
    var dataObj = new memberModel(req.body);
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
                message: "Member is Registered sucessfully",
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
}




// Login member with valid credentials
async function memberLogin(req, res) {
    const response = validateLoginMember(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    //check Email and password exist in DB or not
    const member = await memberModel.findOne({ email: req.body.email},{password:1,role:1}).lean();
    const pwdMatch = member && await matchPassword(req.body.password, member.password);
    if (!member) {
        res.status(200).send({ 
            code: 200,
            message:  `Email did't not found`,
            type: "error"
         })
    }
    else if(member.isActive) {
        res.status(200).send({ 
            code: 200,
            message:  `member is inactive!`,
            type: "error"
         })
    }
    // else if(member.role != req.body.role) {
    //     res.status(200).send({ 
    //         code: 200,
    //         message:  `member role missmatch!`,
    //         type: "error"
    //      })
    // }
    else if (!pwdMatch) {
        res.status(200).send({ 
            code: 200,
            message:  "Incorrect Password",
            type: "error"
         })
    }
    else
    {
        delete member.password;
        await sendTokenResponse(member, 200, res)
    }
   
   }
}



/////////Get All Staff

async function getMembers(req, res) {
    var query ={role:req.query.role};
    // if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    // query = {};
    // else
    // query = {isActive : true};
    memberModel.find(query).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "member Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "member Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "member Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


async function getMembersCount(req, res) {
    var data={}
    data.adminCount = await memberModel.countDocuments({role:"Admin"});
    data.managerCount = await memberModel.countDocuments({role:"Manager"});
    data.employeeCount = await memberModel.countDocuments({role:"Employee"});
    data.userCount = await userModel.countDocuments();
    // data.pendingCount = await serviceRequestModel.countDocuments({status:"Pending"});
    // data.completedCount = await serviceRequestModel.countDocuments({status:"Completed"});
    if(data != null)
    {
            res.status(200).send({
                code: 200,
                message: "Dashboard Details Getting sucessfully",
                type: "success",
                data: data
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Dashboard Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
}



/////////Get  member By Id

async function getMemberById(req, res) {
    var query = { _id: req.params.id };
    memberModel.findById(query).exec(function (err, docs) {
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
                message: "member Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "member Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


///////Update  Staff By Id

function  updateMember(req, res) {
     delete req.body.createdAt;
     delete req.body.updatedAt;

    var dataObj = req.body;
    const response = validateUpdateMember(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    memberModel.updateOne({ _id: req.body._id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "member Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "member Details Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "member Details Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
}




function  changeStatus(req, res) {
    var dataObj = req.body;
    const response = validateChangeStatus(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
     var query={_id:req.body._id}
    memberModel.findByIdAndUpdate(query,{isActive : req.body.isActive },(err, docs)=>{
        if (err) {
            res.status(400).send({
                code: 400,
                message: "member Status Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "member Status Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "member Status Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
}


/////////Delete  Member By Id


function deleteMemberById(req, res) {
    memberModel.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
        //console.log("docs", docs);
        if (err) {
            res.status(400).send({
                code: 400,
                message: "member Delete Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "member Deleted sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "member Delete  Fail Please Try Again",
                type: "error",
              });
        }
    })
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
//             //     "member_name" : decoded.userName,
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
        code:200, 
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


