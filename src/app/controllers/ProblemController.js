const DeliveryProblem = require('../models/DeliveryProblem');
const Delivery = require('../models/DeliveryProblem');

class ProblemController {
  async list(req, res) {
    const problems = await DeliveryProblem.findAll({
      include: [
        {
          model: Delivery,
          where: { canceled_at: null },
          attributes: ['id', 'product'],
        },
      ],
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem)
      return res.status(400).json({ error: 'Problem does not exist' });

    const delivery = await Delivery.findByPk(problem.delivery_id, {
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
  }
}

module.exports = new ProblemController();
