const  productModel= require('../models/product.Model');
const Joi = require('joi');
var fs = require('fs');
var path = require('path');
var mongoose = require("mongoose")

module.exports = {
    addProduct,
    getProducts,
    // getProductById,
    updateProduct,
    changeProductStatus,
    getProductByBrandId,
    getProductByCategoryId,
    getProductBySpecialStatus,
    getProductById,
    // deleteProductById,
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

function validateAddProduct(Product) {
    const JoiSchema = Joi.object({
        categorieId: Joi.string()
        .min(2)
        .max(30)
        .required(),
        productName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        productLongDescription: Joi.string()
        .min(2)
        .max(150000)
        .required(), 
        productShortDescription: Joi.string()
        .min(2)
        .max(5000)
        .required(), 
        productImageUrl: Joi.string()
        .min(2)
        .max(1500000)
        .required(),
        });
    return JoiSchema.validate(Product)
  }

  
  
function validateUpdateProduct(service) {
    const JoiSchema = Joi.object({
        categorieId: Joi.string()
        .min(2)
        .max(30)
        .required(),
        _id: Joi.string()
        .min(2)
        .max(30)
        .required(),
        ProductName: Joi.string()
        .min(2)
        .max(110)
        .required(),
        ProductLongDescription: Joi.string()
        .min(2)
        .max(150000)
        .required(), 
        ProductShortDescription: Joi.string()
        .min(2)
        .max(5000)
        .required(), 
        ProductImageUrl: Joi.string()
        .min(2)
        .max(1500000)
        .required(),
        });
    return JoiSchema.validate(service)
  }


  function ProductStatus(service) {
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
async function addProduct(req, res) {
    // const response = validateAddProduct(req.body);
    // if (response.error) {
    //     res.status(400).send({
    //       code: 400,
    //       message: "Invalid data",
    //       error: response.error.details[0].message,
    //       type: "error"
    //     });
    //   } else {
    var dataObj = new productModel(req.body);
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
                message: "Product Save sucessfully",
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

async function getProducts(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    productModel.find(query).populate("brand").sort({orderNo : "asc"}).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Product Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Product Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Product Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Get  service By Id


async function getProductById(req, res) {
    var query = { _id: req.params.productId };
    console.log("=============================getProductById........")
    console.log("getProductById........",req.params.productId)
    productModel.findById(query).populate("brand").exec(function (err, docs) {
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
                message: "Product Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Product Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}


async function getProductByBrandId(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {brand: req.params.brandId };
    else
    query = {$and : [{isActive : true},{ brand: req.params.brandId }]};
    console.log(query);
    productModel.find(query).populate("brand").exec(function (err, docs) {
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
                message: "Products Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Products Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}




async function getProductByCategoryId(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {categorieId: req.params.catId };
    else
    query = {$and : [{isActive : true},{ categorieId: req.params.catId }]};
    console.log(query);
    productModel.find(query).populate("brand").exec(function (err, docs) {
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
                message: "Products Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Products Details Getting sucessfully",
                type: "success",
                data: {}
              });
        }
    });
}



// async function getProductById(req, res) {
//     var query;
//     if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
//     query = {_id: req.params.productId };
//     else
//     query = {$and : [{isActive : true},{ _id: req.params.productId }]};
//     console.log(query);``
//     productModel.find(query).exec(function (err, docs) {
//         if (err) {
//             res.status(400).send({
//                 code: 400,
//                 message: "Invalid data",
//                 error: err,
//                 type: "error"
//               });
//         } else if (docs != null) {
//             res.status(200).send({
//                 code: 200,
//                 message: "Products Details Getting sucessfully",
//                 type: "success",
//                 data: docs
//               });
//         } else {
//             res.status(200).send({
//                 code: 200,
//                 message: "Products Details Getting sucessfully",
//                 type: "success",
//                 data: {}
//               });
//         }
//     });
// }


async function getProductBySpecialStatus(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {poductType: req.params.specialStatus };
    else
    query = {$and : [{isActive : true},{ poductType: req.params.specialStatus }]};
    console.log(query);
    productModel.find(query).populate("brand").exec(function (err, docs) {
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
                message: "Products Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "Products Details Getting sucessfully",
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


function  updateProduct(req, res) {
    delete req.body.createdAt;
    delete req.body.updatedAt;

   var dataObj = req.body;
//    const response = validateUpdateProduct(dataObj)
//    if (response.error) {
//        res.status(400).send({
//          code: 400,
//          message: "Invalid data",
//          error: response.error.details[0].message,
//          type: "error"
//        });
//      } else {
   productModel.updateOne({ _id: req.body._id }, { $set: dataObj }, function (err, docs) {
       if (err) {
           res.status(400).send({
               code: 400,
               message: "Product Update Getting Error",
               type: "error",
               error: err
             });
       } else if (docs != null) {
           res.status(200).send({
               code: 200,
               message: "Product Details Updated sucessfully",
               type: "success",
             });
       } else {
           res.status(400).send({
               code: 400,
               message: "Product Details Updated Fail Please Try Again",
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

function  changeProductStatus(req, res) {
    var dataObj = req.body;
    const response = ProductStatus(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
        productModel.updateOne({ _id: req.body.id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Product Status Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Product Status Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Product Status Updated Fail Please Try Again",
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

