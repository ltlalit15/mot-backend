
const mongoose = require("mongoose");

const ClientSchema =new mongoose . Schema ({

    registration: { type: String, unique: true },
    vehicleModal :String,
    customerName : String  ,
    mobileNo:Number,
    email:String,
   lastVisitDate:Date,
   motDueDate:Date,
   status:String,

})
module.exports = mongoose.model("ClientManage", ClientSchema);  