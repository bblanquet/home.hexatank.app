import { CellContext } from './../CellContext';
import { BatteryField } from './Bonus/BatteryField';
import { Headquarter } from './Hq/Headquarter';
import { ReactorField } from './Bonus/ReactorField';
import { BonusField } from './Bonus/BonusField';
import { AliveBonusField } from './Bonus/AliveBonusField';
import { Cell } from '../Cell';

export class Battery {
	private _batteryFields: Array<BatteryField> = new Array<BatteryField>();

	constructor(private _hq: Headquarter, private _field: ReactorField) {}

	GetUsedPower() {
		return this._batteryFields.length;
	}

	public GetTotalBatteries(): number {
		return this.GetRemains().length + this._batteryFields.length;
	}

	public High(): void {
		const remains = this.GetRemains();
		if (0 < remains.length) {
			const battery = remains.shift();
			battery.SetUsed(true);
			this._batteryFields.push(battery);
			this.UpdateBonusCells(true);
		}
	}

	public ForceHigh(battery: BatteryField): void {
		this._batteryFields.push(battery);
		this.UpdateBonusCells(true);
	}

	private UpdateBonusCells(isUp: boolean) {
		this._field.GetInternal().All().forEach((cell) => {
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
		if (this._batteryFields.length > 0) {
			const battery = this._batteryFields.shift();
			battery.SetUsed(false);
			this.UpdateBonusCells(false);
		}
	}

	public HasStock(): boolean {
		return this.GetRemains().length > 0;
	}

	private GetRemains(): Array<BatteryField> {
		return this.GetRemainingBatteries(this.GetCells(this.GetNearbyReactors()));
	}

	private GetRemainingBatteries(cells: CellContext<Cell>): Array<BatteryField> {
		const result = new Array<BatteryField>();
		this._hq.GetBatteryFields().filter((f) => !f.IsUsed()).forEach((battery) => {
			if (cells.Exist(battery.GetCell().GetHexCoo())) {
				result.push(battery);
			}
		});
		return result;
	}

	private GetCells(reactors: Array<ReactorField>): CellContext<Cell> {
		const result = new CellContext<Cell>();
		reactors.forEach((r) => {
			r.GetInternal().All().forEach((cell) => {
				if (!result.Exist(cell.GetHexCoo())) {
					result.Add(cell);
				}
			});
		});
		return result;
	}

	private GetNearbyReactors(): Array<ReactorField> {
		const result = new Array<ReactorField>();
		const internal = this._field.GetInternal();
		this._hq.GetReactors().forEach((reactor) => {
			if (internal.Exist(reactor.GetCell().GetHexCoo())) {
				result.push(reactor);
			}
		});
		return result;
	}
}
