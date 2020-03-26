import { BlockingField } from '../Field/RockField';
import { VolcanoField } from '../Field/VolcanoField';
import { WaterField } from '../Field/WaterField';
import { Cell } from '../Cell';
import { DecoratingElement } from './DecoratingElement';
import { DecorationType } from '../../../Setup/Generator/DecorationType';
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
			case DecorationType.palmTree: {
				items.push(new BlockingField(cell, Archive.nature.palmTree));
				break;
			}
			case DecorationType.Rock: {
				items.push(new BlockingField(cell, Archive.nature.rock));
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
		}
	}
}
