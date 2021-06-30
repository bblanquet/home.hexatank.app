import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { BouncingScaleUpAnimator } from '../Animator/BouncingScaleUpAnimator';
import { IAnimator } from '../Animator/IAnimator';
import { Item } from '../Item';
import { ZKind } from '../ZKind';
import * as PIXI from 'pixi.js';

export class AboveItemText extends Item {
	private _key: string = 'Text';
	private _isVisible: boolean;
	private _visibleTimer: TimeTimer;
	private _content: string = '';
	private _color: number = 0xba3131;
	private _text: PIXI.Text;
	private _animator: IAnimator;
	private _textMetrics: PIXI.TextMetrics;

	public GetBoundingBox(): BoundingBox {
		if (!this._textMetrics) {
			this.UpdateText();
		}
		return BoundingBox.New(
			this._item.GetBoundingBox().X + this._item.GetBoundingBox().Width / 2 - this._textMetrics.width / 2,
			this._item.GetBoundingBox().Y - this._textMetrics.height / 2,
			this._textMetrics.width,
			this._textMetrics.height
		);
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	constructor(private _item: Item) {
		super();
		this.Z = ZKind.Sky;
		this._text = new PIXI.Text(this._content.toString(), {
			fontFamily: 'AnimalSilence',
			fontSize: 30,
			fill: 0xba3131,
			stroke: 'white',
			strokeThickness: 2,
			align: 'center'
		});
		this.AddSprite(this._key, this._text);
		this._item.OnDestroyed.On(this.Destroyed.bind(this));
		this.Init();
		this._animator = new BouncingScaleUpAnimator(this, [ this._key ]);
	}

	public Display(text: string, color: number, duration: number = 1000): void {
		if (this._item.IsUpdatable) {
			this._color = color;
			this._content = text;
			this._isVisible = true;
			if (duration === 0) {
				this._visibleTimer = null;
			} else {
				this._visibleTimer = new TimeTimer(1000);
			}
			this._animator = new BouncingScaleUpAnimator(this, [ this._key ]);
		}
	}

	private Destroyed(source: any, date: Item): void {
		this.Destroy();
	}

	private UpdateText() {
		this._text.text = this._content.toString();
		this._text.style.fill = this._color;
		this._textMetrics = PIXI.TextMetrics.measureText(this._text.text, new PIXI.TextStyle(this._text.style));
		this._text.x = this._item.GetBoundingBox().X + this._item.GetBoundingBox().Width / 2;
		this._text.y = this._item.GetBoundingBox().Y - this._item.GetBoundingBox().Height / 3;
		this._text.visible = this._isVisible;
	}

	public Update(viewX: number, viewY: number): void {
		if (this._item.IsUpdatable) {
			super.Update(viewX, viewY);
			if (this._isVisible) {
				if (!this._animator.IsDone) {
					this.UpdateText();
				}
				this._animator.Update(viewX, viewY);
				if (this._visibleTimer && this._visibleTimer.IsElapsed()) {
					this._isVisible = false;
				}
			}
		}
	}
}
