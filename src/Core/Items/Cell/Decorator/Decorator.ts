import { BlockingField } from '../Field/BlockingField';
import { VolcanoField } from '../Field/VolcanoField';
import { WaterField } from '../Field/WaterField';
import { Cell } from '../Cell';
import { CellType } from '../../../Framework/Blueprint/Items/CellType';
import { SvgArchive } from '../../../Framework/SvgArchiver';

export abstract class Decorator {
	public static Decorate(cell: Cell, type: CellType): void {
		switch (type) {
			case CellType.Stone: {
				cell.Decorate(SvgArchive.nature.forest.stone);
				break;
			}
			case CellType.SandStone: {
				cell.Decorate(SvgArchive.nature.sand.stone);
				break;
			}
			case CellType.Bush: {
				cell.Decorate(SvgArchive.nature.forest.bush);
				break;
			}
			case CellType.SandCactusPlants: {
				cell.Decorate(SvgArchive.nature.sand.cactusPlants);
				break;
			}
			case CellType.SandCactus: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.sand.cactus));
				break;
			}
			case CellType.WhiteSkull: {
				cell.Decorate(SvgArchive.nature.sand.whiteSkull);
				break;
			}
			case CellType.SandPlants: {
				cell.Decorate(SvgArchive.nature.sand.plants);
				break;
			}
			case CellType.Water: {
				cell.SetField(new WaterField(cell));
				break;
			}
			case CellType.Volcano: {
				cell.SetField(new VolcanoField(cell));
				break;
			}
			case CellType.Tree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.forest.tree));
				break;
			}
			case CellType.DarkTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.forest.darkTree));
				break;
			}
			case CellType.palmTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.sand.palmTree));
				break;
			}
			case CellType.Rock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.forest.rock));
				break;
			}
			case CellType.IceTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.ice.tree));
				break;
			}
			case CellType.IceTree2: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.ice.tree2));
				break;
			}
			case CellType.IceStone: {
				cell.Decorate(SvgArchive.nature.ice.stone);
				break;
			}
			case CellType.IceRock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.ice.rock));
				break;
			}
			case CellType.SandRock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.sand.rock));
				break;
			}
			case CellType.IcePlants: {
				cell.Decorate(SvgArchive.nature.ice.plants);
				break;
			}
			case CellType.IcePlants2: {
				cell.Decorate(SvgArchive.nature.ice.plants2);
				break;
			}
			case CellType.Leaf: {
				cell.Decorate(SvgArchive.nature.forest.leaf);
				break;
			}
			case CellType.Leaf2: {
				cell.Decorate(SvgArchive.nature.forest.leaf2);
				break;
			}
		}
	}
}
