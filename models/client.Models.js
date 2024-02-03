var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var clientSchema = Schema({
    clientName :{
        type: String,
        // required : true,
     },
     partnerName :{
        type: String,
        // required : true,
     },
    phone:{
         type : String
    },
    videoUrl:{
        type : String
   },
   colorCode:{
    type : String
   },
   marriageDate:{
    type : String
},
marriageTime:{
    type : String
},marriageTimer:{
    type : String
},
    isActive:{
        type:Boolean,
        default : true
    },
    bannerImages:{
        type: [String],   //zipcode, geo location 
        required : true
    },
    carouselImages:{
        type: [String],
        required : true
    },
},
{
    timestamps: true
})


clientSchema.pre('save', function (next) {
    next();
})

clientSchema.plugin(mongoosePaginate);
clientSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('client', clientSchema);