const NodeCache = require('node-cache');

const cache = new NodeCache();

module.exports = duration => (req, res, next) => {
    if (req.method !== 'GET') return next;
    const profileId =  req.get('profile_id')

    const key = `${req.originalUrl}.profile.${profileId}`;

    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`Cache hit for ${key}`);
        res.json(cachedResponse);
    }

    else {
        console.log(`Cache miss for ${key}`);
        res.originalJson = res.json;
        res.json = body => {
            res.originalJson(body);
            cache.set(key, body, duration);
        };
        next();
    }
}