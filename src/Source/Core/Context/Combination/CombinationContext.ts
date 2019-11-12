import { ContextMode } from './../../Utils/ContextMode';
import { InteractionKind } from './../IInteractionContext';
import { Item } from "../../Items/Item";

export class CombinationContext{
    public Items:Array<Item>;
    public Kind:InteractionKind;
    public ContextMode:ContextMode;
}