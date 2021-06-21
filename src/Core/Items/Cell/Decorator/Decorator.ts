import { BlockingField } from '../Field/BlockingField';
import { VolcanoField } from '../Field/VolcanoField';
import { WaterField } from '../Field/WaterField';
import { Cell } from '../Cell';
import { DecoratingElement } from './DecoratingElement';
import { DecorationType } from '../../../Setup/Blueprint/DecorationType';
import { Item } from '../../Item';
import { SvgArchive } from '../../../Framework/SvgArchiver';

export abstract class Decorator {
	public BlockingCells = new Array<DecoratingElement>();
	public DecorationCells = new Array<DecoratingElement>();

	public GetDecoration(): DecorationType {
		var random = Math.random();
		if (random <= 0.25) {
			const bc = this.BlockingCells.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Kind;
		} else {
			const bc = this.DecorationCells.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Kind;
		}
	}

	public static SetDecoration(items: Array<Item>, cell: Cell, type: DecorationType): void {
		switch (type) {
			case DecorationType.Stone: {
				cell.SetDecoration(SvgArchive.nature.stone);
				break;
			}
			case DecorationType.SandStone: {
				cell.SetDecoration(SvgArchive.nature.sandStone);
				break;
			}
			case DecorationType.Bush: {
				cell.SetDecoration(SvgArchive.nature.bush);
				break;
			}
			case DecorationType.SandCactusPlants: {
				cell.SetDecoration(SvgArchive.nature.cactusPlants);
				break;
			}
			case DecorationType.SandCactus: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.cactus)));
				break;
			}
			case DecorationType.WhiteSkull: {
				cell.SetDecoration(SvgArchive.nature.whiteSkull);
				break;
			}
			case DecorationType.SandPlants: {
				cell.SetDecoration(SvgArchive.nature.sandPlants);
				break;
			}
			case DecorationType.Water: {
				items.push(cell.SetField(new WaterField(cell)));
				break;
			}
			case DecorationType.Volcano: {
				items.push(cell.SetField(new VolcanoField(cell)));
				break;
			}
			case DecorationType.Tree: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.tree)));
				break;
			}
			case DecorationType.DarkTree: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.darkTree)));
				break;
			}
			case DecorationType.palmTree: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.palmTree)));
				break;
			}
			case DecorationType.Rock: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.rock)));
				break;
			}
			case DecorationType.IceTree: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.iceTree)));
				break;
			}
			case DecorationType.IceTree2: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.iceTree2)));
				break;
			}
			case DecorationType.IceStone: {
				cell.SetDecoration(SvgArchive.nature.iceStone);
				break;
			}
			case DecorationType.IceRock: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.iceRock)));
				break;
			}
			case DecorationType.SandRock: {
				items.push(cell.SetField(new BlockingField(cell, SvgArchive.nature.sandRock)));
				break;
			}
			case DecorationType.Puddle: {
				cell.SetDecoration(SvgArchive.nature.puddle);
				break;
			}
			case DecorationType.IcePlants: {
				cell.SetDecoration(SvgArchive.nature.icePlants);
				break;
			}
			case DecorationType.IcePlants2: {
				cell.SetDecoration(SvgArchive.nature.icePlants2);
				break;
			}
			case DecorationType.Leaf: {
				cell.SetDecoration(SvgArchive.nature.ForestLeaf);
				break;
			}
			case DecorationType.Leaf2: {
				cell.SetDecoration(SvgArchive.nature.ForestLeaf2);
				break;
			}
		}
	}
}
