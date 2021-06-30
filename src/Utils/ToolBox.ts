export function isNullOrUndefined(obj: any): boolean {
	return typeof obj === 'undefined' || obj === null;
}

export function IsMobile(): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
