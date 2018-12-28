import { Item } from "./Item";

export abstract class AliveItem extends Item{
    Life:number=100;
    TotalLife:number=100;
    private _totalLife:PIXI.Graphics;
    private _currentLife:PIXI.Graphics;
    private _lifes:Array<PIXI.Graphics>;
    constructor(){
        super();
        this._totalLife = new PIXI.Graphics();
        this._currentLife = new PIXI.Graphics();
        this._totalLife.beginFill(0xdc2929,1);
        this._currentLife.beginFill(0x35dc29,1);

        this._totalLife.drawRect(0,0,10,10);
        this._currentLife.drawRect(0,0,10,10);

        this.DisplayObjects.push(this._totalLife);
        this.DisplayObjects.push(this._currentLife);

        this._lifes = new Array<PIXI.Graphics>();
        this._lifes.push(this._totalLife);
        this._lifes.push(this._currentLife);
    }
    
    public GetDamage(damage:number):void
    {
        this.Life -= damage;

        if(this.Life < 0)
        {
            this.Life = 0;
        }
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        super.Update(viewX,viewY,zoom);
        this._lifes.forEach(element => {
            element.x = (this.GetBoundingBox().X+viewX) * zoom;
            element.y = (this.GetBoundingBox().Y+viewY) * zoom;
            element.height = this.GetBoundingBox().Height/25 * zoom;
            element.width = this.GetBoundingBox().Width * zoom;
        });

        this._currentLife.width = this.GetBoundingBox().Width *(this.Life/this.TotalLife)* zoom;
    }

    public IsAlive():boolean
    {
        return this.Life > 0;
    }
}