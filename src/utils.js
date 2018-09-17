export function clamp(min, val, max) {
	return Math.min(max, Math.max(val, min));
}

export function getPos(anchor, offset) {
	if (anchor === '0%' && offset === '0px') {
		return `0`;
	}
	if (anchor === '0%') {
		return offset;
	}
	if (offset === '0px') {
		return anchor;
	}
	return `calc(${anchor} + ${offset})`;
}

export function getStyle({
	offsetLeft = 0,
	offsetRight = 0,
	offsetTop = 0,
	offsetBottom = 0,
	anchorLeft = 0,
	anchorRight = 1,
	anchorTop = 0,
	anchorBottom = 1,
}) {
	const anchorStyle = {
		top: `${Number.parseFloat(anchorTop * 100).toFixed(0)}%`,
		bottom: `${Number.parseFloat((1 - anchorBottom) * 100).toFixed(0)}%`,
		left: `${Number.parseFloat(anchorLeft * 100).toFixed(0)}%`,
		right: `${Number.parseFloat((1 - anchorRight) * 100).toFixed(0)}%`,
	};
	const offsetStyle = {
		top: `${offsetTop}px`,
		bottom: `${-offsetBottom}px`,
		left: `${offsetLeft}px`,
		right: `${-offsetRight}px`,
	};
	const style = {
		top: getPos(anchorStyle.top, offsetStyle.top),
		bottom: getPos(anchorStyle.bottom, offsetStyle.bottom),
		left: getPos(anchorStyle.left, offsetStyle.left),
		right: getPos(anchorStyle.right, offsetStyle.right),
	};
	return {
		anchorStyle,
		offsetStyle,
		style,
	};
}
