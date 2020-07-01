const Yup = require('yup');
const { setMinutes, setHours, compareAsc } = require('date-fns');
const User = require('../models/User');
const File = require('../models/File');
const Recipient = require('../models/Recipient');
const Delivery = require('../models/Delivery');

const _isBetweenHours = (date, timeStart, timeEnd) => {
  const [startHours, startMinutes] = timeStart.split(':');
  const [endHours, endMinutes] = timeEnd.split(':');
  const today = new Date();
  const dateStart = setMinutes(setHours(today, startHours), startMinutes);
  const dateEnd = setMinutes(setHours(today, endHours), endMinutes);

  return (
    compareAsc(date, dateStart) in [0, 1] ||
    compareAsc(date, dateEnd) in [-1, 0]
  );
};

class DeliverymanDeliveriesController {
  async list(req, res) {
    const { id } = req.params;
    const deliveryman = await User.findByPk(id);

    if (!deliveryman)
      return res.status(400).json({ error: 'User does not exist' });

    const { delivered = null } = req.query;

    const deliveries = await Delivery.findAll({
      where: { canceled_at: null, end_date: delivered },
      include: [
        { model: User, as: 'deliveryman', attributes: ['id', 'name'] },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'address'],
        },
      ],
      attributes: ['id', 'product'],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.string(),
      end_date: Yup.string(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field,
      ),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const { id, delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery)
      return res.status(400).json({ error: 'Delivery does not exist' });

    if (delivery.deliveryman_id !== req.userId)
      return res
        .status(400)
        .json({ error: "You can't update another user's delivery" });

    const { start_date, end_date, signature_id } = req.body;

    if (start_date) {
      if (!_isBetweenHours(start_date, '08:00', '18:00'))
        return res.status(401).json({
          error: 'The time period to take a delivery is between 8am and 6pm',
        });
    } else if (signature_id) {
      const signature = await File.findByPk(signature_id);

      if (!signature)
        return res
          .status(400)
          .json({ error: 'You have to upload a signature first' });
    }

    const response = await delivery.update(req.body);

    return res.json(response);
  }
}

module.exports = new DeliverymanDeliveriesController();
