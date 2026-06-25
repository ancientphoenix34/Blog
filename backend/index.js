const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connect } = mongoose;
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));
app.use(upload());

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await connect(process.env.MONGO_URI);
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

module.exports = app;
