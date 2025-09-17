const mongoose = require('mongoose')

const ConnectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log("Connected successfully")
    })
    .catch((error) =>{
        console.error("Connection Failed", error.message)
    })
    //process.exit(1);
}


module.exports = ConnectDB;
