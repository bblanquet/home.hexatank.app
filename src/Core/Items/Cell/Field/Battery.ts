import { Headquarter } from './Hq/Headquarter';
import { Reactor } from './Bonus/Reactor';
import { BonusField } from './Bonus/BonusField';
import { AliveBonusField } from './Bonus/AliveBonusField';

export class Battery {
	private _usedEnergy: number = 0;

	constructor(private _hq: Headquarter, private _field: Reactor) {}

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

		return extenalEnergy + this._field.GetInternalEnergy();
	}

	public High(): void {
		if (this.HasInternalStock() || this.TryToGetExternalEnergy()) {
			this._usedEnergy += 1;
			this._field.GetArea().All().forEach((cell) => {
				if (cell.GetField() instanceof BonusField) {
					const bonusField = cell.GetField() as BonusField;
					if (bonusField.IsAlly(this._hq)) {
						bonusField.EnergyChanged(true);
					}
				} else if (cell.GetField() instanceof AliveBonusField) {
					const bonusField = cell.GetField() as AliveBonusField;
					if (!bonusField.IsEnemy(this._hq)) {
						bonusField.EnergyChanged(true);
					}
				}
			});
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
		if (this._usedEnergy > 0) {
			this._usedEnergy -= 1;
			this._field.GetArea().All().forEach((cell) => {
				if (cell.GetField() instanceof BonusField) {
					const bonusField = cell.GetField() as BonusField;
					if (bonusField.IsAlly(this._hq)) {
						bonusField.EnergyChanged(false);
					}
				} else if (cell.GetField() instanceof AliveBonusField) {
					const bonusField = cell.GetField() as AliveBonusField;
					if (!bonusField.IsEnemy(this._hq)) {
						bonusField.EnergyChanged(false);
					}
				}
			});
		}
	}

	public GetCurrentPower(): number {
		return this._usedEnergy;
	}

	public ReducePower(): void {}

	public HasStock(): boolean {
		const power = this.GetTotalPower();
		if (this._usedEnergy > power) {
			throw 'should not happen';
		}

		return this._usedEnergy < power;
	}

	private HasInternalStock(): boolean {
		if (this._usedEnergy > this.GetInternalEnergy()) {
			throw 'should not happen';
		}

		return this._usedEnergy < this.GetInternalEnergy();
	}

	public GetInternalStock(): number {
		if (this._usedEnergy > this.GetInternalEnergy()) {
			throw 'should not happen';
		}

		return this.GetInternalEnergy() - this._usedEnergy;
	}

	public GetInternalEnergy(): number {
		return this._field.GetInternalEnergy();
	}
}
