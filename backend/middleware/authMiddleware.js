// const express = require('express');
// const app = express();
// const jwt = require('jsonwebtoken');
// app.use(express.json());
//
// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       const tokenHeader = req.header('Authorization');
//       if (!tokenHeader) {
//         return res.status(401).json({ message: 'No authentication token provided.' });
//       }
//
//       const token = tokenHeader.replace('Bearer ', '');
//       req.user = jwt.verify(token, process.env.JWT_SECRET);
//
//       // If roles are defined, check if the user's role matches.
//       if (roles.length && !roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Not authorized for this action.' });
//       }
//
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Invalid or expired token.' });
//     }
//   };
// };
//
// module.exports = authMiddleware;