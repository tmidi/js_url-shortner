const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/urls');

// @route       POST /api/url/shorten
// @desc        Create short url

router.post('/shorten', async(req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    // check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }

    // Create url code
    const urlCode = shortid.generate();

    // Check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            if (url) {
                url.usageCount = url.usageCount + 1;
                url.save();
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date(),
                    usageCount: 1,
                    visitCount: 0,
                });

                await url.save();
            }

        } catch (err) {
            console.error(err)
            res.status(500).json('Server Error');
        }
    } else {
        res.status(401).json('Invalid long url')
    }

})

module.exports = router;