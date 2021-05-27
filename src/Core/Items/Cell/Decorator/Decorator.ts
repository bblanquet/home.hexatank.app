import { BlockingField } from '../Field/BlockingField';
import { VolcanoField } from '../Field/VolcanoField';
import { WaterField } from '../Field/WaterField';
import { Cell } from '../Cell';
import { DecoratingElement } from './DecoratingElement';
import { DecorationType } from '../../../Setup/Blueprint/DecorationType';
import { Item } from '../../Item';
import { Archive } from '../../../Framework/ResourceArchiver';

export abstract class Decorator {
	protected _blockingCells = new Array<DecoratingElement>();
	protected _decorationCells = new Array<DecoratingElement>();

	public GetDecoration(): DecorationType {
		var random = Math.random();
		if (random <= 0.25) {
			const bc = this._blockingCells.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Kind;
		} else {
			const bc = this._decorationCells.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Kind;
		}
	}

	public static SetDecoration(items: Array<Item>, cell: Cell, type: DecorationType): void {
		switch (type) {
			case DecorationType.Stone: {
				cell.SetDecoration(Archive.nature.stone);
				break;
			}
			case DecorationType.SandStone: {
				cell.SetDecoration(Archive.nature.sandStone);
				break;
			}
			case DecorationType.Bush: {
				cell.SetDecoration(Archive.nature.bush);
				break;
			}
			case DecorationType.SandCactusPlants: {
				cell.SetDecoration(Archive.nature.cactusPlants);
				break;
			}
			case DecorationType.SandCactus: {
				items.push(new BlockingField(cell, Archive.nature.cactus));
				break;
			}
			case DecorationType.WhiteSkull: {
				cell.SetDecoration(Archive.nature.whiteSkull);
				break;
			}
			case DecorationType.SandPlants: {
				cell.SetDecoration(Archive.nature.sandPlants);
				break;
			}
			case DecorationType.Water: {
				items.push(new WaterField(cell));
				break;
			}
			case DecorationType.Volcano: {
				items.push(new VolcanoField(cell));
				break;
			}
			case DecorationType.Tree: {
				items.push(new BlockingField(cell, Archive.nature.tree));
				break;
			}
			case DecorationType.DarkTree: {
				items.push(new BlockingField(cell, Archive.nature.darkTree));
				break;
			}
			case DecorationType.palmTree: {
				items.push(new BlockingField(cell, Archive.nature.palmTree));
				break;
			}
			case DecorationType.Rock: {
				items.push(new BlockingField(cell, Archive.nature.rock));
				break;
			}
			case DecorationType.IceTree: {
				items.push(new BlockingField(cell, Archive.nature.iceTree));
				break;
			}
			case DecorationType.IceTree2: {
				items.push(new BlockingField(cell, Archive.nature.iceTree2));
				break;
			}
			case DecorationType.IceStone: {
				cell.SetDecoration(Archive.nature.iceStone);
				break;
			}
			case DecorationType.IceRock: {
				items.push(new BlockingField(cell, Archive.nature.iceRock));
				break;
			}
			case DecorationType.SandRock: {
				items.push(new BlockingField(cell, Archive.nature.sandRock));
				break;
			}
			case DecorationType.Puddle: {
				cell.SetDecoration(Archive.nature.puddle);
				break;
			}
			case DecorationType.IcePlants: {
				cell.SetDecoration(Archive.nature.icePlants);
				break;
			}
			case DecorationType.IcePlants2: {
				cell.SetDecoration(Archive.nature.icePlants2);
				break;
			}
			case DecorationType.Leaf: {
				cell.SetDecoration(Archive.nature.ForestLeaf);
				break;
			}
			case DecorationType.Leaf2: {
				cell.SetDecoration(Archive.nature.ForestLeaf2);
				break;
			}
		}
	}
}
