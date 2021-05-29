import { DiamondHq } from '../Game/DiamondHq';
import { MapEnv } from '../MapEnv';
import { MapItem } from '../MapItem';
import { IBlueprint } from './../IBlueprint';
export class DiamondBlueprint implements IBlueprint {
	public Items: MapItem[];
	public MapMode: MapEnv;
	public CenterItem: MapItem;
	public HqDiamond: DiamondHq;
}
