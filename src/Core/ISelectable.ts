import { LiteEvent } from "./Utils/LiteEvent";

export interface ISelectable{
    SetSelected(visible:boolean):void;
    IsSelected():boolean;
    SelectionChanged: LiteEvent<ISelectable>;
}