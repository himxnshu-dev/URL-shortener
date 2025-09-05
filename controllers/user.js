const User = require("../models/user");
const z = require("zod");
const {v4: uuidv4} = require("uuid");
const {setUser} = require("../services/auth");

// Input validation using zod
const emailValidation = z
  .string()
  .email({message: "Invalid email format"})
  // This regex checks for a standard email pattern: user@domain.extension
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Email must be a valid address with a domain.",
  });

const signupValidationSchema = z.object({
  name: z.string().min(2, {message: "Name must be at least 2 characters"}),
  // ✅ UPDATE THIS LINE
  email: emailValidation,
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters"}),
});
const signinValidationSchema = z.object({
  email: emailValidation,
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters"}),
});

const handleNewUserSignup = async (req, res) => {
  const {name, email, password} = req.body;

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

    return res.render("signin");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("signup", {
        error: "Email already in use, please sign up with a different one!",
      });
    }

    // For some other error
    console.log(error.name);
    return res.status(500).send("Something went wrong!");
  }
};

const handleUserSignin = async (req, res) => {
  const {email, password} = req.body;

  // input validation
  const inputValidate = signinValidationSchema.safeParse({email, password});
  if (!inputValidate.success) {
    const fieldErrors = inputValidate.error.flatten().fieldErrors;
    return res.render("signin", {
      errors: fieldErrors,
      email: email,
    });
  }

  const user = await User.findOne({
    email,
    password,
  });

  if (!user) {
    return res.status(403).render("signin", {
      msg: "Invalid credentials, please try again!",
    });
  }

//   Store the login info in the local session storage
    // req.session.userId = user._id;
    // console.log(req.session, req.session.id, req.session.userId);

    // Using stateful auth using session
    // const sessionId = uuidv4();
    // setUser(sessionId, user);
    // res.cookie("uid", sessionId);

  // Auth using JWT
  const token = setUser(user)
  res.cookie('uid', token)
  console.log("Token created: ", token)

  return res.status(200).redirect("/");
};

const handleUserLogout = (req, res) => {
  res.clearCookie("uid");

  return res.redirect("/signin");
};

module.exports = {handleNewUserSignup, handleUserSignin, handleUserLogout};
