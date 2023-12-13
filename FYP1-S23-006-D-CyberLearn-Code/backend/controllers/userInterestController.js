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
    const userInterest = UserInterest.find(username)
    res.status(201).json(userInterest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

