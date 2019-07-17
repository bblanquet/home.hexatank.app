import * as PIXI from 'pixi.js';
import { GroupsContainer } from './GroupsContainer'; 
import { PlaygroundHelper } from './PlaygroundHelper';
import { Item } from '../Items/Item';

export class RenderingHandler{
    private _groupsHandler:GroupsContainer; 
    private _pendingItems:Item[];

    constructor(groupsContainer:GroupsContainer){
        this._groupsHandler = groupsContainer;
        this._pendingItems = new Array<Item>();
        PlaygroundHelper.Settings.FpsSubscribe(this.RenderItems.bind(this));
    }

    private RenderItems(fps:number):void{
        if(this._pendingItems.length > 0 
            && fps > 40){
            var renderingItems = this._pendingItems.splice(0,this._pendingItems.length > 10 ? 10 : this._pendingItems.length);
            renderingItems.forEach(renderingItem=>{
                renderingItem.GetDisplayObjects().forEach(sprite => {
                    this._groupsHandler.Groups[renderingItem.Z].addChild(sprite);
                });
            })
        }
    }

    public Add(item:Item){
        if(40 < PlaygroundHelper.Settings.GetFps())
        {
            item.GetDisplayObjects().forEach(sprite => {
                this._groupsHandler.Groups[item.Z].addChild(sprite);
            });
        }
        else
        {
            this._pendingItems.push(item);
        }
    } 

    public AddDisplayableEntity(shape:PIXI.DisplayObject):void{
        this._groupsHandler.Groups[3].addChild(shape);
    }

    public AddDisplayableEntity2(shape:PIXI.DisplayObject, group:number):void{
        this._groupsHandler.Groups[group].addChild(shape);
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