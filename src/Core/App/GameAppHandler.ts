import { AppHandler } from './AppHandler';
import { GameContext } from '../Framework/GameContext';
import { GameHelper } from '../Framework/GameHelper';
import { MapRender } from '../Setup/Render/MapRender';
import { CombinationProvider } from '../Interaction/CombinationProvider';
import { InteractionContext } from '../Interaction/InteractionContext';
import { SelectableChecker } from '../Interaction/SelectableChecker';
import { HqRender } from '../Setup/Render/Hq/HqRender';

export class GameAppHandler extends AppHandler {
	public SetupGameContext(): GameContext {
		this.SetupApp();

		if (!GameHelper.MapContext) {
			throw 'context missing, cannot implement map';
		}

		const gameContext = new MapRender(new HqRender()).Render(GameHelper.MapContext);
		GameHelper.SetNetwork(gameContext);
		this.SetupInputs(gameContext);

		this.ResizeTheCanvas();
		this.SetCenter(gameContext);

		return gameContext;
	}

	public SetupInputs(gameContext: GameContext) {
		const checker = new SelectableChecker(gameContext.GetMainHq());
		this.InteractionContext = new InteractionContext(
			this.InputNotifier,
			new CombinationProvider().GetCombination(this, checker, gameContext),
			checker,
			this.GetViewport()
		);
		this.InteractionContext.Listen();
		this.InteractionManager.on('pointerdown', this.InputNotifier.HandleMouseDown.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointermove', this.InputNotifier.HandleMouseMove.bind(this.InputNotifier), false);
		this.InteractionManager.on('pointerup', this.InputNotifier.HandleMouseUp.bind(this.InputNotifier), false);
		window.addEventListener('resize', () => this.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
		this.InteractionManager.autoPreventDefault = false;
	}
}
