import { Multioutpostworld } from '../../Core/Framework/World/Multioutpostworld';
import { SmallBlueprint } from '../../Core/Framework/Blueprint/Small/SmallBlueprint';
import { AbstractGameHook } from './AbstractGameHook';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ViewTranslator } from '../../Core/ViewTranslator';
import { Multioutpost } from '../Model/Dialogues';
import { RuntimeState } from '../Model/RuntimeState';
import { AboveItem } from '../../Core/Items/AboveItem';
import { SvgArchive } from '../../Core/Framework/SvgArchiver';
import { Point } from '../../Utils/Geometry/Point';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';
import { Item } from '../../Core/Items/Item';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { UnitGroup } from '../../Core/Items/UnitGroup';
import { BtnProps } from '../Components/Canvas/BtnProps';
import { Tank } from '../../Core/Items/Unit/Tank';
import { IHeadquarter } from '../../Core/Items/Cell/Field/Hq/IHeadquarter';
import { AttackMenuItem } from '../../Core/Menu/Buttons/AttackMenuItem';
import { HealMenuItem } from '../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../Core/Menu/Buttons/PoisonMenuItem';
import { ReactorMenuItem } from '../../Core/Menu/Buttons/ReactorMenuItem';
import { ShieldMenuItem } from '../../Core/Menu/Buttons/ShieldMenuItem';
import { SpeedFieldMenuItem } from '../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ThunderMenuItem } from '../../Core/Menu/Buttons/ThunderMenuItem';
import { CircleBtnProps } from '../Components/Canvas/CircleBtnProps';
import { CellGroup } from '../../Core/Items/CellGroup';
import { MinusMenuItem } from '../../Core/Menu/Buttons/MinusMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { ElecMenuItem } from '../../Core/Menu/Buttons/ElecMenuItem';
import { PlusMenuItem } from '../../Core/Menu/Buttons/PlusMenuItem';
export class MultioutpostHook extends AbstractGameHook<SmallBlueprint, Multioutpostworld> {
	private _steps = 0;
	private _viewTranslator: ViewTranslator;
	private _viewTranslator2: ViewTranslator;

