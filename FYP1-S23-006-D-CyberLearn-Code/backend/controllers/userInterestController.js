import UserInterest from '../models/userInterestModel.js';

// Add user interest
export const addUserInterest = async (req, res) => {
  try {
    const { username, tags } = req.body;
    const userInterest = new UserInterest({ username, tags });
    await userInterest.save();
    res.status(201).json(userInterest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserInterest = async (req, res) => {
  try {
    const { username } = req.params; // Use req.params instead of req.param

    console.log(username);
    // Use findOne to get a single document that matches the username
    const userInterest = await UserInterest.findOne({ username: username });
    console.log(userInterest);
    // Check if userInterest was found
    if (userInterest) {
      res.status(200).json(userInterest);
    } else {
      res.status(404).json({ message: 'User interest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



