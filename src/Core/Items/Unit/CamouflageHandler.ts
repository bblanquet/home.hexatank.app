import { Archive } from '../../Framework/ResourceArchiver';
import { GameHelper } from '../../Framework/GameHelper';
import { MapMode } from '../../Setup/Generator/MapMode';

export class CamouflageHandler {
	public static GetCamouflage(): string {
		const random = Math.floor(Math.random() * 2) + 1;
		if (GameHelper.MapContext.MapMode === MapMode.forest) {
			return random === 1 ? Archive.nature.tree : Archive.nature.rock;
		} else if (GameHelper.MapContext.MapMode === MapMode.sand) {
			return random === 1 ? Archive.nature.sandRock : Archive.nature.palmTree;
		} else if (GameHelper.MapContext.MapMode === MapMode.ice) {
			return random === 1 ? Archive.nature.iceTree : Archive.nature.rock;
		}
	}
}
