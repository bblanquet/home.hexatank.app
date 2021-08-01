export class Vibrator {
	public static Vibrate(): void {
		if (!this.IsiOS()) {
			navigator.vibrate([ 50 ]);
		}
	}

	private static IsiOS(): boolean {
		return (
			[ 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod' ].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		);
	}
}
