const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.model('Venue', VenueSchema);