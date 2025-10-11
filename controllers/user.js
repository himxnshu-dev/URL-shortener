const User = require("../models/user");
const {v4: uuidv4} = require("uuid");
const {setUser} = require("../services/auth");
const signinValidationSchema = require('../validations/auth')
const signupValidationSchema = require('../validations/auth')
const bcrypt = require('bcrypt')

const handleNewUserSignup = async (req, res) => {
  const {name, email, password} = req.body;

  // Input validation using zod
  const inputValidate = signupValidationSchema.safeParse({
    name,
    email,
    password,
  });
  if (!inputValidate.success) {
    const fieldErrors = inputValidate.error.flatten().fieldErrors;
    return res.render("signup", {
      errors: fieldErrors,
      name: name,
      email: email,
    });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    return res.redirect("signin");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("signup", {
        error: "Email already in use, please sign up with a different one!",
      });
    }

    // For some other error
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};

const handleUserSignin = async (req, res) => {
    try {
        const {email, password} = req.body;

  // Input validation using zod
  const inputValidate = signinValidationSchema.safeParse({email, password});
  if (!inputValidate.success) {
    const fieldErrors = inputValidate.error.flatten().fieldErrors;
    return res.render("signin", {
      errors: fieldErrors,
      email: email,
    });
  }

  const user = await User.findOne({
    email
  });
  if (!user) {
    return res.status(403).render("signin", {
      msg: "Invalid credentials, please try again!",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.render('signin', {
    errors: "Wrong password!"
  })

  //   Store the login info in the local session storage
  // req.session.userId = user._id;
  // console.log(req.session, req.session.id, req.session.userId);

  // Using stateful auth using session
  // const sessionId = uuidv4();
  // setUser(sessionId, user);
  // res.cookie("uid", sessionId);

  // Auth using JWT
  const token = setUser(user);
  res.cookie("token", token);
  console.log("Token created: ", token);

  return res.status(200).redirect("/");
    } catch (err) {
        console.log(err)
        return res.render('signin', {
            msg: "something went wrong during signin"
        })
    }
  
};

const handleUserLogout = (req, res) => {
  res.clearCookie("token");

  return res.redirect("/signin");
};

module.exports = {handleNewUserSignup, handleUserSignin, handleUserLogout};
