const Yup = require('yup');
const Delivery = require('../models/Delivery');
const DeliveryProblem = require('../models/DeliveryProblem');

class DeliveryProblemController {
  async list(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery)
      return res.status(400).json({ error: 'Delivery does not exist' });

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: id },
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const deliveryProblem = await DeliveryProblem.create(req.body);

    return res.json(deliveryProblem);
  }
}

module.exports = new DeliveryProblemController();
