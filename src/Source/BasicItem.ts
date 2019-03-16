import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class BasicItem extends Item{ 

    private _isVisible:{ (): boolean };
    private _isAlive:{ (): boolean };
    private _spriteName:string;
    constructor(private _boundingBox:BoundingBox, sprite:string){
        super();
        this.Z = 0;
        this._spriteName = sprite;
        this.GenerateSprite(sprite,e=>{
            e.anchor.set(0.50);
            e.alpha = 0;
        });
        this.InitPosition(this._boundingBox);
        this.IsCentralRef = true;
    }

    public SetRotation(radius:number):void{
        this.SetProperty(this._spriteName,e=>e.rotation= radius);
    }

    public SetDisplayTrigger(show:{ (): boolean }):void{
        this._isVisible = show;
    }

    public SetVisible(show:{ (): boolean }):void{
        this._isAlive = show;
    }

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        super.Update(viewX,viewY);

        if(!this._isAlive()){
            this.Destroy();
        }

        if(this.GetCurrentSprites()['selectedCeil'])
        {
            console.log('plop');
        }
        const visible = this._isVisible();
        this.SetProperty(this._spriteName,e=>e.alpha= visible ? 1 :0);
        if(this.GetCurrentSprites()['selectedCeil'])
        {
            console.log('plop');
        }
    }

    public Destroy(): void 
    {
        super.Destroy();
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this); 
    }

}