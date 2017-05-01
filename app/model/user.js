let mongoose = require("mongoose");
let Schema = mongoose.Schema;
 
let UserSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  birthDate: {type: Date, required: true},
  gender: {type: String, required: false},
});
 
module.exports = mongoose.model("user", UserSchema);
