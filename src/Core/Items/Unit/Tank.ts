import { CamouflageHandler } from './CamouflageHandler';
import { Cell } from '../Cell/Cell';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { Vehicle } from './Vehicle';
import { Turrel } from './Turrel';
import { AliveItem } from '../AliveItem';
import { isNullOrUndefined, isNull } from 'util';
import { IHqContainer } from './IHqContainer';
import { Headquarter } from '../Cell/Field/Headquarter';
import { Archive } from '../../Framework/ResourceArchiver';
import { CellState } from '../Cell/CellState';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { BasicItem } from '../BasicItem';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Explosion } from './Explosion';
import { GameContext } from '../../Framework/GameContext';

export class Tank extends Vehicle implements IHqContainer {
	Turrel: Turrel;
	private _currentTarget: AliveItem;
	private _mainTarget: AliveItem;

	constructor(hq: Headquarter, gameContext: GameContext) {
		super(hq, gameContext);

		this.Wheels = Archive.wheels;

		this.GenerateSprite(Archive.wheel);
		this.RootSprites.push(Archive.wheel);

		this.Wheels.forEach((wheel) => {
			this.GenerateSprite(wheel);
			this.RootSprites.push(wheel);
		});

		this.RootSprites.push(this.Hq.GetSkin().GetBottomTankSprite());
		this.GenerateSprite(this.Hq.GetSkin().GetBottomTankSprite());

		this.Turrel = new Turrel(this.Hq.GetSkin(), this);

		//make pivot sprite center
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.BoundingBox.Width), (sprite.height = this.BoundingBox.Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
	}

	public HasTarget(): boolean {
		return !isNullOrUndefined(this._mainTarget);
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState === CellState.Visible;
		});
		this.Turrel.GetDisplayObjects().forEach((s) => {
			s.visible = cellState === CellState.Visible;
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
			var cells = this.GetCurrentCell().GetAllNeighbourhood();

			let enemies = cells.map((c) => (<Cell>c).GetShootableEntity()).filter((aliveItem) => !isNull(aliveItem));

			return this.ContainsMainTarget(enemies);
		}
		return false;
	}

	public IsEnemyHqClose(): boolean {
		var cells = this.GetCurrentCell().GetAllNeighbourhood();

		let enemies = cells.map((c) => (<Cell>c).GetShootableEntity()).filter((c) => !isNullOrUndefined(c));

		//find hq among enemies
		var hq = enemies.filter((c) => c instanceof Headquarter).map((c) => <Headquarter>c);
		if (hq.length >= 1) {
			return hq.some((element) => {
				if (element.IsEnemy(this)) {
					return true;
				}
				return false;
			});
		}
		return false;
	}

	private FindTargets() {
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
		const cells = this.GetCurrentCell().GetAllNeighbourhood();
		//find random enemy among enemies
		const enemies = cells
			.map((cell) => <AliveItem>((<Cell>cell).GetOccupier() as any))
			.filter((aliveItem) => !isNullOrUndefined(aliveItem) && this.IsEnemy(aliveItem))
			.filter((c) => (c instanceof Vehicle && !(<Vehicle>c).HasCamouflage) || c instanceof Headquarter);

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
		const cells = this.GetCurrentCell().GetAllNeighbourhood();
		const enemies = cells.map((c) => (<Cell>c).GetShootableEntity()).filter((c) => !isNull(c));
		const hqs = enemies.filter((c) => c instanceof Headquarter).map((c) => <Headquarter>c);
		hqs.some((element) => {
			if (element.IsEnemy(this)) {
				this._currentTarget = element;
				return true;
			}
			return false;
		});
	}

	private ContainsMainTarget(enemies: AliveItem[]) {
		return enemies.filter((e) => e === this._mainTarget).length === 1;
	}

	private IsHqContainer(item: any): item is IHqContainer {
		return 'Hq' in item;
	}

	public IsEnemy(item: AliveItem): boolean {
		if (this.IsHqContainer(item as any)) {
			return (<IHqContainer>(item as any)).Hq !== this.Hq;
		} else if (item instanceof Headquarter) {
			return <Headquarter>(item as any) !== this.Hq;
		}
		return false;
	}

	public GetTarget(): AliveItem {
		return this._currentTarget;
	}

	public SetMainTarget(item: AliveItem): void {
		PeerHandler.SendMessage(PacketKind.Target, {
			Hq: this.Hq.GetCell().GetCoordinate(),
			cell: this.GetCurrentCell().GetCoordinate(),
			TarGetCell: isNullOrUndefined(item) ? null : item.GetCurrentCell().GetCoordinate()
		});
		this._mainTarget = item;
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

		if (this.GameContext.MainHq === this.Hq) {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0.5;
			});
		} else {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0;
			});
		}

		PeerHandler.SendMessage(PacketKind.Camouflage, {
			Hq: this.Hq.GetCell().GetCoordinate(),
			cell: this.GetCurrentCell().GetCoordinate()
		});

		this.Camouflage = new BasicItem(
			BoundingBox.CreateFromBox(this.GetBoundingBox()),
			CamouflageHandler.GetCamouflage(),
			5
		);
		this.Camouflage.SetVisible(() => this.IsAlive() && this.HasCamouflage);
		this.Camouflage.SetAlive(() => this.IsAlive() && this.HasCamouflage);

		const explosion = new Explosion(
			BoundingBox.CreateFromBox(this.GetBoundingBox()),
			Archive.constructionEffects,
			5,
			false,
			5
		);

		return true;
	}

	RemoveCamouflage() {
		if (this.HasCamouflage) {
			this.HasCamouflage = false;

			if (this.GameContext.MainHq === this.Hq) {
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
