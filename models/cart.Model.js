var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var productSchema = Schema({
    product:[
        {
            product: 
             {
              type :  Schema.Types.ObjectId,
              ref : "product",  
             }, 
              quantity :{
              type: String
          },
          orderType :{
            type: String
        },
        dateAndTime :{
            type: Date
        }
        }
    ],
    user:{
        type : Schema.Types.ObjectId,
        ref : "user"  
     },
    status :{
        type:String,
    },
    isActive :{
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

module.exports = mongoose.model('cart', productSchema);