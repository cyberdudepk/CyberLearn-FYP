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

// Add user interest
export const getUserInterest = async (req, res) => {
  try {
    const { username } = req.body;
    // Assuming UserInterest.find is an async operation
    const userInterest = await UserInterest.find(username);
    
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


