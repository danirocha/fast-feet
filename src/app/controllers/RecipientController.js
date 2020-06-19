const Yup = require('yup');
const Recipient = require('../models/Recipient');

class RecipientController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        address: Yup.object().required().shape({
          street: Yup.string().required(),
          number: Yup.number().integer().positive(),
          complement: Yup.string(),
          city: Yup.string().required(),
          state: Yup.string().required(),
          zip_code: Yup.number().integer().positive().required(),
        }),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Validation failed' });

      const { name, address } = req.body;

      const response = await Recipient.create({ name, ...address });

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const recipient = await Recipient.findOne({ where: { id } });

      if (!recipient)
        return res.status(400).json({ error: 'Recipient not found' });

      const schema = Yup.object().shape({
        name: Yup.string(),
        address: Yup.object().shape({
          street: Yup.string(),
          number: Yup.number().integer().positive(),
          complement: Yup.string(),
          city: Yup.string(),
          state: Yup.string(),
          zip_code: Yup.number().integer().positive(),
        }),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Validation failed' });

      const { name, address } = req.body;

      const response = await recipient.update({ name, ...address });

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new RecipientController();
