

const nodemailer = require("nodemailer");
require("dotenv").config()
const Mailgen = require("mailgen");
// const {Email, Password} = require("./env.js")

const sendMail = async (req,res)=>{

  const {email} = req.body

  let config = {
    host: "smtp.gmail.com",
    service:"gmail",
    port:587,
    secure:false,
    auth:{
      user:process.env.USER_NAME,
      pass:process.env.USER_NAME_KEY
    }
  }

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme:"default",
    product:{
      name:"Hr360",
      link:"https://mailgen.js/"
    }
  })

  let response = {
    body:{
      intro:"Your otp has been sent",
      table:{
        data: [{
          OTP: "333",
          
      }]
      }
    }
  }

let mail = MailGenerator.generate(response);

let message = {
  from:process.env.USER_NAME,
  to:email,
  subject:"Reset password otp",
  html:mail
}

transporter.sendMail(message).then(()=>{
      return res.status(201).json({message:"You should receive an email from us "})
    }).catch(error => {
      return res.status(500).json({error})
    })

}


  module.exports = {sendMail}