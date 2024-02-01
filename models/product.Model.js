var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var productSchema = Schema({
    categorieId:{
        type : Schema.Types.ObjectId,
        ref : "categorie"  
    },
    poductType :{
        type:String,
         default : "N/A"  //New This Week
    },
    productName:{
        type: String
     },
     unloadingCharges:{
        type: String
       },
     costPerDistance:{
         type: String
        },
        time:{
         type:String
        },
        productPrice:{
         type: String,
         range: {
            min: { type: Number, min: 1 },
            max: { type: Number, max: 500000  }
        },
         required : true,
        },
     quantity:{
         type : String,
         require : true,
         range: {
            min: { type: Number, min: 1 },
            max: { type: Number, max: 1000  }
        },
        default : 1
     },
     discount:{
            type:String
        },
       productTax:{
        type:String
     },
        isActive:{
            type:Boolean,
            default:false
        },
        brand:{
            type : Schema.Types.ObjectId,
             ref:"brand"
        },
        productImgURL:{
            type:String
        },
        description:{
            type:String
        },
    productSubImageURL:{
        type:[String],
    },
    isActive:{
        type:Boolean,
        default : true
    },
},
{
    timestamps: true
})


// productSchema.pre('save', function (next) {
//     next();
// })

productSchema.plugin(mongoosePaginate);
productSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('product', productSchema);