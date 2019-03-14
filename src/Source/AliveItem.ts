import { Item } from "./Item";

export abstract class AliveItem extends Item{
    protected Life:number=100;
    protected TotalLife:number=100;
    private _totalLife:PIXI.Graphics;
    private _currentLife:PIXI.Graphics;
    private _lifes:Array<PIXI.Graphics>;
    constructor(){
        super();
        this._totalLife = new PIXI.Graphics();
        this._currentLife = new PIXI.Graphics();
        this._totalLife.beginFill(0xdc2929,1);
        this._totalLife.alpha = 0;
        this._currentLife.beginFill(0x35dc29,1);
        this._currentLife.alpha = 0;

        this._totalLife.drawRect(0,0,10,10);
        this._currentLife.drawRect(0,0,10,10);

        this.DisplayObjects.push(this._totalLife);
        this.DisplayObjects.push(this._currentLife);

        this._lifes = new Array<PIXI.Graphics>();
        this._lifes.push(this._totalLife);
        this._lifes.push(this._currentLife);
    }
    
    private Show(): void {
        this._totalLife.alpha =1;
        this._currentLife.alpha = 1; 
    }

    private Hide(): void {
        this._totalLife.alpha =0;
        this._currentLife.alpha = 0; 
    }

    public SetDamage(damage:number):void
    {
        this.Life -= damage;

        if(0 < this.Life && this.Life < this.TotalLife){
            this.Show();
        }else{
            this.Hide();
        }
        if(this.Life < 0)
        {
            this.Life = 0;
        }

        if(this.TotalLife < this.Life)
        {
            this.Life = this.TotalLife;
        }
    }

    public Update(viewX: number, viewY: number): void {
        super.Update(viewX,viewY);
        this._lifes.forEach(element => {
            element.x = (this.GetBoundingBox().X+viewX) + this.GetBoundingBox().Width/4;
            element.y = (this.GetBoundingBox().Y+viewY);
            element.height = this.GetBoundingBox().Height/25;
            element.width = this.GetBoundingBox().Width/2;
        });

        this._currentLife.width = this.GetBoundingBox().Width *(this.Life/this.TotalLife)/2;
    }

    public IsAlive():boolean
    {
        return 0 < this.Life;
    }

    public abstract IsEnemy(item:AliveItem):boolean;
}