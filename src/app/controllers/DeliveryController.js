const Yup = require('yup');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const Recipient = require('../models/Recipient');
const Mail = require('../../lib/Mail');

class DeliveryController {
  async list(req, res) {
    try {
      const deliveries = await User.findAll({ where: { cannceled_at: null } });

      return res.json(deliveries);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        recipient_id: Yup.number().required(),
        deliveryman_id: Yup.number().required(),
        product: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: 'Validation failed' });

      const recipient = Delivery.findByPk(recipient_id);

      if (!recipient)
        return res.status(400).json({ error: 'Recipient does not exist' });

      const deliveryman = Delivery.findByPk(deliveryman_id);

      if (!deliveryman)
        return res.status(400).json({ error: 'User does not exist' });

      const delivery = Delivery.findOne({ where: req.body });

      if (delivery)
        return res.status(400).json({ error: 'Delivery already exists' });

      const response = await User.create(req.body);
      const { name } = deliveryman;
      const { product } = req.body;
      const { street, number, complement } = recipient;

      await Mail.sendEmail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Você tem uma nova entrega',
        template: 'newDelivery',
        context: {
          name,
          product,
          street,
          number,
          complement,
        },
      });

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const delivery = Delivery.findByPk(id);

      if (!delivery)
        return res.status(400).json({ error: 'Delivery does not exist' });

      const response = await delivery.update(req.body);

      return res.json(response);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const delivery = await Delivery.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['street', 'number', 'complement'],
          },
        ],
      });

      if (!delivery)
        return res.status(400).json({ error: 'Delivery does not exist' });

      await delivery.update({ canceled_at: new Date() });

      await Mail.sendEmail({
        to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
        subject: 'Sua entrega foi cancelada',
        template: 'canceledDelivery',
        context: {
          name: delivery.deliveryman.name,
          product: delivery.product,
          ...delivery.recipient,
        },
      });

      return res.json({ success: true });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new DeliveryController();
