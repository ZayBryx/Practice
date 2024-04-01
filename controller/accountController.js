const login = async (req, res) => {
  res.send("login route");
};

const register = async (req, res) => {
  res.send("register route");
};

module.exports = { login, register };
