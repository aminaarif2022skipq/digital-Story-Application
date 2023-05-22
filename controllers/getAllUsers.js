const User = require('../model/User')
const getAllUsers = async (req,res) => {
      try{
          const users = await User.find({}).exec();
          if(users.length === 0) {
            return res.status(404).json('no data found'); // No Data Found
          }
          return res.json(users);
      }catch(err){
         res.status(500).json({ message : err.message});
      }
}

module.exports = getAllUsers;