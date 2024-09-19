const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
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
 
    created: {
        type:Date,
        required: true,
        default: Date.now
    }
});

    userSchema.pre("save", async function(next) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt)
        next()
    })

    const User = mongoose.model("User", userSchema);

module.exports = User;