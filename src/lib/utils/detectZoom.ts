export function isWindows125Zoom(): boolean {
	if (typeof window === 'undefined') return false;

	const isWindows = navigator.userAgent.includes('Windows');
	const zoom = window.devicePixelRatio;
	return isWindows && Math.abs(zoom - 1.25) < 0.05;
} 