import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { ISelectable } from "../ISelectable";
import { Headquarter } from "../Field/Headquarter";

export class RightMenu extends Menu{
    private _show:any;
    private _hide:any;

    constructor(items:Array<MenuItem>){
        super();
        this.IsHidden = false; 
        this.Items = items;

        this.SetPosition();

        this.IsHidden = true;
        this.Items.forEach(item=>{
            item.Hide();
        });

        this._hide = this.Hide.bind(this);
        PlaygroundHelper.OnUnselectedItem.on(this._hide);

        this._show = this.Show.bind(this);
        PlaygroundHelper.OnSelectedItem.on(this._show);
    }

    private SetPosition() {
        let width = 50;
        let height = 75;
        let margin = PlaygroundHelper.Settings.ScreenHeight / 2 - this.Items.length * height / 2;
        let x = PlaygroundHelper.Settings.ScreenWidth - width;
        let i = 0;
        this.Items.forEach(item => {
            item.SetBoundingBox({ x: x, y: margin + i * height, width: width, height: height });
            i += 1;
        });
    }

    private Hide(obj:any, data?: ISelectable):void
    {
        if(data instanceof Headquarter)
        {
            this.IsHidden = true; 
            this.Items.forEach(item=>{
                item.Hide();
            });
        }
    }

    private Show(obj:any, data?: ISelectable):void
    {
        if(data instanceof Headquarter)
        {
            this.IsHidden = false;
            this.Items.forEach(item=>{
                item.Show();
            });
        }
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        this.SetPosition();
        super.Update(viewX,viewY,zoom);
    }
}