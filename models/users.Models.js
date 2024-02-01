var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var userSchema = Schema({
    	firstName :{
        type: String,
        // required : true,
     },
     	lastName :{
        type: String,
        // required : true,
     },
     	email:{
        type:String,
        // required : true,
        // unique : true
    },
    password:{
        type:String,
        // required : true,
        // unique : true
    },
    bussinessType:{
        type:String,
    },
    // gender:{
    //     type:String,
    // },
    companyName:{
         type : String
    },
    companyWebsite:{
        type : String
   },
   companyAddressOne:{
    type : String
},
companyAddressTwo:{
    type : String
},
    //   password:{
    //     type:String,
    //     // required : true
    // },
    //  userImageUrl:{
    //     type:String,
    //  },
    isActive:{
        type:Boolean,
        default : false
    },
    address:{
        type: [Object],   //zipcode, geo location 
        required : true
    },
    deliveryAddress:{
        type: [Object],
        required : true
    },
    phone:{
         type:String,
         unique : true
        //  required : true,
    },
},
{
    timestamps: true
})


userSchema.pre('save', function (next) {
    next();
})

userSchema.plugin(mongoosePaginate);
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('user', userSchema);