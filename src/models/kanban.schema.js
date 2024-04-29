const mongoose = require('mongoose');

const kanbanSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    status:{type:String,enum:['pending','in-progress','completed'],default:'pending'}
},{
    versionKey:false
})

const todoModel = mongoose.model('todo',kanbanSchema);

module.exports ={
    todoModel
}