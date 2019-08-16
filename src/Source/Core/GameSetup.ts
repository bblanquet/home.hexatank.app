
import { IMapGenerator } from "./Builder/IMapGenerator";
import { MapGenerator } from "./Builder/MapGenerator";
import { Menu } from "./Menu/Menu";
import { PlaygroundHelper } from "./Utils/PlaygroundHelper";
import { Headquarter } from "./Ceils/Field/Headquarter";
import { Playground } from "./Playground";
import { RenderingHandler } from "./Utils/RenderingHandler";
import { GroupsContainer } from "./Utils/GroupsContainer";

export class GameSetup{
    private _mapGenerator:IMapGenerator;
    
    public SetGame(root:PIXI.Container,movableRoot:PIXI.Container):void
    { 
        PlaygroundHelper.Init();
        PlaygroundHelper.SpriteProvider.PreloadTexture();
        PlaygroundHelper.Render = new RenderingHandler(
            new GroupsContainer(
                {
                    zs:[0,1,2,3,4,5],
                    parent:movableRoot
                },
                {
                    zs:[6,7],
                    parent:root
                }
                )
            );
        PlaygroundHelper.Playground = new Playground();
        this._mapGenerator = new MapGenerator();
        const items = this._mapGenerator.SetMap();
        items.forEach(item => {
            PlaygroundHelper.Playground.Items.push(item);        
        });
        PlaygroundHelper.Playground.InputManager
        .InteractionContext.SetCombination(this.GetMenus(),this.GetHq());
        //this.SetCenter(movableRoot);
    }

    public SetCenter():void{//movableRoot:PIXI.Container
        const hqPoint = this._mapGenerator.GetHq().GetBoundingBox().GetCentralPoint();
        const halfWidth = PlaygroundHelper.Settings.ScreenWidth/2;
        const halfHeight = PlaygroundHelper.Settings.ScreenHeight/2;
        console.log("x: " + (-(hqPoint.X - halfWidth)));
        console.log("y: " + (-(hqPoint.Y - halfHeight)));
        PlaygroundHelper.Settings.SetX(-(hqPoint.X - halfWidth));
        PlaygroundHelper.Settings.SetY(-(hqPoint.Y - halfHeight));
        // movableRoot.x = -(hqPoint.X - halfWidth);
        // movableRoot.y = -(hqPoint.Y - halfHeight);
    }

    private GetHq():Headquarter{
        return this._mapGenerator.GetHq();
    }

    private GetMenus():Menu[]{
        return this._mapGenerator.GetMenus();
    }
}