import { InputNotifier } from '../Interaction/InputNotifier';

export class InteractionAssigner {
	public Assign(app: PIXI.Application): void {
		const interactionManager = new PIXI.interaction.InteractionManager(app.renderer);
		const inputNotifier = new InputNotifier();
		interactionManager.on('pointerdown', inputNotifier.HandleMouseDown.bind(inputNotifier), false);
		interactionManager.on('pointermove', inputNotifier.HandleMouseMove.bind(inputNotifier), false);
		interactionManager.on('pointerup', inputNotifier.HandleMouseUp.bind(inputNotifier), false);
		interactionManager.autoPreventDefault = false;
	}
}

// const checker = new SelectableChecker(gameContext.GetMainHq());
// const context = new InteractionContext(
// 	inputNotifier,
// 	new CombinationProvider().GetCombination(this, checker, gameContext),
// 	checker,
// 	this.GetViewport()
// );
// context.Listen();
