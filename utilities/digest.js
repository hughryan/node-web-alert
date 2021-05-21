import crypto from 'crypto';

export default (data) => {
	const hash = crypto.createHash('sha256');

	hash.update(data);
	return hash.digest('hex');
};
