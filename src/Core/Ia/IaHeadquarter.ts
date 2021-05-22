import { IGlobalIa } from './Decision/IGlobalIa';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../Items/ItemSkin';
import { Cell } from '../Items/Cell/Cell';
import { GameContext } from '../Framework/GameContext';

export class IaHeadquarter extends Headquarter {
	private _brain: IGlobalIa;

	constructor(skin: ItemSkin, cell: Cell, gameContext: GameContext) {
		super(skin, cell, gameContext);
	}

	public InjectBrain(brain: IGlobalIa): void {
		this._brain = brain;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._brain.Update();
	}
}
