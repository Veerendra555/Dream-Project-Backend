var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var bannerSchema = Schema({
    bannerUrl:{
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


// bannerSchema.pre('save', function (next) {
//     next();
// })

bannerSchema.plugin(mongoosePaginate);
bannerSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('banner', bannerSchema);