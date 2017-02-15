const mongoose = require('mongoose');
const assert = require('assert');
const Dishes = require('./models/dishes-1');

const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected correctly to server");

  const newDish = Dishes({
    name: 'Uthapizza',
    description: 'Test'
  });

  newDish.save(function(err) {
    if(err) throw err;
    console.log('Dish created!');

    Dishes.find({}, function(err, dishes) {
      if(err) throw err;
      console.log(dishes);

      db.collection('dishes').drop(function() {
        db.close();
      });
    });
  });
});
