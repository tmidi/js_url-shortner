const mongoose = require('mongoose')
const urlSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    usageCount: Number,
    visitCount: Number,
    date: { type: String, default: Date.now }
});

module.exports = mongoose.model('url', urlSchema, 'url');