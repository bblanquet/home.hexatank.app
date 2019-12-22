import { MapRender } from './Setup/Render/MapRender';
import { PlaygroundHelper } from "./Utils/PlaygroundHelper";
import { RenderingHandler } from "./Utils/RenderingHandler";
import { GroupsContainer } from "./Utils/GroupsContainer";
import { GameSettings } from './Utils/GameSettings';

export class GameSetup{
    public SetGame(root:PIXI.Container,movableRoot:PIXI.Container):void
    { 
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
        new MapRender().Render(PlaygroundHelper.MapContext);
    }

    public SetCenter():void{
        const hqPoint = PlaygroundHelper.PlayerHeadquarter.GetBoundingBox().GetCentralPoint();
        const halfWidth = GameSettings.ScreenWidth/2;
        const halfHeight = GameSettings.ScreenHeight/2;
        console.log("x: " + (-(hqPoint.X - halfWidth)));
        console.log("y: " + (-(hqPoint.Y - halfHeight)));
        //GameSettings.SetX(-(hqPoint.X - halfWidth));
        //GameSettings.SetY(-(hqPoint.Y - halfHeight));
    }
}