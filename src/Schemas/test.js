const {Schema, model } = require('mongoose');

let test = new Schema({
    name: String
})


module.exports = model('testSchema081987' , test);