import { FollowingItem } from './../FollowingItem';
import { BasicItem } from './../BasicItem';
import { Identity, Relationship } from './../Identity';
import { Missile } from './Missile';
import { ZKind } from './../ZKind';
import { LiteEvent } from './../../../Utils/Events/LiteEvent';
import { CamouflageHandler } from './CamouflageHandler';
import { Cell } from '../Cell/Cell';
import { Vehicle } from './Vehicle';
import { Turrel } from './Turrel';
import { AliveItem } from '../AliveItem';
import { Headquarter } from '../Cell/Field/Hq/Headquarter';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { CellState } from '../Cell/CellState';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Explosion } from './Explosion';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class Tank extends Vehicle {
	public Turrel: Turrel;
	private _currentTarget: AliveItem;
	private _mainTarget: AliveItem;
	private _targetUi: FollowingItem;

	public OnTargetChanged: LiteEvent<AliveItem> = new LiteEvent<AliveItem>();
	public OnCamouflageChanged: LiteEvent<AliveItem> = new LiteEvent<AliveItem>();
	public OnMissileLaunched: LiteEvent<Missile> = new LiteEvent<Missile>();

	constructor(identity: Identity, isPacific: boolean = false) {
		super(identity);
		this.IsPacific = isPacific;
		this.RootSprites.push(identity.Skin.GetBottomTankSprite());
		this.GenerateSprite(identity.Skin.GetBottomTankSprite());

		this.Turrel = new Turrel(identity.Skin, this);

		//make pivot sprite center
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.BoundingBox.Width), (sprite.height = this.BoundingBox.Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
	}

	public HasTarget(): boolean {
		return this._mainTarget && this._mainTarget.IsAlive();
	}

	protected HandleCellStateChanged(obj: any, cellState: CellState): void {
		this.SetVisible(cellState === CellState.Visible);
	}

	public SetVisible(isVisible: boolean) {
		super.SetVisible(isVisible);
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = isVisible;
		});
		this.Turrel.GetCurrentSprites().Values().forEach((s) => {
			s.visible = isVisible;
		});
	}

	public SetPosition(cell: Cell): void {
		super.SetPosition(cell);
		this.Turrel.InitPosition(cell.GetBoundingBox());
	}

	public Destroy(): void {
		super.Destroy();
		this.Turrel.Destroy();
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this.IsSelected()) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidComputation])));
		}

		if (this._mainTarget != null && !this._mainTarget.IsAlive()) {
			this._mainTarget = null;
		}

		if (this._currentTarget != null && !this._currentTarget.IsAlive()) {
			this._currentTarget = null;
		}

		this.Turrel.Update(viewX, viewY);

		this.FindTargets();
	}

	public IsMainTargetClose(): boolean {
		//find main target among surrounding enemies
		if (!isNullOrUndefined(this._mainTarget)) {
			var cells = this.GetCurrentCell().GetNearby();
			let enemies = cells.map((c) => c.GetShootableEntity()).filter((aliveItem) => !isNullOrUndefined(aliveItem));
			return this.ContainsMainTarget(enemies);
		}
		return false;
	}

	public CancelOrder(): void {
		super.CancelOrder();
		this.SetMainTarget(null);
	}

	public IsEnemyHqClose(): boolean {
		var cells = this.GetCurrentCell().GetNearby();
		let enemies = cells.map((c) => c.GetShootableEntity()).filter((shootable) => shootable);
		//find hq among enemies
		var hq = enemies.find((c) => c && c instanceof Headquarter);
		return hq && hq.GetRelation(this.Identity) === Relationship.Enemy;
	}

	private FindTargets() {
		if (this.IsPacific) {
			return;
		}

		if (this.IsMainTargetClose()) {
			this._currentTarget = this._mainTarget;
			return;
		}

		//find hq among enemies
		if (this.IsEnemyHqClose()) {
			this.SetHqTarget();
			return;
		}

		this.FindRandomEnemy();
	}

	private FindRandomEnemy() {
		const cells = this.GetCurrentCell().GetNearby();
		//find random enemy among enemies
		const enemies = cells
			.map((cell) => <AliveItem>cell.GetShootableEntity())
			.filter((aliveItem) => aliveItem && this.GetRelation(aliveItem.Identity) === Relationship.Enemy)
			.filter((c) => (c instanceof Vehicle && !(c as Vehicle).HasCamouflage) || c instanceof Headquarter);

		if (!isNullOrUndefined(this._currentTarget)) {
			var exist = enemies.indexOf(this._currentTarget) === -1 ? false : true;
			if (!exist) {
				this._currentTarget = 0 < enemies.length ? enemies[0] : null;
			}
		} else {
			if (0 < enemies.length) {
				this._currentTarget = enemies[0];
			}
		}
	}

	private SetHqTarget(): void {
		const cells = this.GetCurrentCell().GetNearby();
		const enemies = cells.map((c) => (<Cell>c).GetShootableEntity()).filter((c) => !isNullOrUndefined(c));
		const hqs = enemies.filter((c) => c instanceof Headquarter).map((c) => <Headquarter>c);
		hqs.some((hq) => {
			if (hq.GetRelation(this.Identity) === Relationship.Enemy) {
				this._currentTarget = hq;
				return true;
			}
			return false;
		});
	}

	private ContainsMainTarget(enemies: AliveItem[]) {
		return enemies.filter((e) => e === this._mainTarget).length === 1;
	}

	public GetRelation(id: Identity): Relationship {
		return this.Identity.GetRelation(id);
	}

	public GetTarget(): AliveItem {
		return this._currentTarget;
	}

	public SetMainTarget(item: AliveItem): void {
		if (item && item.GetRelation(this.Identity) === Relationship.Ally) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidComputation])));
		}

		if (this._targetUi) {
			this._targetUi.Destroy();
		}

		this._mainTarget = item;
		this.OnTargetChanged.Invoke(this, this._mainTarget);

		if (this._mainTarget) {
			this._targetUi = new FollowingItem(this._mainTarget, SvgArchive.direction.target, ZKind.Sky);
			this._targetUi.SetVisible(this.IsSelected.bind(this));
			this._targetUi.SetAlive(() => this.IsAlive() && this._mainTarget && this._mainTarget.IsAlive());
		}
	}

	public GetMainTarget(): AliveItem {
		return this._mainTarget;
	}

	SetCamouflage(): boolean {
		if (this.HasNextCell()) {
			return false;
		}
		this.HasCamouflage = true;
		this.camouflagedSprites = this.GetSprites().filter((s) => s.alpha !== 0);
		this.camouflagedSprites.concat(this.Turrel.GetSprites().filter((s) => s.alpha !== 0));

		if (this.Identity.IsPlayer) {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0.5;
			});
		} else {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0;
			});
		}

		this.Camouflage = new BasicItem(
			BoundingBox.NewFromBox(this.GetBoundingBox()),
			new CamouflageHandler().GetCamouflage(),
			ZKind.Sky
		);
		this.Camouflage.SetVisible(() => {
			return this.IsAlive() && this.HasCamouflage;
		});
		this.Camouflage.SetAlive(() => this.IsAlive() && this.HasCamouflage);

		const explosion = new Explosion(
			BoundingBox.NewFromBox(this.GetBoundingBox()),
			SvgArchive.constructionEffects,
			ZKind.Sky,
			false,
			5
		);

		return true;
	}

	RemoveCamouflage() {
		if (this.HasCamouflage) {
			this.HasCamouflage = false;

			if (this.Identity.IsPlayer) {
				this.camouflagedSprites.forEach((s) => {
					s.alpha = 1;
				});
			} else {
				if (this.GetCurrentCell().GetState() === CellState.Visible) {
					this.camouflagedSprites.forEach((s) => {
						s.alpha = 1;
					});
				} else {
					this.camouflagedSprites.forEach((s) => {
						s.alpha = 0;
					});
				}
			}
			this.camouflagedSprites = [];
		}
	}
}
