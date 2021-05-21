import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export default (img1, img2, threshold) => {
	const img1png = PNG.sync.read(img1);
	const img2png = PNG.sync.read(img2);

	if (img1png.width !== img2png.width || img1png.height !== img2png.height) {
		console.log('Image sizes did not match during comparison');
		return {
			pixels: Math.abs(img1png.width - img2png.width) + Math.abs(img1png.height - img2png.height),
			image: null,
		};
	}

	const diff = new PNG({ width: img1png.width, height: img1png.height });
	const options = {
		threshold,
		includeAA: false,
	};
	const numDiffPixels = pixelmatch(
		img1png.data,
		img2png.data,
		diff.data,
		img1png.width,
		img1png.height,
		options,
	);

	return {
		pixels: numDiffPixels,
		image: PNG.sync.write(diff),
	};
};
