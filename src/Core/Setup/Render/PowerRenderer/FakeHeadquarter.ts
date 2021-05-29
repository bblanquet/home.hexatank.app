import { Identity } from './../../../Items/Identity';
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

export class FakeHeadquarter implements IHeadquarter {
	Identity: Identity;

	OnCashMissing: LiteEvent<Boolean>;
	OnTruckChanged: LiteEvent<number>;
	OnVehicleCreated: LiteEvent<Vehicle>;
	OnDiamondCountChanged: LiteEvent<number>;
	OnDiamondEarned: LiteEvent<number>;
	OnFieldCountchanged: LiteEvent<number>;
	OnFieldAdded: LiteEvent<Cell>;
	OnEnergyChanged: LiteEvent<number>;
	OnReactorConquested: LiteEvent<ReactorField>;
	OnReactorAdded: LiteEvent<ReactorField>;
	OnReactorLost: LiteEvent<ReactorField>;
	OnSelectionChanged: LiteEvent<ISelectable>;
	OnTankRequestChanged: LiteEvent<number>;
	Earn(amount: number): void {
		throw new Error('Method not implemented.');
	}
	AddBatteryField(energyField: BatteryField): void {
		throw new Error('Method not implemented.');
	}
	Flagcell: FlagCell;
	GetBatteryFields(): BatteryField[] {
		throw new Error('Method not implemented.');
	}
	AddReactor(reactor: ReactorField): void {
		throw new Error('Method not implemented.');
	}
	GetCell(): Cell {
		throw new Error('Method not implemented.');
	}
	IsEnemy(item: Identity): boolean {
		throw new Error('Method not implemented.');
	}
	IsCovered(cell: Cell): boolean {
		throw new Error('Method not implemented.');
	}

	GetTotalEnergy(): number {
		throw new Error('Method not implemented.');
	}
	Buy(amount: number): boolean {
		throw new Error('Method not implemented.');
	}
	AddTruckRequest(): void {
		throw new Error('Method not implemented.');
	}
	AddTankRequest(): void {
		throw new Error('Method not implemented.');
	}
	GetReactors(): ReactorField[] {
		throw new Error('Method not implemented.');
	}
	GetReactorsCount(): number {
		throw new Error('Method not implemented.');
	}
	AddField(field: Item, cell: Cell): void {
		throw new Error('Method not implemented.');
	}
	GetCellEnergy(coo: HexAxial): number {
		return 1;
	}
	GetVehicleCount(): number {
		throw new Error('Method not implemented.');
	}
	IsIa(): boolean {
		throw new Error('Method not implemented.');
	}
}
