const express = require("express");
const User = require("./user");
const router = express.Router();
const jwt = require("jsonwebtoken")
const bycrypt = require("bcrypt")
// const cloudinary = require("./utils/cloudinary");
// const upload = require("./utils/multer");




//  insert image

// router.post("/", upload.single("image"), async(req, res)=>{
//     const result = await cloudinary.uploader.upload(req.file.path);
//     try {
//         res.json(result)
//     } catch (error) {
//         console.log(error);
//     }
// })

// insert a user into database route

router.post("/signup",/* upload.single("image"), */async (req,res)=>{
    let checkemail = await User.findOne({email:req.body.email});
    // let checkpassword = await User.findOne({password:req.body.password});
    if (checkemail) {
        return res.status(400).json({success:false,errors:"Email already exist"})
    }

    // if (password) {
    //     bycrypt.hash(password,12)
    //         .then(hashedPassword => {

    //         }).catch( error => {
    //             return res.status(500).send({
    //                 error: "Enable to hashed password"
    //             })
    //         })
    // }


    // if (checkpassword) {
    //     return res.status(400).json({success:false,errors:"Password already exist"})
    // }

    try {
        const user = new User({
            name:req.body.name,
            surname:req.body.surname,
            email:req.body.email,
            password:req.body.password })
    
            await user.save();
            const data = {
                user:{
                    id:user._id
                }
            }
        
            const token = jwt.sign(data,"secret_ecom");
            res.json({success:true,token})
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }

    
    // const result = await cloudinary.uploader.upload(req.file.path);

    // try {
    //     const user = new User({
    //         name:req.body.first_name,
    //         surname:req.body.surname,
    //         email:req.body.email,
    //         password:req.body.password
    //         // phone:req.body.phone,
    //         // image: result.secure_url,
    //         // gender:req.body.gender,
    //         // stack:req.body.stack,
    //         // cohort:req.body.cohort,
    //         // cloudinary_id:result.public_id
    //     });
    //     await user.save();
    //     const data = {
    //         user:{
    //             id:user._id
    //         }
    //     }

    //     const token = jwt.sign(data,"secret_ecom")
    //     res.json({success:true,token})

    //     res.send(user)
        
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send(error);
    // }

   

 });


 //User login endpoint

 router.post("/login", async(req,res)=>{

    let user = await User.findOne({email:req.body.email});
    if (user) {
        const passwordCompare = req.body.password === user.password;
       
        if (passwordCompare) {
            const data = {
                user:{
                    id:user._id
                }
            }


            

            const token = jwt.sign(data,"secret_ecom");
            res.json({success:true,token,message:"Logged in successfully",user:{name:user.name, surname:user.surname}});
        } else {
            res.json({success:false,errors:"Wrong Password"})
        } 
        
    } else {
        res.json({success:false, errors:"Wrong Email"})
    }
 })



// get all users

router.get("/signup",async (req, res)=>{
    try {
        const users = await User.find({});
    
        res.send(users)
       
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//generate OTP random otp

router.get("/generateOTP", async (req,res)=>{
    
})

//verify generated otp
router.get("/verifyOTP", async (req,res)=>{

})

//reset session.... 
router.get("/createResetSession", async (req,res)=>{

})

//reset password
router.put("/resetPassword", async (req,res)=>{

})




// delete a user

router.delete("/signup/:id", async (req,res)=>{
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        // await cloudinary.uploader.destroy(user.cloudinary_id);
        res.send(user);
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

module.exports = router