import { ISelectable } from '../../../ISelectable';
import { Cell } from '../../../Items/Cell/Cell';
import { BatteryField } from '../../../Items/Cell/Field/Bonus/BatteryField';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { FlagCell } from '../../../Items/Cell/FlagCell';
import { Identity, Relationship } from '../../../Items/Identity';
import { Item } from '../../../Items/Item';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { IHeadquarter } from '../../../Items/Cell/Field/Hq/IHeadquarter';
export class FakeHeadquarter implements IHeadquarter {
	OnCashMissing: LiteEvent<Boolean>;
	OnDiamondCountChanged: LiteEvent<number>;
	OnDiamondEarned: LiteEvent<number>;
	OnVehicleCreated: LiteEvent<Vehicle>;
	OnTruckChanged: LiteEvent<number>;
	OnTankRequestChanged: LiteEvent<number>;
	OnFieldCountchanged: LiteEvent<number>;
	OnFieldAdded: LiteEvent<Cell>;
	OnEnergyChanged: LiteEvent<number>;
	OnReactorConquested: LiteEvent<ReactorField>;
	OnReactorAdded: LiteEvent<ReactorField>;
	OnReactorLost: LiteEvent<ReactorField>;
	OnSelectionChanged: LiteEvent<ISelectable>;
	Identity: Identity;

	GetVehicles(): Vehicle[] {
		throw new Error('Method not implemented.');
	}
	GetRelation(id: Identity): Relationship {
		throw new Error('Method not implemented.');
	}
	Buy(amount: number): boolean {
		throw new Error('Method not implemented.');
	}
	Earn(amount: number): void {
		throw new Error('Method not implemented.');
	}
	AddTruckRequest(): void {
		throw new Error('Method not implemented.');
	}
	AddTankRequest(): void {
		throw new Error('Method not implemented.');
	}
	AddField(field: Item, cell: Cell): void {
		throw new Error('Method not implemented.');
	}
	AddBatteryField(energyField: BatteryField): void {
		throw new Error('Method not implemented.');
	}
	GetVehicleCount(): number {
		throw new Error('Method not implemented.');
	}
	IsCovered(cell: Cell): boolean {
		throw new Error('Method not implemented.');
	}
	GetCellEnergy(coo: HexAxial): number {
		return 5;
	}
	GetTotalEnergy(): number {
		throw new Error('Method not implemented.');
	}
	GetBatteryFields(): BatteryField[] {
		throw new Error('Method not implemented.');
	}
	GetReactors(): ReactorField[] {
		throw new Error('Method not implemented.');
	}
	GetReactorsCount(): number {
		throw new Error('Method not implemented.');
	}
	AddReactor(reactor: ReactorField): void {
		throw new Error('Method not implemented.');
	}
	GetCell(): Cell {
		throw new Error('Method not implemented.');
	}
	IsIa(): boolean {
		throw new Error('Method not implemented.');
	}
	Flagcell: FlagCell;
}
