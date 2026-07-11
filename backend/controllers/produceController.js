const Produce = require('../models/Produce');

const getProduce = async (req, res) => {
  try {
    const produce = await Produce.find({ isAvailable: true })
      // NEW: Added 'location' to the end of this string!
      .populate('farmer', 'firstName lastName farmVillageName district location');
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch produce', error: error.message });
  }
};

const getFarmerProduce = async (req, res) => {
  try {
    const produce = await Produce.find({ farmer: req.user.id });
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your listings', error: error.message });
  }
};

const addProduce = async (req, res) => {
  try {
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({ message: 'Only registered Farmers can add produce.' });
    }

    const { name, category, quantityAvailable, unit, pricePerUnit, mandiPrice, harvestDate, isOrganic, fulfillment, photos, description } = req.body;

    const produce = await Produce.create({
      farmer: req.user.id, 
      name,
      category,
      quantityAvailable,
      unit,
      pricePerUnit,
      mandiPrice,
      harvestDate,
      isOrganic,
      fulfillment,
      photos,
      description
    });

    res.status(201).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add produce', error: error.message });
  }
};

const updateProduce = async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id);
    if (!produce) return res.status(404).json({ message: 'Produce not found' });

    if (produce.farmer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this crop' });
    }

    const updatedProduce = await Produce.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    res.status(200).json(updatedProduce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update produce', error: error.message });
  }
};

const deleteProduce = async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id);
    if (!produce) return res.status(404).json({ message: 'Produce not found' });

    if (produce.farmer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this crop' });
    }

    await produce.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Produce deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete produce', error: error.message });
  }
};

const getProduceById = async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id)
      // NEW: Added 'location' to the end of this string!
      .populate('farmer', 'firstName lastName farmVillageName district location');
      
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }
    res.status(200).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch produce', error: error.message });
  }
};

module.exports = { getProduce, getFarmerProduce, addProduce, updateProduce, deleteProduce, getProduceById };