const mongoose = require('mongoose');
require('dotenv').config();

const connectedToDatabase = async()=>{
    try {
        await mongoose.connect(process.env.mongoURI);
        console.log(`Connected to the database successfully`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectedToDatabase
}