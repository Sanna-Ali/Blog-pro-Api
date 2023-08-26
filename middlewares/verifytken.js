const jwt = require("jsonwebtoken");
const verifytoken = (req, res, next) => {
  const authtoken = req.headers.token;
  if (authtoken) {
    try {
      const decoded = jwt.verify(authtoken, process.env.SECRET_KEY);
      if (decoded) {
        req.user = decoded;
        next();
      }
    } catch (error) {
      return res.status(401).json("invalid token, access denied");
    }
  } else {
    res.status(401).json("no token provided, access denied");
  }
};
const vervifyTokenAndAdmain = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("not allowed,only admin");
    }
  });
};
const verifytokenAndonlyuser = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.params.id === req.user.id) {
      next();
    } else {
      return res.status(403).json("not allowed,only user himself");
    }
  });
};
const verfiyTokenAndAuthorization = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json("not allowed,only user himself or admin ");
    }
  });
};

module.exports = {
  verifytoken,
  vervifyTokenAndAdmain,
  verifytokenAndonlyuser,
  verfiyTokenAndAuthorization,
};
//   if (authtoken) {
//     try {
//       const decoded = jwt.verify(authtoken, process.env.SECRET_KEY);
//       req.user = decoded;

//       next();
//     } catch (error) {
//       return res.status(401).json("invalid token, access denied");
//     }
//   } else {
//     res.status(401).json("no token provided, access denied");
//   }
// };
// const vervifyTokenAndAdmain = (req, res, next) => {
//   verifytoken(req, res, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       return res.status(403).json("not allowed,only admin");
//     }
//   });
// };
// module.exports = { verifytoken, vervifyTokenAndAdmain };
