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

        this.GenerateSprite('crater');
        this.InitPosition(boundingbox);
    }

    public Destroy(): void {
        super.Destroy();
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
            this.GetCurrentSprites()['crater'].alpha -= 0.05;
        }
    }
}