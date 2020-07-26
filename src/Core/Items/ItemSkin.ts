export class ItemSkin {
	constructor(
		private _tankBottom: string,
		private _tankTop: string,
		private _truck: string,
		private _hq: string,
		private _hqField: string,
		private _area: string,
		private _light: string,
		private _reactor: string
	) {}

	public GetTopTankSprite(): string {
		return this._tankTop;
	}

	public GetBottomTankSprite(): string {
		return this._tankBottom;
	}

	public GetTruck(): string {
		return this._truck;
	}

	public GetHq(): string {
		return this._hq;
	}

	public GetHqCell(): string {
		return this._hqField;
	}

	public GetLight(): string {
		return this._light;
	}

	public GetArea(): string {
		return this._area;
	}
	public GetReactor(): string {
		return this._reactor;
	}
}
