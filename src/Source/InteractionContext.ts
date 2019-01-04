import {Item} from './Item';
import {LiteEvent} from "./LiteEvent";

export class InteractionContext{
    SelectionEvent:LiteEvent<Item>;
    Point:PIXI.Point;

    constructor(){
        this.SelectionEvent = new LiteEvent<Item>();
    }

    OnSelect(item:Item):void
    {
        this.SelectionEvent.trigger(this, item);
    }

}