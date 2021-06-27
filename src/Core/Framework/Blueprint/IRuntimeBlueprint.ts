import { CellPrint } from './Items/CellPrint';
import { VehiclePrint } from './Items/VehiclePrint';

export interface IRuntimeBlueprint {
	Cells: Array<CellPrint>;
	Vehicles: Array<VehiclePrint>;
}
