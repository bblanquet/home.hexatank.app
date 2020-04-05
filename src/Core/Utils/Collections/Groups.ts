import { Dictionnary } from './Dictionnary';
export class Groups<TData> {
	private _list: Dictionnary<Array<TData>>;

	constructor() {
		this._list = new Dictionnary<Array<TData>>();
	}

	public Add(key: string, data: TData) {
		if (this._list.Exist(key)) {
			this._list.Get(key).push(data);
		} else {
			this._list.Add(key, [ data ]);
		}
	}

	public New(key: string) {
		if (!this._list.Exist(key)) {
			this._list.Add(key, []);
		}
	}

	public Keys(): string[] {
		return this._list.Keys();
	}

	public Get(key: string): TData[] {
		return this._list.Get(key);
	}

	public Any(): boolean {
		return !this._list.IsEmpty();
	}

	public Exist(key: string): boolean {
		return this._list.Exist(key);
	}
}
