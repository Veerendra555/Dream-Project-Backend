var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var accountSchema = Schema({
    bankName:{ 
        type:String,
    },
    customerName:{ 
        type:String,
    },
    ifscCode:{ 
        type:String,
    },
    accountNo:{ 
        type:String,
    },
    branchName:{ 
        type:String,
    },
    phonePay:{ 
        type:String,
    },
    whatsAppNo:{ 
        type:String,
    },
    email:{ 
        type:String,
    },
    phoneNo:{ 
        type:String,
    },
    googlePay:{ 
        type:String,
    },
    fbLink:{ 
        type:String,
    },
    youtubeLink:{ 
        type:String,
    },
    twitterLink:{ 
        type:String,
    },
    instaLink:{ 
        type:String,
    },
    isActive:{
        type:Boolean,
        default : true
    },
},
{
    timestamps: true
})


accountSchema.pre('save', function (next) {
    next();
})

// accountSchema.plugin(mongoosePaginate);
// accountSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('account', accountSchema);


