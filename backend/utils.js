import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user._email,
      name: user._name,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Get rid of Bearer and get token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Invalid token",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "No token",
    });
  }
};
