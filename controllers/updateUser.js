const User = require('../model/User');
const requestBodySchema = require('../model/RequestBodySchema/update');
const updateUser = async (req,res) => {
    const projection = {
        refreshToken: 0,
        createdAt: 0,
        updatedAt: 0,
        password : 0,
        __v: 0,
      };
    const id = req.params.id;
    const { error , value } = requestBodySchema.validate(req.body);
    if(error)  return res.status(400).json({ error: error.details[0].message });

    try{
        const updatedUser = await User.findByIdAndUpdate(id,{
            $set : value
        },{ 
            'returnDocument' : 'after',
            'select' : projection
        })
        return res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = updateUser;