import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { AbstractGameHook } from './AbstractGameHook';
import { Outpost } from '../Model/Dialogues';
import { RuntimeState } from '../Model/RuntimeState';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Point } from '../../Utils/Geometry/Point';
import { Outpostworld } from '../../Core/Framework/World/Outpostworld';
import { FieldProp } from '../Components/Canvas/FieldProp';
import { Cell } from '../../Core/Items/Cell/Cell';
import { Item } from '../../Core/Items/Item';
import { CellGroup } from '../../Core/Items/CellGroup';
import { IHeadquarter } from '../../Core/Items/Cell/Field/Hq/IHeadquarter';
import { AttackMenuItem } from '../../Core/Menu/Buttons/AttackMenuItem';
import { HealMenuItem } from '../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../Core/Menu/Buttons/PoisonMenuItem';
import { ReactorMenuItem } from '../../Core/Menu/Buttons/ReactorMenuItem';
import { ShieldMenuItem } from '../../Core/Menu/Buttons/ShieldMenuItem';
import { SpeedFieldMenuItem } from '../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ThunderMenuItem } from '../../Core/Menu/Buttons/ThunderMenuItem';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { AboveItem } from '../../Core/Items/AboveItem';
import { SvgArchive } from '../../Core/Framework/SvgArchiver';
import { Tank } from '../../Core/Items/Unit/Tank';
import { ButtonProp } from '../Components/Canvas/ButtonProp';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Truck } from '../../Core/Items/Unit/Truck';
import { UnitGroup } from '../../Core/Items/UnitGroup';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { MinusMenuItem } from '../../Core/Menu/Buttons/MinusMenuItem';
import { PlusMenuItem } from '../../Core/Menu/Buttons/PlusMenuItem';
import { FireField } from '../../Core/Items/Cell/Field/Bonus/FireField';

export class OutpostHook extends AbstractGameHook<FireBlueprint, Outpostworld> {
	private _steps = 0;
	private hasJuicedReactor: boolean = false;

	private _onDamage: any;
	private _onReactor: any;
	private _onField: any;

	protected Init() {
		super.Init();

		this._onDamage = this.OnDamaged.bind(this);
		this._onReactor = this.OnPowerUp.bind(this);
		this._onField = this.OnFieldChanged.bind(this);

		this._steps = 0;
		this.LayerService.PauseNavigation();
		this.Gameworld.GetPlayerHq().OnReactorAdded.On((src: any, r: ReactorField) => {
			r.OnPowerChanged.On(this._onReactor);
		});
		this.Gameworld.GetPlayer().OnDamageReceived.On(this._onDamage);
		this.Gameworld.FireCell.OnFieldChanged.On(this._onField);
	}

	private OnFieldChanged(src: Cell, data: Cell): void {
		if (data.GetField() instanceof FireField) {
			this._steps = 6;
			this.SetSentence();
			const arrow = new AboveItem(this.Gameworld.FireCell, SvgArchive.arrow);
			arrow.SetVisible(() => !this.Gameworld.FireCell.HasOccupier());
			const target = new AboveItem(this.Gameworld.Boulder, SvgArchive.direction.target);
			target.SetVisible(() => this.Gameworld.FireCell.HasOccupier());
		}
	}

	private OnPowerUp(src: ReactorField, r: boolean): void {
		if (!this.hasJuicedReactor && src.HasEnergy()) {
			this.Gameworld.GetPlayerHq().OnReactorAdded.Clear();
			src.OnPowerChanged.Clear();
			this.hasJuicedReactor = true;
			const hand = new AboveItem(src, SvgArchive.hand);
			hand.SetVisible(() => !src.IsSelected());
			src.OnOverlocked.On(() => {
				hand.Destroy();
			});
			this._steps = 2;
			this.SetSentence();
		}
	}

	private OnDamaged(src: Tank, r: number): void {
		if (src.GetTotalLife() === src.GetCurrentLife()) {
			this.Gameworld.GetPlayer().OnDamageReceived.Off(this._onDamage);
			this._steps = 4;
			this.SetSentence();
			const above = new AboveItem(this.Gameworld.FireCell, SvgArchive.hand);
			above.SetVisible(() => !src.IsSelected());
			this.Gameworld.FireCell.OnFieldChanged.On((src: Cell, data: Cell) => {
				above.Destroy();
			});
		}
	}

	protected Default(state: RuntimeState) {
		super.Default(state);
		state.Sentence = Outpost[0];
	}

