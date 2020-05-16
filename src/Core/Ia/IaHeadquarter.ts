import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../Items/ItemSkin';
import { Cell } from '../Items/Cell/Cell';
import { IDoable } from './Decision/IDoable';
import { GameContext } from '../Framework/GameContext';

export class IaHeadquarter extends Headquarter {
	private _decision: IDoable;

	constructor(skin: ItemSkin, cell: Cell, gameContext: GameContext) {
		super(skin, cell, gameContext);
	}

	public SetDoable(decision: IDoable): void {
		this._decision = decision;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._decision.Do();
	}
}