	protected Init() {
		super.Init();

		this._viewTranslator = new ViewTranslator(
			[
				this.Gameworld.ReactorA.GetBoundingBox(),
				this.Gameworld.ReactorB.GetBoundingBox(),
				this.Gameworld.GetPlayer().GetBoundingBox()
			],
			2000
		);
		this._viewTranslator2 = new ViewTranslator(
			[ this.Gameworld.ReactorA.GetBoundingBox(), this.Gameworld.ReactorB.GetBoundingBox() ],
			2000
		);
		this.Steps();
		this.LayerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));
	}

	private Steps(): void {
		this._steps = 0;
		const tank = this.Gameworld.Tank as Tank;
		const hand = new AboveItem(tank, SvgArchive.hand);
		hand.SetVisible(() => !tank.IsSelected() && tank.GetCurrentCell() !== this.Gameworld.Pos);

		const cell = this.Gameworld.Pos;
		const arrow = new AboveItem(cell, SvgArchive.arrow);
		arrow.SetVisible(() => tank.IsSelected() && tank.GetCurrentCell() !== this.Gameworld.Pos);

		const target = this.Gameworld.NextReactor;
		const hand2 = new AboveItem(target, SvgArchive.hand);
		hand2.SetVisible(() => tank.GetCurrentCell() === this.Gameworld.Pos);

		this.Gameworld.NextReactor.OnFieldChanged.On((src: any, cell: Cell) => {
			hand.Destroy();
			arrow.Destroy();
			hand2.Destroy();
			if (cell.GetField() instanceof ReactorField) {
				const hand3 = new AboveItem(this.Gameworld.ReactorA, SvgArchive.hand);
				hand3.SetVisible(() => !this.Gameworld.ReactorA.IsSelected());
				this._steps = 4;
				this.SetSentence();

				this.Gameworld.ReactorA.OnEnergyChanged.On((src: any, power: number) => {
					if (
						this.Gameworld.ReactorA.GetStockAmount() === 3 &&
						this.Gameworld.NextReactor.GetField() instanceof ReactorField
					) {
						this.SendContext(new CancelMenuItem());
						hand3.Destroy();
						const hand4 = new AboveItem(this.Gameworld.ReactorB, SvgArchive.hand);
						hand4.SetVisible(() => !this.Gameworld.ReactorB.IsSelected());
						this._viewTranslator2.Next();
						this._steps = 7;
						this.SetSentence();
					}
				});
			}
		});
	}

	public SetNextSentence(): void {
		this._steps++;
		this.SetSentence();
	}

	public GetCenter(): Point {
		return this.Gameworld.ReactorA.GetBoundingBox().GetCentralPoint();
	}

	protected Default(state: RuntimeState) {
		super.Default(state);
		state.Sentence = Multioutpost[0];
	}

	private SetSentence() {
		if (this._steps < 3) {
			this._viewTranslator.Next();
		}

		this.Update((e) => {
			e.Sentence = Multioutpost[this._steps];
			if (e.Sentence === '') {
				this.Gameworld.State.SetInteraction(true);
				this.LayerService.StartNavigation();
			} else {
				this.LayerService.PauseNavigation();
				this.Gameworld.State.SetInteraction(false);
			}
		});
	}

	public Unmount(): void {
		this._viewTranslator.OnDone.Clear();
		super.Unmount();
	}

	private OnTranslationDone(): void {
		this.Gameworld.State.SetInteraction(true);
		this.LayerService.StartNavigation();
	}

	static DefaultState(): RuntimeState {
		const state = new RuntimeState();
		state.HasMenu = false;
		state.IsSettingMenuVisible = false;
		state.IsSynchronising = false;
		state.HasMultiMenu = false;
		state.HasWarning = false;
		state.Amount = GameSettings.PocketMoney;
		state.Item = null;
		state.Players = [];
		state.GameStatus = GameStatus.Pending;
		state.StatusDetails = null;
		state.Sentence = Multioutpost[0];
		return state;
	}

	GetBtns(): BtnProps[] {
		if (this.State.Item instanceof Vehicle) {
			return BtnProps.TankList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof Headquarter) {
			return BtnProps.HeadquarterList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof Truck) {
			return BtnProps.TruckList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof ReactorField) {
			if (this.State.Item === this.Gameworld.ReactorA && 3 > this.Gameworld.ReactorA.GetStockAmount()) {
				return this.ReactorListA(this.State.Item, (e: Item) => {
					this.SendContext(e);
				});
			} else if (this.State.Item === this.Gameworld.ReactorB && this.Gameworld.ReactorB.HasStock()) {
				return this.ReactorListB(this.State.Item, (e: Item) => {
					this.SendContext(e);
				});
			} else {
				return BtnProps.ReactorList(this.State.Item, (e: Item) => {
					this.SendContext(e);
				});
			}
		} else if (this.State.Item instanceof UnitGroup) {
			return BtnProps.MultiList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		}
	}

	public GetFieldBtns(): CircleBtnProps[] {
		if (this.State.Item instanceof Cell) {
			const cell = this.State.Item;
			const hq = this.Gameworld.GetPlayerHq();
			if (cell === this.Gameworld.NextReactor) {
				return this.CellReactorList(hq, (e: Item) => {
					this.SendContext(e);
				});
			}

			if (hq.IsCovered(cell)) {
				return CircleBtnProps.All(hq, (e: Item) => {
					this.SendContext(e);
				});
			} else {
				return CircleBtnProps.OnlyReactor(hq, (e: Item) => {
					this.SendContext(e);
				});
			}
		} else if (this.State.Item instanceof CellGroup) {
			return CircleBtnProps.AllExceptReactor((e: Item) => {
				this.SendContext(e);
			});
		}
	}

	public CellReactorList(hq: IHeadquarter, callback: (e: Item) => void): CircleBtnProps[] {
		return [
			new CircleBtnProps(
				'fill-reactor',
				(hq.GetReactorsCount() + 1) * GameSettings.FieldPrice,
				() => callback(new ReactorMenuItem()),
				true
			),
			new CircleBtnProps('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new CircleBtnProps('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new CircleBtnProps('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new CircleBtnProps('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new CircleBtnProps('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new CircleBtnProps('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new CircleBtnProps('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}

	public ReactorListA(item: ReactorField, callback: (e: Item) => void): BtnProps[] {
		if (item.IsLocked()) {
			return [ new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem())) ];
		}

		if (item.Reserve.GetTotalBatteries() === 0) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					true
				),
				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}

		if (item.HasEnergy()) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-light',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem())
				),
				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), true),

				new BtnProps('fill-energy-power', 'btn-danger', '', () => callback(new AttackMenuItem())),
				new BtnProps('fill-energy-speed', 'btn-primary', '', () => callback(new SpeedFieldMenuItem())),
				new BtnProps('fill-energy-heal', 'btn-success', '', () => callback(new HealMenuItem())),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		} else {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem())
				),

				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), true),

				new BtnProps('fill-energy-power', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-speed', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-heal', 'btn-secondary', '', () => {}),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}
	}

	public ReactorListB(item: ReactorField, callback: (e: Item) => void): BtnProps[] {
		if (item.IsLocked()) {
			return [ new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem())) ];
		}

		if (item.Reserve.GetTotalBatteries() === 0) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					true
				),
				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}

		if (item.HasEnergy()) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-light',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem()),
					true
				),
				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem())),

				new BtnProps('fill-energy-power', 'btn-danger', '', () => callback(new AttackMenuItem())),
				new BtnProps('fill-energy-speed', 'btn-primary', '', () => callback(new SpeedFieldMenuItem())),
				new BtnProps('fill-energy-heal', 'btn-success', '', () => callback(new HealMenuItem())),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		} else {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem()),
					true
				),

				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem())),

				new BtnProps('fill-energy-power', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-speed', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-heal', 'btn-secondary', '', () => {}),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}
	}
}
