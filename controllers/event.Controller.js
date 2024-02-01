const  eventModel= require('../models/event.Model');
const Joi = require('joi');
var fs = require('fs');
var path = require('path');
var mongoose = require("mongoose")

module.exports = {
    addEvent,
    getEventsByClientId
    // getBrands,
    // getBrandById,
    // updateBrand,
    // changeBrandStatus,
    // getCategorieById
    // deleteBrandById,
    // changeServiceStatus
    // changePassword
}



function validateChangeStatus(service) {
    const JoiSchema = Joi.object({
        _id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        isActive: Joi.boolean()
        .required(),
    });
  
    return JoiSchema.validate(service)
  }

/////Validation Starts

function validateAddEvent(event) {
    const JoiSchema = Joi.object({
        clientId: Joi.string()
        .min(2)
        .max(30)
        .messages({'string.pattern.base': `Client ID Is Required.`})
        .required(),
        eventName: Joi.string()
        .min(2)
        .max(1100)
        .messages({'string.pattern.base': `Event Name Is Required.`})
        .required(),
        eventDate: Joi.string()
        .messages({'string.pattern.base': `Event Date Is Required.`})
        .required(), 
        eventTime: Joi.string()
        .messages({'string.pattern.base': `Event Time Is Required.`})
        .required(), 
        eventImageUrl: Joi.string()
        .messages({'string.pattern.base': `Event Image Is Required.`}),
        eventAddress: Joi.string()
        .messages({'string.pattern.base': `Event Address Is Required.`}),
        eventLocation: Joi.string()
        .messages({'string.pattern.base': `Event Location Is Required.`})
        });
    return JoiSchema.validate(event)
  }

  
  
function validateUpdateBrand(service) {
    const JoiSchema = Joi.object({
        categorieId: Joi.string()
        .min(2)
        .max(30)
        .required(),
        _id: Joi.string()
        .min(2)
        .max(30)
        .required(),
        brandName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        brandLongDescription: Joi.string()
        .min(2)
        .max(150000)
        .required(), 
        brandShortDescription: Joi.string()
        .min(2)
        .max(5000)
        .required(), 
        brandImageUrl: Joi.string()
        .min(2)
        .max(1500000)
        .required(),
        // coverImageUrl: Joi.string()
        // .min(2)
        // .max(1500000)
        // .required(),
        // advertiseImageUrl: Joi.array()
        // .min(2)
        // .max(1500000)
        // .required(),
        });

    return JoiSchema.validate(service)
  }


  function BrandStatus(service) {
    const JoiSchema = Joi.object({
        id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        isActive: Joi.boolean()
        .required(),
        });
      
    return JoiSchema.validate(service)
  }
  
////Validation Ends


