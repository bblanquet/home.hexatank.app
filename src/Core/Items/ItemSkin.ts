export class ItemSkin {
	constructor(
		private _tankBottom: string,
		private _tankTop: string,
		private _truck: string,
		private _color: string,
		private _cell: string,
		private _energyBase: string,
		private _energy: string,
		private _energyArea: string
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
		return this._color;
	}

	public GetCell(): string {
		return this._cell;
	}

	public GetEnergy(): string {
		return this._energy;
	}

	public GetBaseEnergy(): string {
		return this._energyBase;
	}

	public GetAreaEnergy(): string {
		return this._energyArea;
	}
}
