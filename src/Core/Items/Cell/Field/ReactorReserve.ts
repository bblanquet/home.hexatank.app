import { ElectronNetwork } from './Hq/ElectronNetwork';
import { BatteryField } from './Bonus/BatteryField';
import { Headquarter } from './Hq/Headquarter';
import { ReactorField } from './Bonus/ReactorField';
import { BonusField } from './Bonus/BonusField';
import { AliveBonusField } from './Bonus/AliveBonusField';

export class ReactorReserve {
	private _batteryFields: Array<BatteryField> = new Array<BatteryField>();

	constructor(private _hq: Headquarter, private _reactor: ReactorField) {}

	GetUsedPower() {
		return this._batteryFields.length;
	}

	public GetTotalBatteries(): number {
		return this.GetAvailableBatteries().length + this._batteryFields.length;
	}

	public High(): void {
		const remains = this.GetAvailableBatteries();
		if (0 < remains.length) {
			const battery = remains.shift();
			battery.SetElectron(new ElectronNetwork(this._hq, battery, this._reactor));
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
		if (this._batteryFields.length > 0) {
			const battery = this._batteryFields.shift();
			battery.SetUsed(false);
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
