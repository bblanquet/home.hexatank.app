import { Identity, Relationship } from './../../../Identity';
import { HexAxial } from '../../../../../Utils/Geometry/HexAxial';
import { ReactorField } from '../Bonus/ReactorField';
import { Cell } from '../../Cell';
import { Item } from '../../../Item';
import { BatteryField } from '../Bonus/BatteryField';
import { ISelectable } from '../../../../ISelectable';
import { LiteEvent } from '../../../../../Utils/Events/LiteEvent';
import { Vehicle } from '../../../Unit/Vehicle';

export interface IHeadquarter {
	OnCashMissing: LiteEvent<Boolean>;
	OnDiamondCountChanged: LiteEvent<number>;
	OnDiamondEarned: LiteEvent<number>;

	OnVehicleCreated: LiteEvent<Vehicle>;

	OnFieldCountchanged: LiteEvent<number>;
	OnFieldAdded: LiteEvent<Cell>;
	OnEnergyChanged: LiteEvent<number>;

	OnReactorConquested: LiteEvent<ReactorField>;
	OnReactorAdded: LiteEvent<ReactorField>;
	OnReactorLost: LiteEvent<ReactorField>;

	OnSelectionChanged: LiteEvent<ISelectable>;

	Identity: Identity;
	GetRelation(id: Identity): Relationship;
	GetVehicles(): Vehicle[];

	Buy(amount: number): boolean;
	Earn(amount: number): void;
	BuyTank(): void;
	BuyTruck(): void;
	AddField(field: Item, cell: Cell): void;
	AddBatteryField(energyField: BatteryField): void;
	GetVehicleCount(): number;

	IsCovered(cell: Cell): boolean;
	GetCellEnergy(coo: HexAxial): number;
	GetTotalEnergy(): number;
	GetIdentity(): Identity;

	GetBatteryFields(): Array<BatteryField>;
	GetReactors(): Array<ReactorField>;
	GetReactorsCount(): number;
	AddReactor(reactor: ReactorField): void;

	GetCell(): Cell;
	IsIa(): boolean;
}
