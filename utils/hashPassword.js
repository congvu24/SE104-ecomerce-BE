const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (plaintPasswd) => {
  const hash = await bcrypt.hash(plaintPasswd, saltRounds);
  return hash;
};

const comparePassword = async (plaintPasswd, hash) => {
  const compare = await bcrypt.compare(plaintPasswd, hash);
  return compare;
};

module.exports = {
  hashPassword,
  comparePassword,
};
