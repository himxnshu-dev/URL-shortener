const User = require("../models/user");

const handleNewUserSignup = async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    return res.render("signin");
  } catch (error) {
    if (error.code === 11000) {
        return res.render('signup', {
            error: "Email already in use, please sign up with a different one!"
        })
    }

    // For some other error
    console.log(error.name)
    return res.status(500).send("Sonmething went wrong!")
  }
};

const handleUserSignin = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({
    email,
    password,
  });

  if (!user) {
    return res.status(403).render("signin", {
        msg: "Invalid credentials, please try again!"
    });
  }

  // Store the login info in the local session storage
  req.session.userId = user._id
  console.log(req.session, req.session.id, req.session.userId)

  return res.status(200).render("home", {
    name: user.name,
  });
};

module.exports = {handleNewUserSignup, handleUserSignin};
