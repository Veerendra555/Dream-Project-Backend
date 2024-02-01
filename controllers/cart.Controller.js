const  cartModel= require('../models/cart.Model');
const Joi = require('joi');
var fs = require('fs');
var path = require('path');
var mongoose = require("mongoose")

module.exports = {
    addCart,
    getCarts,
    // getCartById,
    updateCart,
    updateQuntity,
    changeCartStatus,
    getCartByUserId,
    getCartBySpecialStatus,
    deleteCartProductByUserId
    // deleteCartById,
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

function validateAddCart(Cart) {
    const JoiSchema = Joi.object({
        categorieId: Joi.string()
        .min(2)
        .max(30)
        .required(),
        CartName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        CartLongDescription: Joi.string()
        .min(2)
        .max(150000)
        .required(), 
        CartShortDescription: Joi.string()
        .min(2)
        .max(5000)
        .required(), 
        CartImageUrl: Joi.string()
        .min(2)
        .max(1500000)
        .required(),
        });
    return JoiSchema.validate(Cart)
  }

  
  
function validateUpdateCart(service) {
    const JoiSchema = Joi.object({
        categorieId: Joi.string()
        .min(2)
        .max(30)
        .required(),
        _id: Joi.string()
        .min(2)
        .max(30)
        .required(),
        CartName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        CartLongDescription: Joi.string()
        .min(2)
        .max(150000)
        .required(), 
        CartShortDescription: Joi.string()
        .min(2)
        .max(5000)
        .required(), 
        CartImageUrl: Joi.string()
        .min(2)
        .max(1500000)
        .required(),
        });
    return JoiSchema.validate(service)
  }


  function CartStatus(service) {
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
async function addCart(req, res) {
    // const response = validateAddCart(req.body);
    // if (response.error) {
    //     res.status(400).send({
    //       code: 400,
    //       message: "Invalid data",
    //       error: response.error.details[0].message,
    //       type: "error"
    //     });
    //   } else {
    var dataObj = new cartModel(req.body);
    console.log(dataObj);
 const exists = await cartModel.findOne({"product.product": req.body.product.product});
if (!exists) {
    userData =   await cartModel.findOne({"user": req.body.user});
     if(!userData)
     {
        console.log("If Block Working..")
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
                    message: "Product Add To Cart sucessfully",
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
     else
     {
        console.log("Else Block Working..") 
    console.log("Before",userData.product);
      console.log(req.body);
        userData.product.push({
            product : req.body.product.product,
            quantity : req.body.product.quantity,
            orderType : req.body.product.orderType,
            dateAndTime : req.body.product.dateAndTime
        });      
        console.log("Aefore",userData.product);
        cartModel.updateOne({"user": req.body.user}, { $set: userData }, function (err, docs) {
            if (err) {
                res.status(400).send({
                    code: 400,
                    message: "Product Added Getting Error",
                    type: "error",
                    error: err
                  });
            } else if (docs != null) {
                res.status(201).send({
                    code: 201,
                    message: "Product Added sucessfully",
                    type: "success",
                  });
            } else {
                res.status(400).send({
                    code: 400,
                    message: "Product Added  Fail Please Try Again",
                    type: "error",
                  });
            }
        });
    }
} 
else
{
    res.status(200).send({
        code: 200,
        message: "Product Already Exist In Cart",
        type: "fail"
      });
}

//    }
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

async function getCarts(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    cartModel.find(query).sort({orderNo : "asc"}).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Cart Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Cart Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Cart Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Get  service By Id


async function getCartById(req, res) {
    var query = { _id: req.params.id };
    cartModel.findById(query).exec(function (err, docs) {
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


async function getCartByUserId(req, res) {
    var query = {user: req.params.user_id };
    cartModel.findOne(query).populate("product.product").exec(function (err, docs) {
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
                message: "Carts Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Carts Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}




async function getCartBySpecialStatus(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {brandId: req.params.brandId };
    else
    query = {$and : [{isActive : true},{ poductType: req.params.specialStatus }]};
    console.log(query);
    cartModel.find(query).exec(function (err, docs) {
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
                message: "Carts Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Carts Details Getting sucessfully",
                type: "success",
                data: {}
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


function  updateCart(req, res) {
    delete req.body.createdAt;
    delete req.body.updatedAt;

   var dataObj = req.body;
//    const response = validateUpdateCart(dataObj)
//    if (response.error) {
//        res.status(400).send({
//          code: 400,
//          message: "Invalid data",
//          error: response.error.details[0].message,
//          type: "error"
//        });
//      } else {
   cartModel.updateOne({ _id: req.body._id }, { $set: dataObj }, function (err, docs) {
       if (err) {
           res.status(400).send({
               code: 400,
               message: "Cart Update Getting Error",
               type: "error",
               error: err
             });
       } else if (docs != null) {
           res.status(200).send({
               code: 200,
               message: "Cart Details Updated sucessfully",
               type: "success",
             });
       } else {
           res.status(400).send({
               code: 400,
               message: "Cart Details Updated Fail Please Try Again",
               type: "error",
             });
       }
   });
//   }
}


function  updateQuntity(req, res) {
    console.log(req.body);
   var query = {$and : [{ _id: req.body.cartId },{ 'product.product': req.body.productId }]};
   cartModel.updateOne(query, { $set: { 'product.product.$.quantity': 10 }}, function (err, docs) {
       if (err) {
           res.status(400).send({
               code: 400,
               message: "Cart Update Getting Error",
               type: "error",
               error: err
             });
       } else if (docs != null) {
           res.status(200).send({
               code: 200,
               message: "Cart Details Updated sucessfully",
               type: "success",
             });
       } else {
           res.status(400).send({
               code: 400,
               message: "Cart Details Updated Fail Please Try Again",
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

function  changeCartStatus(req, res) {
    var dataObj = req.body;
    const response = CartStatus(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
        cartModel.updateOne({ _id: req.body.id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Cart Status Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Cart Status Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Cart Status Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
}


async function deleteCartProductByUserId(req, res) {
    console.log(req.body);
   userData =   await cartModel.findOne({"user": req.body.userId})
   console.log(userData);
   userData.product.splice(req.body.index, 1);
   console.log(userData);
    cartModel.updateOne({"user": req.body.userId}, { $set: userData }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Product Deleted Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Product Deleted sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Product Delete Fail Please Try Again",
                type: "error",
              });
        }
    });
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

