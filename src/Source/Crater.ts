import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { InteractionContext } from "./Context/InteractionContext";
import { Timer } from "./Tools/Timer";

export class Crater extends Item{
    BoundingBox:BoundingBox;
    private _timer:Timer;

    constructor(boundingbox:BoundingBox)
    {
        super(); 
        this.Z = 0;
        this.BoundingBox = boundingbox;
        this._timer = new Timer(100);

        let sprite = PlaygroundHelper.SpriteProvider.GetSprite('crater');
        this.DisplayObjects.push(sprite);
        this.InitPosition(boundingbox);
    }

    public Destroy(): void {
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }

    public GetBoundingBox(): BoundingBox {
        return this.BoundingBox;
    }
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        super.Update(viewX,viewY);

        if(this.GetSprites()[0].alpha <= 0){
            this.Destroy();
        }

        if(this._timer.IsElapsed())
        {
            this.GetSprites()[0].alpha -= 0.05;
        }
    }
}