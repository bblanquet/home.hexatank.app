
import { Headquarter } from "./Source/Field/Headquarter";
import { PlaygroundHelper } from "./Source/PlaygroundHelper";
import { Playground } from "./Source/Playground";
import { Item } from "./Source/Item";
import { Vehicle } from "./Source/Unit/Vehicle";
import { InteractionContext } from "./Source/Context/InteractionContext"; 
import { IMapGenerator } from "./Source/Builder/IMapGenerator";
import { MapGenerator } from "./Source/Builder/MapGenerator";

export class GameSetup{
    private _currentHq:Headquarter;
    private _mapGenerator:IMapGenerator;
    SetGame(app:PIXI.Application):void
    {
        this._mapGenerator = new MapGenerator();
        const items = this._mapGenerator.SetMap(); 
        this._currentHq = this._mapGenerator.GetHq();
        const playground = new Playground(items,app, new InteractionContext(this.IsSelectable.bind(this)));
        PlaygroundHelper.Playground = playground;
    }

    private IsSelectable(item:Item){
        if(item instanceof Vehicle){
            const vehicle = <Vehicle> item;
            return !vehicle.IsEnemy(this._currentHq);
        }
        else if(item instanceof Headquarter)
        {
            return item === this._currentHq;
        }
        return false;
    }
}