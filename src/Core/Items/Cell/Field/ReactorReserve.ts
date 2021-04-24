import { Charge } from './Hq/Charge';
import { BatteryField } from './Bonus/BatteryField';
import { Headquarter } from './Hq/Headquarter';
import { ReactorField } from './Bonus/ReactorField';
import { BonusField } from './Bonus/BonusField';
import { AliveBonusField } from './Bonus/AliveBonusField';
import { Item } from '../../Item';

export class ReactorReserve {
	private _ref: any;
	constructor(private _hq: Headquarter, private _reactor: ReactorField) {
		this._ref = this.ChargeDestroyed.bind(this);
	}

	GetUsedPower() {
		return this._reactor.Charges.Values().length;
	}

	public GetTotalBatteries(): number {
		return this.GetAvailableBatteries().length + this._reactor.Charges.Values().length;
	}

	public High(): void {
		const remains = this.GetAvailableBatteries();
		if (0 < remains.length) {
			const battery = remains.shift();
			const charge = new Charge(this._hq, battery, this._reactor);
			charge.OnDestroyed.On(this._ref);
			this._reactor.Charges.Add(battery.GetCell().Coo(), charge);
			this.UpdateBonusCells(true);
		}
	}

	private ChargeDestroyed(source: any, r: Item) {
		const charge = (r as Charge).GetCell();
		charge.OnDestroyed.Off(this._ref);
		this._reactor.Charges.Remove(charge.Coo());
	}

	private UpdateBonusCells(isUp: boolean) {
		this._reactor.GetInternal().All().forEach((cell) => {
			if (cell.GetField() instanceof BonusField) {
				const bonusField = cell.GetField() as BonusField;
				if (bonusField.IsAlly(this._hq)) {
					bonusField.EnergyChanged(isUp);
				}
			} else if (cell.GetField() instanceof AliveBonusField) {
				const bonusField = cell.GetField() as AliveBonusField;
				if (!bonusField.IsEnemy(this._hq)) {
					bonusField.EnergyChanged(isUp);
				}
			}
		});
	}

	public Low(): void {
		if (this._reactor.Charges.Values().length > 0) {
			const charges = this._reactor.Charges.Values();
			let farthestCharge = charges[0];
			charges.forEach((charge) => {
				if (farthestCharge.GetDistance() < charge.GetDistance()) {
					farthestCharge = charge;
				}
			});
			farthestCharge.Destroy();
			this.UpdateBonusCells(false);
		}
	}

	public HasStock(): boolean {
		return this.GetAvailableBatteries().length > 0;
	}

	private GetAvailableBatteries(): Array<BatteryField> {
		const reactors = this._reactor
			.GetConnectedReactors()
			.map((e) => e.GetInternalBatteries())
			.reduce((a, b) => a.concat(b), new Array<BatteryField>());
		return Array.from(new Set(reactors));
	}
}
