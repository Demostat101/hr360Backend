const express = require("express");
const User = require("./user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { sendMail } = require("./mail.js");

// insert a user into database route

router.post("/signup", async (req, res) => {
  let checkemail = await User.findOne({ email: req.body.email });

  if (checkemail) {
    return res
      .status(400)
      .json({ success: false, errors: "Email already exist" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  try {
    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    const data = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//User login endpoint

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ success: false, errors: "Wrong Email" });
    }

    // Compare the password provided with the hashed password in the database
    const passwordCompare = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordCompare) {
      return res.json({ success: false, errors: "Wrong Password" });
    }

    const data = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(data, "secret_ecom");
    res.json({
      success: true,
      token,
      message: "Logged in successfully",
      user: { name: user.name, surname: user.surname },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// Get a user

router.get("/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    if (!email) {
      return res.status(501).send({ error: "invalid email" });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(501).send({ error: "couldnt find any user email" });
    }
    // TO HIDE USER PASSWORD
    const { password, ...rest } = Object.assign({}, user.toJSON());

    res.status(200).send(rest);
  } catch (error) {
    return res.status(404).send({ error });
  }
});

//generate OTP random otp

const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };

  next();
};

const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(200).send({ code: req.app.locals.OTP });
};

router.post("/sendOtp", sendMail, async (req, res) => {
  try {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).send({ message: "Invalid email address." });
    }
  } catch (error) {
    res.status(500).send({ message: "An error occurred." });
  }
});

router.get("/generateOTP", localVariables, generateOTP, async (req, res) => {});

//verify generated otp
router.get("/verifyOTP", async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;

    return res.status(200).send({ message: "Verify Successfully" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
});

//reset session....
router.get("/createResetSession", async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: "Access granted" });
  }

  return res.status(440).send({ error: "Session expired" });
});

//reset password

router.put("/resetPassword", async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session Expired" });
    }

    const { email, password } = req.body;

    // Check if password is provided
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(`reset hashed password: ${hashedPassword}`);

    // Update user's password
    const result = await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    if (result.nModified === 0) {
      return res.status(500).send({ error: "Password update failed" });
    }

    return res.status(200).send({ message: "Record Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "An error occurred" });
  }
});

// delete a user

router.delete("/signup/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
