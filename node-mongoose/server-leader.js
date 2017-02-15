const mongoose = require('mongoose');
const assert = require('assert');
const Leadership = require('./models/leadership');

const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected correctly to server");

  Leadership.create({
    name: "Peter Pan",
    image: "images/alberto.png",
    designation: "Chief Epicurious Officer",
    abbr: "CEO",
    description: "Our CEO, Peter, . . ."
  }, function(err, leadership) {
    console.log("Leadership created!");
    console.log(leadership);

    const id = leadership._id;

    setTimeout(function() {
      Leadership.findByIdAndUpdate(id, {
        $set: {description: 'Updated Leadership'}
      }, {
        new: true
      })
      .exec(function(err, leadership) {
        if(err) throw err;
        console.log('Updated Leadership!');
        console.log(leadership);

        db.collection('leadership').drop(function() {
          db.close();
        });
      });
    }, 3000);
  });
});
