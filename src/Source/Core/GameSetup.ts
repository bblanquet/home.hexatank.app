import { PlaygroundGenerator } from './Builder/Generators/PlaygroundGenerator';
import { PlaygroundHelper } from "./Utils/PlaygroundHelper";
import { RenderingHandler } from "./Utils/RenderingHandler";
import { GroupsContainer } from "./Utils/GroupsContainer";

export class GameSetup{
    public SetGame(root:PIXI.Container,movableRoot:PIXI.Container):void
    { 
        PlaygroundHelper.Init();
        PlaygroundHelper.SpriteProvider.PreloadTexture();
        PlaygroundHelper.Render = new RenderingHandler(
            new GroupsContainer(
                {
                    zs:[-1,0,1,2,3,4,5],
                    parent:movableRoot
                },
                {
                    zs:[6,7],
                    parent:root
                }
                )
            );
        new PlaygroundGenerator().Generate();
    }

    public SetCenter():void{
        const hqPoint = PlaygroundHelper.PlayerHeadquarter.GetBoundingBox().GetCentralPoint();
        const halfWidth = PlaygroundHelper.Settings.ScreenWidth/2;
        const halfHeight = PlaygroundHelper.Settings.ScreenHeight/2;
        console.log("x: " + (-(hqPoint.X - halfWidth)));
        console.log("y: " + (-(hqPoint.Y - halfHeight)));
        PlaygroundHelper.Settings.SetX(-(hqPoint.X - halfWidth));
        PlaygroundHelper.Settings.SetY(-(hqPoint.Y - halfHeight));
    }
}