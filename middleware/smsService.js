//app.js
const express = require("express");
const app = express();
const AWS = require("aws-sdk");//npm install aws-sdk
require('dotenv').config();//npm install dotenv
// REGION_NAME = "ap-south-1"
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region : process.env.REGION
});
// const PORT = "3000"
//function to generate random number

function generateRandomNumber(min=1000, max=9999) {
   return Math.floor(Math.random() * (max - min) + min);
}
//function to send OTP using AWS-SNS
function sendOTP(PhoneNumber,otp){
//    var OTP = otp;
   var params = {
   Message: "GearUp  OTP : " + otp, /* required */
     PhoneNumber: "+91-"+PhoneNumber
     };
     console.log(params);
     return new AWS.SNS({apiVersion: '2010–03–31'}).publish(params).promise()
.then(message => {
console.log("OTP SEND SUCCESS");
console.log(message);
})
.catch(err => {
console.log("Error "+err)
return err;});
}
// sendOTP("9100492944",12345);//calling send otp function


module.exports = {
    generateRandomNumber,
    sendOTP
}