	private SetSentence() {
		this.Update((e) => {
			e.Sentence = Outpost[this._steps];
			if (e.Sentence === '') {
				this.Gameworld.State.SetInteraction(true);
				this.LayerService.StartNavigation();
			} else {
				this.LayerService.PauseNavigation();
				this.Gameworld.State.SetInteraction(false);
			}
		});
	}

	public SetNextSentence(): void {
		this._steps++;
		this.SetSentence();
	}

	public GetCenter(): Point {
		return this.Gameworld.GetPlayer().GetBoundingBox().GetCentralPoint();
	}

	public Unmount(): void {
		super.Unmount();
	}

	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
		state.IsSettingMenuVisible = false;
		state.IsSynchronising = false;
		state.IsMultiMenuVisible = false;
		state.HasMultiMenu = false;
		state.HasWarning = false;
		state.TankRequestCount = 0;
		state.TruckRequestCount = 0;
		state.Amount = GameSettings.PocketMoney;
		state.Item = null;
		state.Players = [];
		state.GameStatus = GameStatus.Pending;
		state.StatusDetails = null;
		state.Sentence = Outpost[0];
		return state;
	}

	GetFieldBtns(): FieldProp[] {
		if (this.State.Item instanceof Cell) {
			const cell = this.State.Item;
			const hq = this.Gameworld.GetPlayerHq();
			if (hq.IsCovered(cell)) {
				if (cell === this.Gameworld.BatteryCell) {
					return this.Battery(hq, (e: Item) => {
						this.SendContext(e);
					});
				} else if (cell === this.Gameworld.FireCell) {
					return this.Fire(hq, (e: Item) => {
						this.SendContext(e);
					});
				} else {
					return FieldProp.All(hq, (e: Item) => {
						this.SendContext(e);
					});
				}
			} else {
				return FieldProp.OnlyReactor(hq, (e: Item) => {
					this.SendContext(e);
				});
			}
		} else if (this.State.Item instanceof CellGroup) {
			return FieldProp.AllExceptReactor((e: Item) => {
				this.SendContext(e);
			});
		}
	}

	public Fire(hq: IHeadquarter, callback: (e: Item) => void): FieldProp[] {
		return [
			new FieldProp('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			),
			new FieldProp('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new FieldProp('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new FieldProp('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new FieldProp('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem()), true),
			new FieldProp('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new FieldProp('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new FieldProp('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}

	public Battery(hq: IHeadquarter, callback: (e: Item) => void): FieldProp[] {
		return [
			new FieldProp('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			),
			new FieldProp('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem()), true),
			new FieldProp('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new FieldProp('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new FieldProp('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new FieldProp('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new FieldProp('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new FieldProp('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}

	GetBtns(): ButtonProp[] {
		if (this.State.Item instanceof Vehicle) {
			return ButtonProp.TankList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof Truck) {
			return ButtonProp.TruckList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (
			this.State.Item instanceof ReactorField &&
			this.Gameworld.GetPlayer().GetCurrentLife() < this.Gameworld.GetPlayer().GetTotalLife()
		) {
			return this.ReactorMenu(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof ReactorField) {
			return ButtonProp.ReactorList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof UnitGroup) {
			return ButtonProp.MultiList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		}
	}

	public ReactorMenu(item: ReactorField, callback: (e: Item) => void): ButtonProp[] {
		if (item.IsLocked()) {
			return [ new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false) ];
		}

		if (item.Reserve.GetTotalBatteries() === 0) {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					true
				),
				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		}

		if (item.HasEnergy()) {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-light',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					false
				),
				new ButtonProp('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem()), false),
				new ButtonProp('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), false),

				new ButtonProp('fill-energy-power', 'btn-danger', '', () => callback(new AttackMenuItem()), false),
				new ButtonProp('fill-energy-speed', 'btn-primary', '', () => callback(new SpeedFieldMenuItem()), false),
				new ButtonProp('fill-energy-heal', 'btn-success', '', () => callback(new HealMenuItem()), true),

				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		} else {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					false
				),

				new ButtonProp('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem()), false),
				new ButtonProp('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), false),

				new ButtonProp('fill-energy-power', 'btn-secondary', '', () => {}, false),
				new ButtonProp('fill-energy-speed', 'btn-secondary', '', () => {}, false),
				new ButtonProp('fill-energy-heal', 'btn-secondary', '', () => {}, false),

				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		}
	}
}
