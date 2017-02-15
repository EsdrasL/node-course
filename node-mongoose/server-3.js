const mongoose = require('mongoose');
const assert = require('assert');
const Dishes = require('./models/dishes-3');

const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected correctly to server");

  Dishes.create({
    name: 'Uthapizza',
    description: 'Test',
    comments: [
      {
        rating: 3,
        comment: 'This is insane',
        author: 'Matt'
      }
    ]
  }, function(err, dish) {
    if(err) throw err;
    console.log('Dish created!');
    console.log(dish);

    const id = dish._id;

    setTimeout(function() {
      Dishes.findByIdAndUpdate(id, {
        $set: {description: 'Updated Test'}
      }, {
        new: true
      })
      .exec(function(err, dish) {
        if(err) throw err;
        console.log('Updated Dish!');
        console.log(dish);

        dish.comments.push({
          rating: 5,
          comment: 'I\'m getting a sinking feeling!',
          author: 'Leonardo'
        });

        dish.save(function(err, dish) {
          console.log('Updated Comments!');
          console.log(dish);

          db.collection('dishes').drop(function() {
            db.close();
          });
        });
      });
    }, 3000);
  });
});
