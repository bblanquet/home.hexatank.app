// import { AppHandler } from './AppHandler';
// import { GameContext } from '../Framework/GameContext';
// import { GameHelper } from '../Framework/GameHelper';
// import { MapRender } from '../Setup/Render/MapRender';
// import { CombinationProvider } from '../Interaction/CombinationProvider';
// import { InteractionContext } from '../Interaction/InteractionContext';
// import { SelectableChecker } from '../Interaction/SelectableChecker';
// import { HqRender } from '../Setup/Render/Hq/HqRender';
// import { MapContext } from '../Setup/Generator/MapContext';

// export class GameAppHandler extends AppHandler {
// 	public Generate(mapContext: MapContext): boolean {
// 		this.SetupApp();

// 		if (!mapContext) {
// 			throw 'context missing, cannot implement map';
// 		}

// 		GameHelper.SetNetwork(gameContext);
// 		this.SetupInputs(gameContext);
// 		this.ResizeTheCanvas();
// 		this.SetCenter(gameContext);

// 		return true;
// 	}

// 	public SetupInputs(gameContext: GameContext) {
// 		const checker = new SelectableChecker(gameContext.GetMainHq());
// 		this.InteractionContext = new InteractionContext(
// 			this.InputNotifier,
// 			new CombinationProvider().GetCombination(this, checker, gameContext),
// 			checker,
// 			this.GetViewport()
// 		);
// 		this.InteractionContext.Listen();
// 		this.InteractionManager.on('pointerdown', this.InputNotifier.HandleMouseDown.bind(this.InputNotifier), false);
// 		this.InteractionManager.on('pointermove', this.InputNotifier.HandleMouseMove.bind(this.InputNotifier), false);
// 		this.InteractionManager.on('pointerup', this.InputNotifier.HandleMouseUp.bind(this.InputNotifier), false);
// 		window.addEventListener('resize', () => this.ResizeTheCanvas());
// 		window.addEventListener('DOMContentLoaded', () => this.ResizeTheCanvas());
// 		this.InteractionManager.autoPreventDefault = false;
// 	}
// }
