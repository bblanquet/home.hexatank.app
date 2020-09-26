import { DummyHqRender } from './../Setup/Render/Hq/DummyHqRender';
import { AppHandler } from './AppHandler';
import { GameContext } from '../Framework/GameContext';
import { GameHelper } from '../Framework/GameHelper';
import { MapRender } from '../Setup/Render/MapRender';
import { InteractionContext } from '../Interaction/InteractionContext';
import { SelectableChecker } from '../Interaction/SelectableChecker';
import { CellStateSetter } from '../Items/Cell/CellStateSetter';

export class TrackingAppHandler extends AppHandler {
	public SetupGameContext(): GameContext {
		this.SetupApp();

		if (!GameHelper.MapContext) {
			throw 'context missing, cannot implement map';
		}

		const gameContext = new MapRender(new DummyHqRender()).Render(GameHelper.MapContext);
		gameContext.GetCells().forEach((c) => {
			c.AlwaysVisible();
		});
		CellStateSetter.SetStates(gameContext, gameContext.GetCells());

		this.SetupInputs(gameContext);
		this.ResizeTheCanvas();
		this.SetCenter(gameContext);

		return gameContext;
	}

	public SetupInputs(gameContext: GameContext) {
		const checker = new SelectableChecker(gameContext.GetMainHq());
		this.InteractionContext = new InteractionContext(this.InputNotifier, [], checker, this.GetViewport());
		this.InteractionContext.Listen();
		this.InteractionManager.on('pointerdown', this.InputNotifier.HandleMouseDown.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointermove', this.InputNotifier.HandleMouseMove.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointerup', this.InputNotifier.HandleMouseUp.bind(this.InputNotifier), false);
		window.addEventListener('resize', () => this.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		this.InteractionManager.autoPreventDefault = false;
	}
}
