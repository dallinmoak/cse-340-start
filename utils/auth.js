import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const checkAuth = (req, res) => {
  let isAuthed = false;
  const incommingToken = req.cookies.jwt;
  if (incommingToken) {
    const callback = (e, payload) => {
      if (e) {
        console.error(e);
        res.clearCookie("jwt");
        return;
      } else {
        // console.log(payload);
        isAuthed = true;
        return;
      }
    };
    jwt.verify(incommingToken, process.env.TOKEN_SECRET, callback);
  }
  return isAuthed;
};
const validateProtectedRoute = (req, res, next) => {
  const isAuthed = checkAuth(req, res);
  if (isAuthed) {
    next();
  } else {
    req.flash("error", "You must be logged in to view this page");
    res.redirect("/account/login");
  }
};

const validateloginPw = async (req, hashedPw) => {
  try {
    const passwordIsMatch = await bcrypt.compare(req.body.password, hashedPw);
    return passwordIsMatch;
  } catch (e) {
    throw new Error(e);
  }
};

const setLoginCookie = (res, payload) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600 * 1000,
  };
  res.cookie("jwt", token, options);
};

export { validateProtectedRoute, validateloginPw, setLoginCookie };
