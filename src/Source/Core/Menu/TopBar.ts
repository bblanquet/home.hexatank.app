import { Item } from "../Items/Item";
import { BoundingBox } from "../Utils/BoundingBox";
import { InteractionContext } from "../Context/InteractionContext"; 
import { Headquarter } from "../Ceils/Field/Headquarter";
import { Archive } from "../Utils/ResourceArchiver";
import * as PIXI from 'pixi.js';
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class TopBar extends Item
{
    private _text:PIXI.Text;
    private Hq:Headquarter;

    constructor(headquarter:Headquarter){
        super();
        this.Accuracy = 0.5;
        this.Hq = headquarter;
        this.Z= 6;

        this.GenerateSprite(Archive.nature.diamondStone);
        this.GenerateSprite(Archive.option);

        this._text = new PIXI.Text('0', 
        { 
            fontFamily: 'Arial', 
            fontSize: 24, 
            fill: 0xFFFFFF, 
            stroke:0x000000,
            strokeThickness:2,
            align: 'center' 
        });

        this.SetPosition();

        this.GetBothSprites(Archive.nature.diamondStone).forEach(s=>PlaygroundHelper.Render.AddDisplayableEntityByGroup(s,6));
        this.GetBothSprites(Archive.option).forEach(s=>PlaygroundHelper.Render.AddDisplayableEntityByGroup(s,6));
        PlaygroundHelper.Render.AddDisplayableEntityByGroup(this._text,6);
    }

    public Destroy():void{
        super.Destroy();
        this._text.destroy();
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");

    }
    public Select(context: InteractionContext): boolean {
        return false;
    }

    private SetPosition() {
        this._text.x = 40;
        this._text.y =  2;
        this._text.style.fontSize =  24;
        this._text.style.strokeThickness =  2;
        this.SetBothProperty(Archive.nature.diamondStone,e=>{
            e.y =0;
            e.x = 10;
            e.width = 28;
            e.height = 28;
        });
        this.SetBothProperty(Archive.option,e=>{
            e.y =0;
            e.x = PlaygroundHelper.Settings.ScreenWidth - 40*1.5;
            e.width = 40;
            e.height = 40;
        });
    }

    public Update(viewX: number, viewY: number): void {
        this.SetPosition();
        this._text.text = this.Hq.Diamonds.toString();
    }
}