const Yup = require('yup');
const User = require('../models/User');

class DeliverymanController {
  async list(req, res) {
    try {
      const users = await User.findAll({ where: { admin: false } });

      return res.json(users);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Validation failed' });

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists)
        return res.status(400).json({ error: 'User already exists' });

      const response = await User.create(req.body);

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field,
          ),
        confirmPassword: Yup.string().when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field,
        ),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Validation failed' });

      const { email, oldPassword } = req.body;
      const { id } = req.params;

      const user = await User.findOne({ where: { id, admin: false } });

      if (!user) return res.status(400).json({ error: 'User does not exist' });

      if (email && email !== user.email) {
        const emailAlreadyRegistered = await User.findOne({ where: { email } });

        if (emailAlreadyRegistered)
          return res.status(400).json({ error: 'Email already registered' });
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        return res.status(401).json({ error: 'Password does not match' });

      const response = await user.update(req.body);

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: { id, admin: false },
      });

      if (!user) return res.status(400).json({ error: 'User does not exist' });

      await user.delete();

      return res.json({ success: true });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new DeliverymanController();
