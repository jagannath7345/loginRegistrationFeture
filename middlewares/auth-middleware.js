import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      //   console.log("Token", token)
      //   console.log("Authorization", authorization)

      const { userID } = Jwt.verify(token, process.env.JWT_SECRAT_KEY);

      req.user = await UserModel.findById(userID).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.stauts(401).send({ status: "failed", message: "Unauthorized User" });
    }
    if (!token) {
      res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User, No Token" });
    }
  }
};

export default checkUserAuth;
