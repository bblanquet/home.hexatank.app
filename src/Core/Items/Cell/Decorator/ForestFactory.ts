import { DecoratingElement } from './DecoratingElement';
import { CellType } from '../../../Framework/Blueprint/Items/CellType';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { MapKind } from '../../../Framework/Blueprint/Items/MapKind';

export class DecoratingFactory {
	public static Obstacles: Dictionary<DecoratingElement[]> = Dictionary.New([
		{
			key: MapKind[MapKind.forest],
			value: [
				new DecoratingElement(CellType.Rock),
				new DecoratingElement(CellType.Tree),
				new DecoratingElement(CellType.DarkTree),
				new DecoratingElement(CellType.Water),
				new DecoratingElement(CellType.Volcano, 1)
			]
		},
		{
			key: MapKind[MapKind.ice],
			value: [
				new DecoratingElement(CellType.IceRock),
				new DecoratingElement(CellType.IceTree),
				new DecoratingElement(CellType.IceTree2),
				new DecoratingElement(CellType.Volcano, 1)
			]
		},
		{
			key: MapKind[MapKind.sand],
			value: [
				new DecoratingElement(CellType.SandRock),
				new DecoratingElement(CellType.palmTree),
				new DecoratingElement(CellType.SandCactus),
				new DecoratingElement(CellType.Water)
			]
		}
	]);

	public static Decorations: Dictionary<DecoratingElement[]> = Dictionary.New([
		{
			key: MapKind[MapKind.forest],
			value: [
				new DecoratingElement(CellType.Stone),
				new DecoratingElement(CellType.Bush),
				new DecoratingElement(CellType.Leaf),
				new DecoratingElement(CellType.Leaf2)
			]
		},
		{
			key: MapKind[MapKind.ice],
			value: [
				new DecoratingElement(CellType.IceStone),
				new DecoratingElement(CellType.IcePlants),
				new DecoratingElement(CellType.IcePlants2)
			]
		},
		{
			key: MapKind[MapKind.sand],
			value: [
				new DecoratingElement(CellType.SandStone),
				new DecoratingElement(CellType.SandCactusPlants),
				new DecoratingElement(CellType.Bush),
				new DecoratingElement(CellType.SandPlants),
				new DecoratingElement(CellType.WhiteSkull)
			]
		}
	]);
}
