import { Item } from "../../Items/Item";
import { BoundingBox } from "../../Utils/BoundingBox";
import { IInteractionContext } from "../../Context/IInteractionContext";

export class TargetMenuItem extends Item 
{
    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");
    }    
    public Select(context: IInteractionContext): boolean {
        throw new Error("Method not implemented.");
    }
} 