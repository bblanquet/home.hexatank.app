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
}
