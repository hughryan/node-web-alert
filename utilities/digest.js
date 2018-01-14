const crypto = require('crypto');

module.exports = (data) => {
	const hash = crypto.createHash('sha256');

	hash.update(data);
	return hash.digest('hex');
};
