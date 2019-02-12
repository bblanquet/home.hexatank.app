import * as PIXI from 'pixi.js';
import { Item } from './Item';
import { GroupsContainer } from './GroupsContainer';

export class RenderingHandler{
    private _groupsHandler:GroupsContainer;
    public Textures : PIXI.loaders.TextureDictionary
    
    constructor(groupsContainer:GroupsContainer, textures:PIXI.loaders.TextureDictionary){
        this._groupsHandler = groupsContainer;
        this.Textures = textures;
    }
    public Add(item:Item){
        
        item.DisplayObjects.forEach(sprite => {
            this._groupsHandler.Groups[item.Z].addChild(sprite);
        });
    } 

    public AddDisplayableEntity(shape:PIXI.DisplayObject):void{
        this._groupsHandler.Groups[3].addChild(shape);
    }

    public Remove(item:Item){
        item.DisplayObjects.forEach(sprite => {
            sprite.alpha = 1;
            sprite.destroy();
            this._groupsHandler.Groups[item.Z].removeChild(sprite);
        });
        item.DisplayObjects = [];
    }
}