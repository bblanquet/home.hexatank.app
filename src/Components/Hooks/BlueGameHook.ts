import { AbstractGameHook } from './AbstractGameHook';
import { ViewTranslator } from '../../Core/ViewTranslator';
import { BlueGame, RedGame } from '../Model/Dialogues';
import { RuntimeState } from '../Model/RuntimeState';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Point } from '../../Utils/Geometry/Point';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';

export class BlueGameHook extends AbstractGameHook<GameBlueprint, Gameworld> {
	private _steps = 0;
	private _viewTranslator: ViewTranslator;

	protected Init() {
		super.Init();
		this._steps = 0;

		const hqs = this.Gameworld.GetHqs().filter((h) => h !== this.Gameworld.GetPlayerHq());
		hqs.push(this.Gameworld.GetPlayerHq() as Headquarter);
		this._viewTranslator = new ViewTranslator(hqs.map((c) => c.GetBoundingBox()), 1500);
		this.LayerService.PauseNavigation();
		this._viewTranslator.OnDone.On(this.OnTranslationDone.bind(this));
	}

	protected Default(state: RuntimeState) {
		super.Default(state);
		state.Sentence = BlueGame[0];
	}

	public SetNextSentence(): void {
		this._steps++;
		this.Update((e) => {
			e.Sentence = BlueGame[this._steps];
		});
		this._viewTranslator.Next();
	}

	public GetCenter(): Point {
		return this.Gameworld
			.GetHqs()
			.find((h) => h !== this.Gameworld.GetPlayerHq())
			.GetBoundingBox()
			.GetCentralPoint();
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
		state.Sentence = BlueGame[0];
		return state;
	}
}
