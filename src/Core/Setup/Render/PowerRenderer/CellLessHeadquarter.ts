import { Identity } from '../../../Items/Identity';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { IHeadquarter } from '../../../Items/Cell/Field/Hq/IHeadquarter';
import { Cell } from '../../../Items/Cell/Cell';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { Item } from '../../../Items/Item';
import { BatteryField } from '../../../Items/Cell/Field/Bonus/BatteryField';
import { FlagCell } from '../../../Items/Cell/FlagCell';
import { ISelectable } from '../../../ISelectable';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';

export class CellLessHeadquarter implements IHeadquarter {
	private _reactors: Array<ReactorField> = new Array<ReactorField>();
	private _batteryFields: Array<BatteryField> = new Array<BatteryField>();

	Identity: Identity;

	OnCashMissing: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	OnTruckChanged: LiteEvent<number> = new LiteEvent<number>();
	OnVehicleCreated: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	OnDiamondCountChanged: LiteEvent<number> = new LiteEvent<number>();
	OnDiamondEarned: LiteEvent<number> = new LiteEvent<number>();
	OnFieldCountchanged: LiteEvent<number> = new LiteEvent<number>();
	OnFieldAdded: LiteEvent<Cell> = new LiteEvent<Cell>();
	OnEnergyChanged: LiteEvent<number> = new LiteEvent<number>();
	OnReactorConquested: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	OnReactorAdded: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	OnReactorLost: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	OnTankRequestChanged: LiteEvent<number> = new LiteEvent<number>();
	Earn(amount: number): void {}
	Flagcell: FlagCell;
	public AddBatteryField(energyField: BatteryField): void {
		this._batteryFields.push(energyField);
		const reactors = this._reactors.filter((c) => c.IsCovered(energyField.GetCell()));
		if (reactors.length === 1) {
			reactors[0].PowerUp();
		}
	}

	public GetBatteryFields(): Array<BatteryField> {
		this._batteryFields = this._batteryFields.filter((b) => b.IsUpdatable);
		return this._batteryFields;
	}
	public AddReactor(reactor: ReactorField): void {
		this._reactors.push(reactor);
		this.OnReactorAdded.Invoke(this, reactor);
		reactor.OnPowerChanged.On((src: any, data: boolean) => {
			this.OnEnergyChanged.Invoke(this, 0);
		});
		reactor.OnLost.On((e: any, ie: ReactorField) => {
			this._reactors = this._reactors.filter((v) => v !== ie);
			this.OnReactorLost.Invoke(this, ie);
			this.OnEnergyChanged.Invoke(this, 0);
		});
	}
	GetCell(): Cell {
		return null;
	}
	IsEnemy(item: Identity): boolean {
		return this.Identity.IsEnemy(item);
	}
	IsCovered(cell: Cell): boolean {
		return this._reactors.filter((c) => c.IsCovered(cell)).length > 0;
	}

	GetTotalEnergy(): number {
		return this._batteryFields.length;
	}
	Buy(amount: number): boolean {
		return true;
	}
	AddTruckRequest(): void {}
	AddTankRequest(): void {}
	public GetReactorsCount(): number {
		return this._reactors.length;
	}

	public GetReactors(): Array<ReactorField> {
		return this._reactors;
	}
	AddField(field: Item, cell: Cell): void {
		this.OnFieldAdded.Invoke(this, cell);
	}
	GetCellEnergy(coo: HexAxial): number {
		let result = 0;
		this._reactors.forEach((r) => {
			if (r.GetInternal().Exist(coo.ToString())) {
				result += r.GetPower();
			}
		});
		return result;
	}
	GetVehicleCount(): number {
		return 1;
	}
	IsIa(): boolean {
		return false;
	}
}
