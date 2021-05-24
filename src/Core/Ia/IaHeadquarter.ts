import { IBrain } from './Decision/IBrain';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../Items/ItemSkin';
import { Cell } from '../Items/Cell/Cell';
import { GameContext } from '../Framework/GameContext';
import { Curve } from '../Utils/Stats/Curve';
import { DateValue } from '../Utils/Stats/DateValue';

export class IaHeadquarter extends Headquarter {
	private _brain: IBrain;
	private _diamondCurve: Curve = new Curve([], '');

	constructor(skin: ItemSkin, cell: Cell, gameContext: GameContext) {
		super(skin, cell, gameContext);
		this.OnDiamondEarned.On(this.HandleDiamondChanged.bind(this));
	}

	private HandleDiamondChanged(src: Headquarter, diamond: number): void {
		this._diamondCurve.Points.push(new DateValue(new Date().getTime(), diamond));
	}

	public GetEarnedDiamond(milliseconds: number) {
		const d = Date.now() - milliseconds;
		const ps = this._diamondCurve.Points.filter((p) => d < p.X);
		if (0 < ps.length) {
			return ps.map((p) => p.Amount).reduce((a, b) => a + b);
		} else {
			return 0;
		}
	}

	public InjectBrain(brain: IBrain): void {
		this._brain = brain;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._brain.Update();
	}
}
