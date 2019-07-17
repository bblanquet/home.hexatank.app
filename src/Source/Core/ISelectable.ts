export interface ISelectable{
    SetSelected(visible:boolean):void;
    IsSelected():boolean;
    SubscribeUnselection(handler: (data: ISelectable)=> void):void;
    Unsubscribe(handler: (data: ISelectable)=> void):void;
}