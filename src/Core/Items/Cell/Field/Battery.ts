import { Headquarter } from './Hq/Headquarter';
import { InfluenceField } from './Bonus/InfluenceField';

export class Battery {
	private _usedEnergy: number = 1;
	private _internalEnergy: number = 1;

	constructor(private _hq: Headquarter, private _field: InfluenceField) {}

	GetUsedPower() {
		return this._usedEnergy;
	}

	public GetTotalPower(): number {
		const externalFields = this._hq
			.GetInfluence()
			.filter((f) => f !== this._field)
			.filter((f) => f.GetArea().Exist(this._field.GetCell().GetCoordinate()));

		const externalStockfields = externalFields.filter((f) => f.Battery.HasInternalStock());

		const extenalEnergy = externalStockfields
			.map((f) => f.Battery.GetInternalStock())
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		return extenalEnergy + this._internalEnergy;
	}

	public High(): void {
		if (this.HasInternalStock()) {
			this._usedEnergy += 1;
		} else if (this.TryToGetExternalEnergy()) {
			this.AddPower();
			this._usedEnergy += 1;
		} else {
			if (this._hq.Buy(1)) {
				this.AddPower();
				this._usedEnergy += 1;
			}
		}
	}

	private TryToGetExternalEnergy(): boolean {
		const field = this._hq
			.GetInfluence()
			.filter((f) => f !== this._field)
			.filter((f) => f.Battery.HasInternalStock())
			.filter((f) => f.GetArea().Exist(this._field.GetCell().GetCoordinate()))
			.sort((one, two) => (one.Battery.GetInternalStock() > two.Battery.GetInternalStock() ? -1 : 1));

		if (field.length > 0) {
			field[0].Battery.ReducePower();
			return true;
		} else {
			return false;
		}
	}

	public Low(): void {
		if (this._usedEnergy > 1) {
			this._usedEnergy -= 1;
		}
	}

	public GetCurrentPower(): number {
		return this._usedEnergy;
	}

	public AddPower(): void {
		this._internalEnergy += 1;
	}

	public ReducePower(): void {
		if (this._internalEnergy < 1) {
			throw 'should not happen';
		}
		this._internalEnergy -= 1;
	}

	public HasStock(): boolean {
		const power = this.GetTotalPower();
		if (this._usedEnergy > power) {
			throw 'should not happen';
		}

		return this._usedEnergy < power;
	}

	private HasInternalStock(): boolean {
		if (this._usedEnergy > this._internalEnergy) {
			throw 'should not happen';
		}

		return this._usedEnergy < this._internalEnergy;
	}

	public GetInternalStock(): number {
		if (this._usedEnergy > this._internalEnergy) {
			throw 'should not happen';
		}

		return this._internalEnergy - this._usedEnergy;
	}

	public GetInternalEnergy(): number {
		return this._internalEnergy;
	}
}
