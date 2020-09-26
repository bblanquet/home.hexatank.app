export class Dictionnary<T> {
	private _values: { [id: string]: T } = {};

	Values(): T[] {
		var all = new Array<T>();
		for (var key in this._values) {
			all.push(<T>(<unknown>this._values[key]));
		}
		return all;
	}

	Keys(): string[] {
		var all = new Array<string>();
		for (var key in this._values) {
			all.push(key);
		}
		return all;
	}

	Count(): number {
		return Object.keys(this._values).length;
	}

	public Clear(): void {
		this._values = {};
	}

	Add(key: string, value: T): void {
		this._values[key] = value;
	}

	Remove(key: string) {
		this._values[key] = null;
		delete this._values[key];
	}

	Get(key: string): T {
		if (key in this._values) {
			return this._values[key];
		} else {
			return null;
		}
	}

	IsEmpty(): boolean {
		for (var prop in this._values) {
			if (this._values.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}

	Exist(Key: string): boolean {
		return Key in this._values;
	}

	public SetValues(jsObj: { [id: string]: T }) {
		this._values = jsObj;
	}

	public GetValues(): { [id: string]: T } {
		return this._values;
	}

	public static To<T>(key: (d: T) => string, list: T[]): Dictionnary<T> {
		const dictionnary = new Dictionnary<T>();
		list.forEach((item) => {
			dictionnary.Add(key(item), item);
		});
		return dictionnary;
	}
}
