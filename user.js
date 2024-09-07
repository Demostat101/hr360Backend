const mongoose = require("mongoose");
const { any } = require("./utils/multer");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },

    surname: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        unique:true
    },
    // cloudinary_id: {
    //     type:String,
    //     required:false
        
    // },
 
    created: {
        type:Date,
        required: true,
        default: Date.now
    }
});

    const User = mongoose.model("User", userSchema);

module.exports = User;