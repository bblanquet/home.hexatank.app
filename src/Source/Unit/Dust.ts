import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class Dust extends Item 
{
    BoundingBox:BoundingBox;
    private i:number;
    private currentDust:number; 
    private currentAlpha:number;
    private _sprites:string[]=['dust1.png','dust2.png','dust3.png','dust4.png'];

    constructor(boundingBox:BoundingBox)
    {
        super();
        
        this.i = 0;
        this.currentDust = -1;
        this.currentAlpha = 1;
        this.Z= 1;

        this.BoundingBox = boundingBox; 
        this._sprites.forEach(dust=>{
            this.GenerateSprite(dust);
        });
        this.GetSprites().forEach(sp=>{
            sp.alpha = 0;
            sp.anchor.set(0.5);
        })
        this.IsCentralRef = true;
        this.InitPosition(boundingBox);
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    public Select(context: InteractionContext): boolean {
        //do nothing
        return false; 
    }
    public Update(viewX: number, viewY: number): void{
        super.Update(viewX,viewY);

        this.i += 1;
    
        if(0 <= this.currentDust 
            && this.currentDust < this._sprites.length)
        {
            this.SetProperty(this._sprites[this.currentDust],s=>s.rotation += 0.1);
            this.SetProperty(this._sprites[this.currentDust],s=>s.alpha += this.currentAlpha);
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

            if(this._sprites.length == this.currentDust)
            {
                this.SetProperty(this._sprites[previous],s=>s.alpha = 0);
                this.Destroy();
            }
            else
            {
                if(-1 < previous)
                {
                    this.SetProperty(this._sprites[previous],s=>s.alpha = 0);
                }
                this.SetProperty(this._sprites[this.currentDust],s=>s.alpha = this.currentAlpha);
            }
        }
    }

    public Destroy() {
        super.Destroy();
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }
}