import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { InteractionContext } from "./Context/InteractionContext";

export class Crater extends Item{
    BoundingBox:BoundingBox;

    constructor(boundingbox:BoundingBox)
    {
        super(); 
        this.Z = 0;
        this.BoundingBox = boundingbox;

        let sprite = PlaygroundHelper.SpriteProvider.GetSprite('crater');
        this.DisplayObjects.push(sprite);

        PlaygroundHelper.Render.Add(this);
    }

    public GetBoundingBox(): BoundingBox {
        return this.BoundingBox;
    }
    
    public Select(context: InteractionContext): boolean {
        return false;
    }


}