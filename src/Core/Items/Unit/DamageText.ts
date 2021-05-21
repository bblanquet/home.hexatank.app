import { BouncingScaleUpAnimator } from './../Animator/BouncingScaleUpAnimator';
import { IAnimator } from './../Animator/IAnimator';
import { ZKind } from './../ZKind';
import { TimeTimer } from './../../Utils/Timer/TimeTimer';
import * as PIXI from 'pixi.js';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Item } from '../Item';
import { AliveItem } from './../AliveItem';

export class DamageText extends Item {
	private _key: string = 'Text';
	private _isVisible: boolean;
	private _visibleTimer: TimeTimer;
	private _amount: number;
	private _text: PIXI.Text;
	private _animator: IAnimator;

	public GetBoundingBox(): BoundingBox {
		return BoundingBox.Create(
			this._aliveItem.GetBoundingBox().X + this._aliveItem.GetBoundingBox().Width / 4,
			this._aliveItem.GetBoundingBox().Y - this._aliveItem.GetBoundingBox().Height / 3,
			this._aliveItem.GetBoundingBox().Width / 2,
			this._aliveItem.GetBoundingBox().Height / 3
		);
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	constructor(private _aliveItem: AliveItem) {
		super();
		this.Z = ZKind.Sky;
		this._amount = this._aliveItem.GetCurrentLife();
		this._text = new PIXI.Text(this._amount.toString(), {
			fontFamily: 'AnimalSilence',
			fontSize: 30,
			fill: 0xba3131,
			stroke: 'white',
			strokeThickness: 2,
			align: 'center'
		});
		this.AddSprite(this._key, this._text);
		this._aliveItem.OnDestroyed.On(this.Destroyed.bind(this));
		this._aliveItem.OnDamageReceived.On(this.Damage.bind(this));
		this.Init();
		this._animator = new BouncingScaleUpAnimator(this, [ this._key ]);
	}

	private Destroyed(source: any, date: Item): void {
		this.Destroy();
	}

	private Damage(source: any, data: number): void {
		if (this._aliveItem.IsUpdatable) {
			this._amount = data * -1;
			this._isVisible = true;
			this._visibleTimer = new TimeTimer(1000);
			this._animator = new BouncingScaleUpAnimator(this, [ this._key ]);
		}
	}

	private UpdateText() {
		this._text.text = this._amount.toString();
		this._text.style.fill = this._amount < 0 ? 0xba3131 : 0x25b741;
		this._text.x = this._aliveItem.GetBoundingBox().X + this._aliveItem.GetBoundingBox().Width / 4;
		this._text.y = this._aliveItem.GetBoundingBox().Y - this._aliveItem.GetBoundingBox().Height / 3;
		this._text.width = this._aliveItem.GetBoundingBox().Width / 2;
		this._text.height = this._aliveItem.GetBoundingBox().Height / 3;
		this._text.visible = this._isVisible;
	}

	public Update(viewX: number, viewY: number): void {
		if (this._aliveItem.IsUpdatable) {
			this.UpdateText();
			super.Update(viewX, viewY);
			if (this._isVisible) {
				this._animator.Update(viewX, viewY);
				if (this._visibleTimer.IsElapsed()) {
					this._isVisible = false;
				}
			}
		}
	}
}
