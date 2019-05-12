import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { InteractionContext } from "./Context/InteractionContext";
import { Timer } from "./Tools/Timer";
import { Archive } from "./Tools/ResourceArchiver";

export class Crater extends Item{
    BoundingBox:BoundingBox;
    private _timer:Timer;
    private _isDone:boolean=false;

    constructor(boundingbox:BoundingBox)
    {
        super(); 
        this.Z = 0;
        this.BoundingBox = boundingbox;
        this._timer = new Timer(120);
        
        this.GenerateSprite(Archive.destruction.floorExplosion,s=>s.alpha = 0.6);
        this.GenerateSprite(Archive.destruction.debris);
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

        if(this._isDone){
            this.Destroy();
        }

        if(this._timer.IsElapsed())
        {
            this.GetCurrentSprites()[Archive.destruction.floorExplosion].alpha -= 0.05;
            if(this.GetCurrentSprites()[Archive.destruction.floorExplosion].alpha <= 0){
                this._isDone = true;
            }
        }
    }
}