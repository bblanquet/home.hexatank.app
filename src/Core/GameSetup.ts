import { MapRender } from './Setup/Render/MapRender';
import { PlaygroundHelper } from './Framework/PlaygroundHelper';
import { RenderingHandler } from './Setup/Render/RenderingHandler';
import { RenderingGroups } from './Setup/Render/RenderingGroups';
import { GameSettings } from './Framework/GameSettings';

export class GameSetup {
	public SetGame(root: PIXI.Container, movableRoot: PIXI.Container): void {
		PlaygroundHelper.Render = new RenderingHandler(
			new RenderingGroups(
				{
					zs: [ -1, 0, 1, 2, 3, 4, 5 ],
					parent: movableRoot
				},
				{
					zs: [ 6, 7 ],
					parent: root
				}
			)
		);
		new MapRender().Render(PlaygroundHelper.MapContext);
	}

	public SetCenter(): void {
		const hqPoint = PlaygroundHelper.PlayerHeadquarter.GetBoundingBox().GetCentralPoint();
		const halfWidth = GameSettings.ScreenWidth / 2;
		const halfHeight = GameSettings.ScreenHeight / 2;
		console.log('x: ' + -(hqPoint.X - halfWidth));
		console.log('y: ' + -(hqPoint.Y - halfHeight));
		PlaygroundHelper.ScaleHandler.SetX(-(hqPoint.X - halfWidth));
		PlaygroundHelper.ScaleHandler.SetY(-(hqPoint.Y - halfHeight));
	}
}
