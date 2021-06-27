import { DiamondHq } from '../Game/DiamondHq';
import { MapEnv } from '../Items/MapEnv';
import { MapItem } from '../Items/MapItem';
import { IBlueprint } from './../IBlueprint';
export class DiamondBlueprint implements IBlueprint {
	public Items: MapItem[];
	public MapMode: MapEnv;
	public CenterItem: MapItem;
	public HqDiamond: DiamondHq;
}
