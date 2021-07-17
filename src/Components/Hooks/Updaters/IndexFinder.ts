export class IndexFinder {
	public GetIndex(value: number, list: number[]): number | null {
		let low = 0;
		let high = list.length - 1;
		while (1 < high - low) {
			let mid = Math.floor((low + high) / 2);
			if (list[mid] < value) {
				low = mid;
			} else {
				high = mid;
			}
		}

		if (list[high] < value) {
			return high;
		}

		if (list[low] < value) {
			return low;
		}
		return null;
	}
}
