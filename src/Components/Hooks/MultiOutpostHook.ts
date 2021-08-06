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
export class MultioutpostHook extends AbstractGameHook<SmallBlueprint, Multioutpostworld> {
	private _steps = 0;
	private _viewTranslator: ViewTranslator;

	protected Init() {
		super.Init();
		this._steps = 0;
		const cell = this.Gameworld.Target;
		const hand = new AboveItem(cell, SvgArchive.hand);
		hand.SetVisible(() => !cell.IsSelected());
		cell.OnFieldChanged.On((src: any, cell: Cell) => {
			hand.Destroy();
			if (cell.GetField() instanceof ReactorField) {
				const hand = new AboveItem(this.Gameworld.ReactorA, SvgArchive.hand);
			}
		});
		this._viewTranslator = new ViewTranslator(
			[
				this.Gameworld.ReactorA.GetBoundingBox(),
				this.Gameworld.ReactorB.GetBoundingBox(),
				this.Gameworld.GetPlayer().GetBoundingBox()
			],
			3000
		);
		this.LayerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));
	}

	public GetCenter(): Point {
		return this.Gameworld.ReactorA.GetBoundingBox().GetCentralPoint();
	}

	protected Default(state: RuntimeState) {
		super.Default(state);
		state.Sentence = Multioutpost[0];
	}

	public SetNextSentence(): void {
		this._steps++;
		this.Update((e) => {
			e.Sentence = Multioutpost[this._steps];
		});
		this._viewTranslator.Next();
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
			return BtnProps.ReactorList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof UnitGroup) {
			return BtnProps.MultiList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		}
	}
}
