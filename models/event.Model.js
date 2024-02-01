var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var eventSchema = Schema({
    clientId:{
        type : Schema.Types.ObjectId,
        ref : "client"  
    },
    eventName:{
        type: String
     },
     eventDate:{
        type: String
       },
       eventTime:{
         type: String
        },
        eventImageUrl:{
         type:String
        },
        eventAddress:{
            type: String
           },
           eventLocation:{
            type:String
           },
        isActive:{
            type:Boolean,
            default:true
        }
},
{
    timestamps: true
})


// eventSchema.pre('save', function (next) {
//     next();
// })

eventSchema.plugin(mongoosePaginate);
eventSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('event', eventSchema);