/////////Add Staff
async function addEvent(req, res) {
    const response = validateAddEvent(req.body);
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    var dataObj = new eventModel(req.body);
    console.log(dataObj);
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
                message: "Event Details Save sucessfully",
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


//Update Service By Id
// async function updateServiceById(req, res) {
//     var data =  JSON.parse(req.body.data)
//     if(data.oldImagePath)
//     {
//       fs.unlink(path.join(`uploads/images/services/${data.oldImagePath.split('/')[1]}`),function(err,data)
//       {
//        if(err)
//        console.log(err);
//        else
//         console.log(data);
//       })    
//      data.serviceImageUrl  =  req.files?.serviceImageUrl[0].filename  ? `service_image/${req.files.serviceImageUrl[0].filename}` : '';
//     }
//     delete data.oldImagePath;
//     const response = validateUpdateService(data);
//    if (response.error) {
//        res.status(400).send({
//          code: 400,
//          message: "Invalid data",
//          error: response.error.details[0].message,
//          type: "error"
//        });
//      } else {
//    var dataObj = new serviceModel(data);
//    console.log(dataObj);
// //    dataObj.save(function (err, docs) {
//     serviceModel.updateOne({ _id: data._id }, { $set: data }, function (err, docs) {    
//        if (err) {
//            if (err.message.toString().includes("duplicate")) {
//                res.status(400).send({ 
//                    code: 400,
//                    message:  `${Object.keys(err.keyPattern)[0]} Already Exists`,
//                    error: err,
//                    type: "error"
//                 })
//            } else {
//                res.status(400).send({ 
//                    code: 400,
//                    message:  `Update Failed Please Try Again`,
//                    error: err,
//                    type: "error"
//                 })
//            }

//        } else if (docs != null) {
//            res.status(200).send({
//                code: 200,
//                message: "service is Updated sucessfully",
//                type: "success"
//              });
//        } else {
//            res.status(400).send({ 
//                code: 400,
//                message:  `update Failed Please Try Again`,
//                type: "error"
//             })
//        }
//    })
//   }
// }


/////////Get All Staff

async function getBrands(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    brandsModel.find(query).sort({orderNo : "asc"}).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Brand Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Brand Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Brand Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Get  service By Id


async function getBrandById(req, res) {
    var query = { _id: req.params.id };
    brandsModel.findById(query).exec(function (err, docs) {
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
                message: "service Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "service Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}


async function getEventsByClientId(req, res) {
    var query;
    // if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    // query = {categorieId: req.params.catId };
    // else
    query = {$and : [{isActive : true},{ clientId: req.params.id }]};
    console.log(query);
    eventModel.find(query).exec(function (err, docs) {
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
                message: "Events Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Events Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Delete  service By Id
// function deleteServiceById(req, res) {
//     serviceModel.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
//         //console.log("docs", docs);
//         if (err) {
//             res.status(400).send({
//                 code: 400,
//                 message: "Service Delete Getting Error",
//                 type: "error",
//                 error: err
//               });
//         } else if (docs != null) {
//             res.status(200).send({
//                 code: 200,
//                 message: "Service Deleted sucessfully",
//                 type: "success",
//               });
//         } else {
//             res.status(400).send({
//                 code: 400,
//                 message: "Service Delete  Fail Please Try Again",
//                 type: "error",
//               });
//         }
//     })
// }


function  updateBrand(req, res) {
    delete req.body.createdAt;
    delete req.body.updatedAt;

   var dataObj = req.body;
//    const response = validateUpdateBrand(dataObj)
//    if (response.error) {
//        res.status(400).send({
//          code: 400,
//          message: "Invalid data",
//          error: response.error.details[0].message,
//          type: "error"
//        });
//      } else {
   brandsModel.updateOne({ _id: req.body._id }, { $set: dataObj }, function (err, docs) {
       if (err) {
           res.status(400).send({
               code: 400,
               message: "Brand Update Getting Error",
               type: "error",
               error: err
             });
       } else if (docs != null) {
           res.status(200).send({
               code: 200,
               message: "Brand Details Updated sucessfully",
               type: "success",
             });
       } else {
           res.status(400).send({
               code: 400,
               message: "Brand Details Updated Fail Please Try Again",
               type: "error",
             });
       }
   });
//   }
}


// async function deleteserviceById(req, res) {
//     var serviceData =    await serviceModel.findOne({_id: req.params.id});
//     console.log(serviceData);
//     // var filePath =   `uploads/images/services/${serviceData.serviceImageUrl}`;
//     console.log(path.join(`uploads/images/services/${serviceData.serviceImageUrl.split('/')[1]}`));
//     fs.unlink(path.join(`uploads/images/services/${serviceData.serviceImageUrl.split('/')[1]}`), function (err) {
//         if (err) {
//             res.status(400).send({
//                 code: 400,
//                 message: "service Delete Getting Error",
//                 type: "error",
//                 error: err
//               });
//         } 
//         else{
//         serviceModel.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
//             console.log("docs", docs);
//             if (err) {
//                 res.status(400).send({
//                     code: 400,
//                     message: "service Delete Getting Error",
//                     type: "error",
//                     error: err
//                   });
//             } else if (docs != null) {
//                 res.status(200).send({
//                     code: 200,
//                     message: "service Deleted sucessfully",
//                     type: "success",
//                   });
//             } else {
//                 res.status(400).send({
//                     code: 400,
//                     message: "service Delete  Fail Please Try Again",
//                     type: "error",
//                   });
//             }
//         })
//        }
//     });
  
// }

///////Update  Staff By Id

function  changeBrandStatus(req, res) {
    var dataObj = req.body;
    const response = BrandStatus(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
        brandsModel.updateOne({ _id: req.body.id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Brand Status Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Brand Status Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Brand Status Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
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
//             //     "service_name" : decoded.userName,
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

