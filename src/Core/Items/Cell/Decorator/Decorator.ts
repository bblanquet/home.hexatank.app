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
				cell.Decorate(SvgArchive.nature.stone);
				break;
			}
			case CellType.SandStone: {
				cell.Decorate(SvgArchive.nature.sandStone);
				break;
			}
			case CellType.Bush: {
				cell.Decorate(SvgArchive.nature.bush);
				break;
			}
			case CellType.SandCactusPlants: {
				cell.Decorate(SvgArchive.nature.cactusPlants);
				break;
			}
			case CellType.SandCactus: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.cactus));
				break;
			}
			case CellType.WhiteSkull: {
				cell.Decorate(SvgArchive.nature.whiteSkull);
				break;
			}
			case CellType.SandPlants: {
				cell.Decorate(SvgArchive.nature.sandPlants);
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
				cell.SetField(new BlockingField(cell, SvgArchive.nature.tree));
				break;
			}
			case CellType.DarkTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.darkTree));
				break;
			}
			case CellType.palmTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.palmTree));
				break;
			}
			case CellType.Rock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.rock));
				break;
			}
			case CellType.IceTree: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.iceTree));
				break;
			}
			case CellType.IceTree2: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.iceTree2));
				break;
			}
			case CellType.IceStone: {
				cell.Decorate(SvgArchive.nature.iceStone);
				break;
			}
			case CellType.IceRock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.iceRock));
				break;
			}
			case CellType.SandRock: {
				cell.SetField(new BlockingField(cell, SvgArchive.nature.sandRock));
				break;
			}
			case CellType.Puddle: {
				cell.Decorate(SvgArchive.nature.puddle);
				break;
			}
			case CellType.IcePlants: {
				cell.Decorate(SvgArchive.nature.icePlants);
				break;
			}
			case CellType.IcePlants2: {
				cell.Decorate(SvgArchive.nature.icePlants2);
				break;
			}
			case CellType.Leaf: {
				cell.Decorate(SvgArchive.nature.ForestLeaf);
				break;
			}
			case CellType.Leaf2: {
				cell.Decorate(SvgArchive.nature.ForestLeaf2);
				break;
			}
		}
	}
}
