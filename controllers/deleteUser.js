const User = require('../model/User');

const deleteUser = async (req,res) => {
    const id = req.params.id;

    try{    
        const deletedUser = await User.deleteOne({_id : id}).exec();
        if(deletedUser.deletedCount > 0)  res.status(200).json('user : successfully deleted');
        else res.status(404).json('user : not found');
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = deleteUser;