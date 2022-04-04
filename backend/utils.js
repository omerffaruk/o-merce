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
  console.log({ authorization });
  console.log("type of authorization is: ", typeof authorization);
  console.log(Boolean(authorization));
  if (authorization) {
    console.log(
      "This is authorization inside the if statement: ",
      authorization
    );
    const token = authorization.slice(7, authorization.length); // Get rid of Bearer and get token
    console.log("This is token: ", token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Failed to authenticate token",
        });
      } else {
        req.user = decoded;
        console.log("This is req.user: ", req.user);
        next();
        console.log(
          "This is to see if the function is still running after next()"
        );
        return;
      }
    });
  } else {
    console.log("This is to see if the function is running in else statement.");
    return res.status(401).json({
      error: "No token",
    });
  }
};
