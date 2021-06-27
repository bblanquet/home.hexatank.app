import { MapKind } from './Items/MapKind';
import { CellPrint } from './Items/CellPrint';

export interface IBlueprint {
	Cells: Array<CellPrint>;
	MapMode: MapKind;
}
