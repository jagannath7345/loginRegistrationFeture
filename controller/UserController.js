import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegstration = async (req, res) => {
    const { name, email, password, password_conf, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "User Allready exists" });
    } else {
      if (name && email && password && password_conf && tc) {
        if (password === password_conf) {
          try {
            const salt = await bcrypt.genSalt(11);
            const hashPassword = await bcrypt.hash(password, salt);
            const data = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await data.save();
            const user_data = await UserModel.findOne({ email: email });
            const token = jwt.sign(
              { userID: user_data._id },
              process.env.JWT_SECRAT_KEY,
              { expiresIn: "5d" }
            );
            res.status(201).send({
              status: "success",
              message: "Registration sucessfully",
              token: token,
            });
          } catch (error) {
            res.send({ status: "failed", message: "Somthing went worng" });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password and Confirm Password doesn't Match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Feiled are Required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isPassword = await bcrypt.compare(password, user.password);
          if (user.email === email && isPassword) {
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRAT_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "User Login Successfully",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or Password are not valid",
            });
          }
        } else {
          res.send({ status: "failed", message: "You are not a valid user" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    const { password, password_conf } = req.body;
    if (password && password_conf) {
      if (password !== password_conf) {
        res.send({
          status: "failed",
          message: "New Password and confirm password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(11);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({ status: "success", message: "Password change Successfuly" });
      }
    } else {
      res.send({ status: "failed", message: "All Feild are Required" });
    }
  };

     static loggedUserData = (req, res) => {
    res.send({"user": req.user})
  }
}

export default UserController;
