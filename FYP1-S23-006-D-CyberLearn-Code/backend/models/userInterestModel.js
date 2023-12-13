import mongoose from 'mongoose';

const userInterestSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
      },
      tags: [String]
    });


const UserInterest = mongoose.model('UserInterest', userInterestSchema);

export default UserInterest;
