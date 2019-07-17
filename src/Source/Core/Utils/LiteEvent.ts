import {ILiteEvent} from "./ILiteEvent";

export class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { (obj:any, data?: T): void; }[] = [];

    public on(handler: { (obj:any, data?: T): void }) : void {
        this.handlers.push(handler);
    }

    public off(handler: { (obj:any, data?: T): void }) : void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(obj:any, data?: T) 
    {
        this.handlers.forEach(h => h(obj,data));
    }

    public expose() : ILiteEvent<T> {
        return this;
    }
}