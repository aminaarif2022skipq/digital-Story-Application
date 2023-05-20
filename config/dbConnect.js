const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log('connected to DB');
    } catch(err){
        console.log(err.message);
    }
}

module.exports =  dbConnect ;