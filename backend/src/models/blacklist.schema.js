const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    token:{type:String,required:true,unique:true},
    expireAt:{type:Date,required:true}
})

const blacklistModel = mongoose.model('blacklist',blacklistSchema);

module.exports = {
    blacklistModel
}