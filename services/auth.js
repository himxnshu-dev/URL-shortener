// const sessionIdToUserMap = new Map() // Stateful auth

const jwt = require("jsonwebtoken");
require("dotenv").config();

function setUser(user) {
  const {_id, email, name, role} = user;
  return jwt.sign(
    {
      _id,
      name,
      email,
      role,
    },
    process.env.SECRET_JWT
  );
}
function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECRET_JWT);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
