import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { AbstractGameHook } from './AbstractGameHook';
import { FireV2World } from '../../Core/Framework/World/FireV2World';
import { ViewTranslator } from '../../Core/ViewTranslator';
import { Fire } from '../Model/Dialogues';
import { RuntimeState } from '../Model/RuntimeState';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Point } from '../../Utils/Geometry/Point';

export class FireV2Hook extends AbstractGameHook<FireBlueprint, FireV2World> {
	private _steps = 0;
	private _viewTranslator: ViewTranslator;

	protected Init() {
		super.Init();
		this._steps = 0;
		this._viewTranslator = new ViewTranslator(this.Gameworld.Steps.map((c) => c.GetBoundingBox()), 3000);
		this.LayerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));
	}

	protected Default(state: RuntimeState) {
		super.Default(state);
		state.Sentence = Fire[0];
	}

	public SetNextSentence(): void {
		this._steps++;
		this.Update((e) => {
			e.Sentence = Fire[this._steps];
		});
		this._viewTranslator.Next();
	}

	public GetCenter(): Point {
		return this.Gameworld.Steps[0].GetBoundingBox().GetCentralPoint();
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
		state.Sentence = Fire[0];
		return state;
	}
}
