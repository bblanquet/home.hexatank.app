import { MapKind } from '../Items/MapKind';
import { CellPrint } from '../Items/CellPrint';
import { IBlueprint } from './../IBlueprint';
export class PowerBlueprint implements IBlueprint {
	public Cells: CellPrint[];
	public MapMode: MapKind;
	public CenterItem: CellPrint;
	public Arrival: CellPrint;
	public Goal: CellPrint;
}
