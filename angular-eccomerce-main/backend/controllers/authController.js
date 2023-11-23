const { registerUser, loginUser, loginUserAdmin } = require("../services/authService");

exports.login_user = async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  console.log(isAdmin)
  if (isAdmin) {
    loginUserAdmin({ email, password })
      .then((result) => {
        console.log(result);
        const { statusCode = 200, message, data, token } = result;
        res.status(statusCode).send({ message, data, token });
      })
      .catch((err) => {
        const { statusCode = 400, message, data } = err;
        res.status(statusCode).send({ message, data }) && next(err);
      });
  }
  else {
    loginUser({ email, password })
      .then((result) => {
        console.log(result);
        const { statusCode = 200, message, data, token } = result;
        res.status(statusCode).send({ message, data, token });
      })
      .catch((err) => {
        const { statusCode = 400, message, data } = err;
        res.status(statusCode).send({ message, data }) && next(err);
      });
  }
};

exports.register_user = async (req, res, next) => {

  const { username, fullName, email, password } = req.body;

  registerUser({ username, fullName, email, password })
    .then((result) => {
      const { statusCode = 200, message, data, token } = result;
      res.status(statusCode).send({ message, data, token });
    })
    .catch((err) => {
      const { statusCode = 400, message, data } = err;
      res.status(statusCode).send({ message, data }) && next(err);
    });
};
