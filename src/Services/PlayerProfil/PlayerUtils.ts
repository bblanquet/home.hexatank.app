export class PlayerUtils {
	private static _colors: string[] = [ '#fcba03', '#5cd1ff', '#f54ce1', '#f53361', '#6beb4b', '#5571ed', '#ed8f55' ];

	public static GetLevel(points: number): number {
		return Math.trunc(points / 50);
	}
	public static GetNextLevelPercentage(points: number): number {
		const percentage = (points % 50) * 2;
		return percentage;
	}

	public static GetColorLevel(points: number): string {
		const size = this.GetLevel(points) % this._colors.length;
		return this._colors[size];
	}
}
