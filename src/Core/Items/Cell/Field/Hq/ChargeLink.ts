import { CellState } from './../../CellState';
import { TranslationMaker } from '../../../Unit/MotionHelpers/TranslationMaker';
import { ITranslationMaker } from '../../../Unit/MotionHelpers/ITranslationMaker';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { ZKind } from '../../../ZKind';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IMovable } from '../../../IMovable';
import { LiteEvent } from '../../../../../Utils/Events/LiteEvent';
import { Cell } from '../../Cell';
import { GameSettings } from '../../../../Framework/GameSettings';

export class ChargeLink extends Item implements IMovable {
	private _translateMaker: ITranslationMaker;
	private _translatingDuration: number = GameSettings.TranslatinDuration;
	public OnTranslateStarted: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnTranslateStopped: LiteEvent<Cell> = new LiteEvent<Cell>();
	private _boundingBox: BoundingBox;

	constructor(private _departure: Cell, private _arrival: Cell) {
		super();
		this._boundingBox = BoundingBox.NewFromBox(this._departure.GetBoundingBox());
		this.Z = ZKind.Sky;
		this.GenerateSprite(SvgArchive.electon, (e) => {
			e.anchor.set(0.5);
			e.alpha = 1;
		});
		this.InitPosition(this.GetBoundingBox().GetPosition());
		this.IsCentralRef = true;
		this._translateMaker = new TranslationMaker(this);
		this._departure.OnCellStateChanged.On(this.CellStateChanged.bind(this));
		this.SetVisible();
	}

	private CellStateChanged(src: any, cellState: CellState): void {
		this.SetVisible();
	}

	private SetVisible() {
		if (this._arrival.IsVisible() && this._departure.IsVisible()) {
			this.SetProperty(SvgArchive.electon, (e) => (e.alpha = 1));
		} else {
			this.SetProperty(SvgArchive.electon, (e) => (e.alpha = 0));
		}
	}

	public IsDone(): boolean {
		return this._arrival === this._departure;
	}

	public GoNextCell(): void {
		this._boundingBox.SetX(this._departure.GetBoundingBox().GetX());
		this._boundingBox.SetY(this._departure.GetBoundingBox().GetY());
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

	public Update(): void {
		super.Update();
		this._translateMaker.Translate();
	}
}
