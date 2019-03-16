import * as PIXI from 'pixi.js';
import { Item } from './Item';
import { GroupsContainer } from './GroupsContainer';

export class RenderingHandler{
    private _groupsHandler:GroupsContainer;
    
    constructor(groupsContainer:GroupsContainer){
        this._groupsHandler = groupsContainer;
    }
    public Add(item:Item){
        //console.log(`${item.constructor.name} ${item.Z}`);
        item.GetDisplayObjects().forEach(sprite => {
            this._groupsHandler.Groups[item.Z].addChild(sprite);
        });
    } 

    public AddDisplayableEntity(shape:PIXI.DisplayObject):void{
        this._groupsHandler.Groups[3].addChild(shape);
    }

    public Remove(item:Item){
        item.GetDisplayObjects().forEach(sprite => {
            sprite.alpha = 1;
            sprite.destroy();
            this._groupsHandler.Groups[item.Z].removeChild(sprite);
        });
        item.Clear();
    }
}