require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();
// const PORT = 3001;

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));
app.use('/api', router);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
mongoose.connection.once('open', function() {
  console.log('Connected to the Database.');
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}.`);
});
