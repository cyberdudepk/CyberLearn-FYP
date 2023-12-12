import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routes/user.route.js';
import courseRouter from './controllers/course.js';
import path from 'path';
import cors from 'cors';


const app = express();
const port = 4000;
const __dirname = path.resolve(path.dirname(''));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
const mongoURI = 'mongodb://127.0.0.1:27017/cyberLearn';
const connection = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true })
      .then(() => {
        console.log('Connected to MongoDB')
      });
  } catch (err) {
    console.log(err)
  }
}


connection()

// Start the server after connecting to MongoDB
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json())
app.use("/users", userRouter)
app.use("/courses", courseRouter)

app.get('/uploads/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName.replace(/\\/g, '/'));
  res.sendFile(filePath);
});


;
