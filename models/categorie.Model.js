var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var categorieSchema = Schema({
    categoryName:{
         type:String,
         unique: true
     },
     description:{
        type:String
    },
    imageURL:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default : true
    },
    displayStatus:{
        type:Boolean,
        default : false
    },
},
{
    timestamps: true
})


// categorieSchema.pre('save', function (next) {
//     next();
// })

categorieSchema.plugin(mongoosePaginate);
categorieSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('categorie', categorieSchema);