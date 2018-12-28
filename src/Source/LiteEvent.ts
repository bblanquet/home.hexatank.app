import {ILiteEvent} from "./ILiteEvent";

export class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { (obj:any, data?: T): void; }[] = [];

    public on(handler: { (obj:any, data?: T): void }) : void {
        this.handlers.push(handler);
    }

    public off(handler: { (obj:any, data?: T): void }) : void {
        //console.log(`%c before off ${this.handlers.length}`,'color:red;','font-weight:bold;');
        this.handlers.forEach(element=>{
            //console.log(`%c off ${element.prototype}`,'color:green;','font-weight:bold;');
        });
        
        this.handlers = this.handlers.filter(h => h !== handler);
        //console.log(`%c after off ${this.handlers.length}`,'color:red;','font-weight:bold;');

    }

    public trigger(obj:any, data?: T) {

        this.handlers.forEach(h => h(obj,data));//slice(0)
    }

    public expose() : ILiteEvent<T> {
        return this;
    }
}