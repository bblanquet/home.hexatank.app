import { IBlueprint } from '../IBlueprint';
import { MapKind } from '../Items/MapKind';
import { CellPrint } from '../Items/CellPrint';
import { DiamondHq } from './DiamondHq';

export class GameBlueprint implements IBlueprint {
	public Cells: Array<CellPrint>;
	public CenterItem: CellPrint;
	public Hqs: Array<DiamondHq>;
	public MapMode: MapKind;
	public PlayerName: string = '';
	constructor() {}
}
