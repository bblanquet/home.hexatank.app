
export interface ILiteEvent<T> {
    on(handler: { (obj:any, data?: T): void }) : void;
    off(handler: { (obj:any, data?: T): void }) : void;
}