var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var memberSchema = Schema({
    	firstName :{
        type: String,
        required : true,
     },
     	lastName :{
        type: String,
        required : true,
     },
     	email:{
        type:String,
        required : true,
        unique : true
    },
      password:{
        type:String,
        required : true
    },
     memberImageUrl:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default : true
    },
    phone:{
         type:String,
         required : true,
    },
    role:{
        type:String,
        required : true, 
    }  
},
{
    timestamps: true
})


memberSchema.pre('save', function (next) {
    next();
})

memberSchema.plugin(mongoosePaginate);
memberSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('member', memberSchema);