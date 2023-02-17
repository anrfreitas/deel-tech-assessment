const NodeCache = require('node-cache');
const config = require('../config/config');
const cache = new NodeCache();

const getProfile = async (req, res, next) => {
    const key = `middleware.profile.${req.get('profile_id')}`;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        console.log(`Cache hit for ${key}`);
        req.profile = cachedResponse;
        next();
    } else {
        console.log(`Cache miss for ${key}`);
        const { Profile } = req.app.get('models')
        const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0}})
        if(!profile)
            return res.status(401).end()
        req.profile = profile
        cache.set(key, profile, config.MIDDLEWARE_CACHE_TTL);
        next()
    }
}
module.exports = { getProfile }