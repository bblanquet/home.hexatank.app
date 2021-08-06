import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { Diamondworld } from '../../Core/Framework/World/Diamondworld';
import { ViewTranslator } from '../../Core/ViewTranslator';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { RuntimeState } from '../Model/RuntimeState';
import { AbstractGameHook } from './AbstractGameHook';
import { Diamond } from '../Model/Dialogues';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { SvgArchive } from '../../Core/Framework/SvgArchiver';
import { AboveItem } from '../../Core/Items/AboveItem';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Point } from '../../Utils/Geometry/Point';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';
import { Item } from '../../Core/Items/Item';
import { UnitGroup } from '../../Core/Items/UnitGroup';
import { BtnProps } from '../Components/Canvas/BtnProps';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { TankMenuItem } from '../../Core/Menu/Buttons/TankMenuItem';
import { TruckMenuItem } from '../../Core/Menu/Buttons/TruckMenuItem';

export class DiamondHook extends AbstractGameHook<DiamondBlueprint, Diamondworld> {
	private _steps = 0;
	private _viewTranslator: ViewTranslator;
	private _hasTruck: boolean = false;

	protected Init() {
		super.Init();
		this._steps = 0;
		this._viewTranslator = new ViewTranslator(
			[ this.Gameworld.Diamond.GetBoundingBox(), this.Gameworld.Hq.GetBoundingBox() ],
			2000
		);
		this.LayerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));

		const hand = new AboveItem(this.Gameworld.Hq, SvgArchive.hand);
		hand.SetVisible(() => !this.Gameworld.Hq.IsSelected());
		this.Gameworld.Hq.OnVehicleCreated.On((src: any, v: Vehicle) => {
			if (v instanceof Truck && !this._hasTruck) {
				this._hasTruck = true;
				hand.Destroy();
				this._steps = 2;
				this.SetSentence();
			}
		});
	}

	public GetCenter(): Point {
		return this.Gameworld.Diamond.GetBoundingBox().GetCentralPoint();
	}

	private SetSentence() {
		this.Update((e) => {
			e.Sentence = Diamond[this._steps];
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
		this._viewTranslator.Next();
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
		state.Sentence = Diamond[0];
		return state;
	}

	private OnTranslationDone(): void {
		this.Gameworld.State.SetInteraction(true);
		this.LayerService.StartNavigation();
	}

	GetGoalDiamond(): number {
		return this.Gameworld.GetDiamond();
	}
	public GetDuration(): number {
		return this.Gameworld.Duration;
	}

	public OnTimerDone(): SimpleEvent {
		return this.Gameworld.OnTimerDone;
	}

	GetBtns(): BtnProps[] {
		if (this.State.Item instanceof Vehicle) {
			return BtnProps.TankList(this.State.Item, (e: Item) => {
				this.SendContext(e);
			});
		} else if (this.State.Item instanceof Headquarter && !this._hasTruck) {
			return this.HeadquarterList(this.State.Item, (e: Item) => {
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

	public HeadquarterList(h: Headquarter, callback: (e: Item) => void): BtnProps[] {
		return [
			new BtnProps(
				'fill-tank',
				'btn-light',
				`${GameSettings.TankPrice * h.GetVehicleCount()}`,
				() => callback(new TankMenuItem()),
				false,
				true
			),
			new BtnProps(
				'fill-truck',
				'btn-primary',
				`${GameSettings.TruckPrice * h.GetVehicleCount()}`,
				() => callback(new TruckMenuItem()),
				true,
				true
			),
			new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
		];
	}
}
