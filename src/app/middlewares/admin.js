const User = require('../models/User');

async function admin(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);

    if (!user.isAdmin()) return res.status(401).json({ error: 'Unauthorized' });

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = admin;
