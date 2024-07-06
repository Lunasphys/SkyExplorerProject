const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const tokenHeader = req.header('Authorization');
      if (!tokenHeader) {
        return res.status(401).json({ message: 'No authentication token provided.' });
      }

      const token = tokenHeader.replace('Bearer ', '');
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized for this action.' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
};

module.exports = authMiddleware;
