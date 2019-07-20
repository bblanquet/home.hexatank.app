import { BoundingBox } from "../Core/Utils/BoundingBox";
import { InteractionContext } from "../Core/Context/InteractionContext";
import { Archive } from "../Core/Utils/ResourceArchiver";
import { Item } from "../Core/Items/Item";
import { PlaygroundHelper } from "../Core/Utils/PlaygroundHelper";
 
export class LoadingItem extends Item{

    constructor(private _boundingBox:BoundingBox){
        super();
        this.Z = 7;
        this.GenerateSprite(Archive.loading,e=>{
            e.anchor.set(0.50);
            e.alpha = 1;
        });
        this.GetBoundingBox().X = PlaygroundHelper.Settings.ScreenWidth/2 - this.GetBoundingBox().Width/2
        this.GetBoundingBox().Y = PlaygroundHelper.Settings.ScreenHeight/2 - this.GetBoundingBox().Height/2

        this.InitPosition(this._boundingBox);
        this.IsCentralRef = true;
    }

    public Update(viewX: number, viewY: number): void {
        this.GetBoundingBox().X = PlaygroundHelper.Settings.ScreenWidth/2 - this.GetBoundingBox().Width/2
        this.GetBoundingBox().Y = PlaygroundHelper.Settings.ScreenHeight/2 - this.GetBoundingBox().Height/2
        super.Update(viewX,viewY);
        this.GetDisplayObjects().forEach(displayObject=>{
            displayObject.rotation += 0.01;
        })
    }

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Destroy(): void 
    {
        super.Destroy();
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this); 
    }
}