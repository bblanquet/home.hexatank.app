import { DiamondHq } from '../Game/DiamondHq';
import { MapKind } from '../Items/MapKind';
import { CellPrint } from '../Items/CellPrint';
import { IBlueprint } from './../IBlueprint';
export class DiamondBlueprint implements IBlueprint {
	public Cells: CellPrint[];
	public MapMode: MapKind;
	public CenterItem: CellPrint;
	public HqDiamond: DiamondHq;
}
