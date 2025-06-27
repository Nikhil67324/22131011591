const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/ShortUrl');
const geo = require('geoip-lite');

function generateUniqueCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

router.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || !/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  const code = shortcode || generateUniqueCode();
  const expiryDate = new Date(Date.now() + validity * 60000);

  try {
    if (shortcode && await ShortUrl.findOne({ shortcode })) {
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const newShort = new ShortUrl({
      originalUrl: url,
      shortcode: code,
      expiresAt: expiryDate,
    });

    await newShort.save();

    res.status(201).json({
      shortLink: `http://${req.headers.host}/${code}`,
      expiry: expiryDate.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const referrer = req.get('Referrer') || 'direct';
  const ip = req.ip;
  const location = geo.lookup(ip)?.country || 'unknown';

  const entry = await ShortUrl.findOne({ shortcode });

  if (!entry)
    return res.status(404).json({ error: 'Shortcode does not exist' });

  if (new Date() > entry.expiresAt)
    return res.status(410).json({ error: 'Shortcode has expired' });

  entry.clicks.push({ referrer, location });
  await entry.save();

  res.redirect(entry.originalUrl);
});

router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;

  const entry = await ShortUrl.findOne({ shortcode });

  if (!entry)
    return res.status(404).json({ error: 'Shortcode not found' });

  res.status(200).json({
    originalUrl: entry.originalUrl,
    shortcode: entry.shortcode,
    createdAt: entry.createdAt.toISOString(),
    expiresAt: entry.expiresAt.toISOString(),
    totalClicks: entry.clicks.length,
    clicks: entry.clicks,
  });
});

module.exports = router;
