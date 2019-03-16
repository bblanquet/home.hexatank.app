import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class Light extends Item{
    BoundingBox:BoundingBox;
    IsShowing:boolean;
    Size:number;
    constructor(value:{X:number, Y:number}){
        super();
        this.Z= 3;
        this.BoundingBox = new BoundingBox();
        this.GetBoundingBox().Width = 10;
        this.GetBoundingBox().Height = 10;
        this.GenerateSprite('diamondLight.png');
        this.InitPosition(value)
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
    public Display(x:number,y:number):void{
        this.IsShowing = true;
        this.SetProperty('diamondLight.png',e=>e.alpha = 1);
        this.GetBoundingBox().X = x;
        this.GetBoundingBox().Y = y;
    }

    public Update(viewX: number, viewY: number): void {
        super.Update(viewX,viewY);
         
        if(this.IsShowing)
        {
            this.SetProperty('diamondLight.png',e=>e.alpha -= 0.01);
            
            if(this.GetCurrentSprites()['diamondLight.png'].alpha <= 0)
            {
                this.IsShowing = false;
            }
        }
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }
}