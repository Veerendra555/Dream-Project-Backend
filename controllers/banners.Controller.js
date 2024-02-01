const  bannerModel= require('../models/banners.Module');
const Joi = require('joi');
var fs = require('fs');
var path = require('path');

module.exports = {
    addBanner,
    getBanners,
    getBannerById,
    deleteBannerById,
    bannerStatusChange
    // changePassword
}

/////Validation Starts

function validateAddBanner(banner) {
    const JoiSchema = Joi.object({
        bannerImageUrl: Joi.string()
        .min(2)
        .max(110)
        .required(),
        });
    return JoiSchema.validate(banner)
  }


  function validateBannerStatus(banner) {
    const JoiSchema = Joi.object({
        id: Joi.string()
        .min(20)
        .max(40)
        .required(),
        isActive: Joi.boolean()
        .required(),
        });
      
    return JoiSchema.validate(banner)
  }
  
////Validation Ends


/////////Add Staff
async function addBanner(req, res) {
    const response = validateAddBanner(req.body)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
    var dataObj = new bannerModel(req.body);
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
                message: "banner is Save sucessfully",
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




/////////Get All Staff

async function getBanners(req, res) {
    var query;
    if(req.query.role != null && req.query.role != undefined  && req.query.role == 'Admin')
    query = {};
    else
    query = {isActive : true};
    bannerModel.find(query).exec(function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "banner Details Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "banner Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "banner Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}


/////////Get  banner By Id

async function getBannerById(req, res) {
    var query = { _id: req.params.id };
    bannerModel.findById(query).exec(function (err, docs) {
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
                message: "banner Details Getting sucessfully",
                type: "success",
                data: docs
              });
        } else {
            res.status(200).send({
                code: 200,
                message: "banner Details Getting sucessfully",
                type: "success",
                data: []
              });
        }
    });
}



/////////Delete  banner By Id


function deleteBannerById(req, res) {
    bannerModel.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
        //console.log("docs", docs);
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Banner Delete Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Banner Deleted sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Banner Delete  Fail Please Try Again",
                type: "error",
              });
        }
    })
}
///////Update  Staff By Id

function  bannerStatusChange(req, res) {
    var dataObj = req.body;
    const response = validateBannerStatus(dataObj)
    if (response.error) {
        res.status(400).send({
          code: 400,
          message: "Invalid data",
          error: response.error.details[0].message,
          type: "error"
        });
      } else {
        bannerModel.updateOne({ _id: req.body.id }, { $set: dataObj }, function (err, docs) {
        if (err) {
            res.status(400).send({
                code: 400,
                message: "Banner Update Getting Error",
                type: "error",
                error: err
              });
        } else if (docs != null) {
            res.status(200).send({
                code: 200,
                message: "Banner Details Updated sucessfully",
                type: "success",
              });
        } else {
            res.status(400).send({
                code: 400,
                message: "Banner Details Updated Fail Please Try Again",
                type: "error",
              });
        }
    });
   }
}