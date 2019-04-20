import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Headquarter } from "../Field/Headquarter";
import { Archive } from "../Tools/ResourceArchiver";

export class TopBar extends Item
{
    private _text:PIXI.Text;
    private Hq:Headquarter;


    constructor(headquarter:Headquarter){
        super();
        this.Hq = headquarter;
        this.Z= 3;

        this.GenerateSprite(Archive.nature.diamondStone);
        this.SetBothProperty(Archive.nature.diamondStone,e=>{
            e.x = 10;
            e.width = 28;
            e.height = 28;
        });

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

        this.GetBothSprites(Archive.nature.diamondStone).forEach(s=>PlaygroundHelper.Render.AddDisplayableEntity(s));
        PlaygroundHelper.Render.AddDisplayableEntity(this._text);
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");

    }
    public Select(context: InteractionContext): boolean {
        return false;
    }

    private SetPosition() {
        this._text.x = 40/ PlaygroundHelper.Settings.GetScale();
        this._text.y =  2/ PlaygroundHelper.Settings.GetScale();
        this._text.style.fontSize =  24/ PlaygroundHelper.Settings.GetScale();
        this._text.style.strokeThickness =  2/ PlaygroundHelper.Settings.GetScale();
        this.SetBothProperty(Archive.nature.diamondStone,e=>{
            e.y =0;
            e.x = 10 / PlaygroundHelper.Settings.GetScale();
            e.width = 28 / PlaygroundHelper.Settings.GetScale();
            e.height = 28 / PlaygroundHelper.Settings.GetScale();
        });
    }

    public Update(viewX: number, viewY: number): void {
        this.SetPosition();
        this._text.text = this.Hq.Diamonds.toString();
    }
}