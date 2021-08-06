import { MapKind } from '../Items/MapKind';
import { CellPrint } from '../Items/CellPrint';
import { IBlueprint } from '../IBlueprint';
export class SmallBlueprint implements IBlueprint {
	public Cells: CellPrint[];
	public MapMode: MapKind;
	public CenterItem: CellPrint;
	public Departure: CellPrint;
	public Goal: CellPrint;
}
