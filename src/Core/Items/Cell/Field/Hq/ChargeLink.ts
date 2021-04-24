import { TranslationMaker } from '../../../Unit/MotionHelpers/TranslationMaker';
import { ITranslationMaker } from '../../../Unit/MotionHelpers/ITranslationMaker';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { ZKind } from '../../../ZKind';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IMovable } from '../../../IMovable';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { Cell } from '../../Cell';
import { GameSettings } from '../../../../Framework/GameSettings';

export class ChargeLink extends Item implements IMovable {
	private _translateMaker: ITranslationMaker;
	private _translatingDuration: number = GameSettings.TranslatinDuration * 3;
	public OnTranslateStarted: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnTranslateStopped: LiteEvent<Cell> = new LiteEvent<Cell>();
	private _boundingBox: BoundingBox;

	constructor(private _departure: Cell, private _arrival: Cell) {
		super();
		this._boundingBox = BoundingBox.CreateFromBox(this._departure.GetBoundingBox());
		this.Z = ZKind.Sky;
		this.GenerateSprite(Archive.electon, (e) => {
			e.anchor.set(0.5);
			e.alpha = 1;
		});
		this.InitPosition(this.GetBoundingBox());
		this.IsCentralRef = true;
		this._translateMaker = new TranslationMaker(this);
	}

	public IsDone(): boolean {
		return this._arrival === this._departure;
	}

	public MoveNextCell(): void {
		this._boundingBox.X = this._departure.GetBoundingBox().X;
		this._boundingBox.Y = this._departure.GetBoundingBox().Y;
	}
	public GetNextCell(): Cell {
		return this._arrival;
	}
	public GetCurrentCell(): Cell {
		return this._departure;
	}
	public GetTranslationDuration(): number {
		if (this._translatingDuration < GameSettings.GetFastestTranslation()) {
			return GameSettings.GetFastestTranslation();
		}
		return this._translatingDuration;
	}
	public SetTranslationDuration(translation: number): void {
		this._translatingDuration += translation;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._translateMaker.Translate();
	}
}
