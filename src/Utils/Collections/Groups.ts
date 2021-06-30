import { Dictionary } from './Dictionary';
export class Groups<TData> {
	private _list: Dictionary<Array<TData>>;

	constructor() {
		this._list = new Dictionary<Array<TData>>();
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

	public Values(): TData[] {
		return this._list.Values().reduce((a, b) => a.concat(b), new Array<TData>());
	}

	public Get(key: string): TData[] {
		return this._list.Get(key);
	}

	public Any(): boolean {
		return !this._list.IsEmpty();
	}

	public Count(): number {
		return this.Keys().length;
	}

	public Exist(key: string): boolean {
		return this._list.Exist(key);
	}
}
