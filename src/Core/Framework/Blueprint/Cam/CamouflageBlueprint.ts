import { MapItemPair } from './MapItemPair';
import { IBlueprint } from '../IBlueprint';
import { MapKind } from '../Items/MapKind';
import { CellPrint } from '../Items/CellPrint';

export class CamouflageBlueprint implements IBlueprint {
	public Cells: Array<CellPrint>;
	public CenterItem: CellPrint;
	public Goal: MapItemPair;
	public Patrols: MapItemPair[];
	public MapMode: MapKind;
	public PlayerName: string = '';
	constructor() {}
}
