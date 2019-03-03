import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class Dust extends Item
{
    BoundingBox:BoundingBox;
    private i:number;
    private currentDust:number;
    private currentAlpha:number;

    constructor(boundingBox:BoundingBox)
    {
        super();
        
        this.i = 0;
        this.currentDust = -1;
        this.currentAlpha = 1;
        this.Z= 1;

        this.BoundingBox = boundingBox; 
        let dusts = ['dust1.png','dust2.png','dust3.png','dust4.png'];
        dusts.forEach(dust=>{
            let sprite = PlaygroundHelper.SpriteProvider.GetSprite(dust);
            sprite.alpha = 0;
            sprite.pivot.set(sprite.x + sprite.width/2,sprite.y + sprite.height/2);
            this.DisplayObjects.push(sprite);
        });
        this.IsCentralRef = true;
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    public Select(context: InteractionContext): boolean {
        //do nothing
        return false; 
    }
    public Update(viewX: number, viewY: number, zoom: number): void{
        super.Update(viewX,viewY,zoom);

        this.i += 1;
    
        if(0 <= this.currentDust 
            && this.currentDust < this.DisplayObjects.length)
        {
            this.DisplayObjects[this.currentDust].rotation += 0.1;
            this.DisplayObjects[this.currentDust].alpha = this.currentAlpha;
        }

        this.currentAlpha -= 0.01;

        if(this.currentAlpha < 0)
        {
            this.currentAlpha = 0;			
        }

        if(this.i % 15 == 0)
        {
            var previous = this.currentDust; 
            this.currentDust += 1;

            if(this.DisplayObjects.length == this.currentDust)
            {
                this.DisplayObjects[previous].alpha = 0;
                this.Destroy();
            }
            else
            {
                if(-1 < previous)
                {
                    this.DisplayObjects[previous].alpha = 0;
                }
                this.DisplayObjects[this.currentDust].alpha = this.currentAlpha;
            }
        }
    }

    private Destroy() {
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }
}