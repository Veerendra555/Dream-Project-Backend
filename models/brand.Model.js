var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var brandSchema = Schema({
    category_id:{
        type : Schema.Types.ObjectId,
        ref : "categorie"  
    },
    brandName:{
         type:String,
         unique: true
     },
     description:{
        type:String
    },
    brandImgUrl:{
        type:String,
    },
    coverImageUrl:{
        type:String,
    },
    advertiseImageUrl:{
        type: [String],
    },
    isActive:{
        type:Boolean,
        default : true
    },
},
{
    timestamps: true
})


// brandSchema.pre('save', function (next) {
//     next();
// })

brandSchema.plugin(mongoosePaginate);
brandSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('brand', brandSchema);