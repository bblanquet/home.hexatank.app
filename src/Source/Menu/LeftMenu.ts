import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Vehicle } from "../Unit/Vehicle";
import { ISelectable } from "../ISelectable";

export class LeftMenu extends Menu{
    private _show:any;
    private _hide:any;

    constructor(items:Array<MenuItem>){
        super(); 

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
        let width = 50/PlaygroundHelper.Settings.Scale;
        let height = 75/PlaygroundHelper.Settings.Scale;
        let margin = PlaygroundHelper.Settings.GetRelativeHeight() / 2 - this.Items.length * height / 2;
        let x = 0;
        let i = 0;
        this.Items.forEach(item => {
            item.SetBoundingBox({ x: x, y: margin + i * height, width: width, height: height });
            i += 1;
        });
    }

    private Hide(obj:any, data?: ISelectable):void
    {
        if(data instanceof Vehicle)
        {
            this.IsHidden = true; 
            this.Items.forEach(item=>{
                item.Hide();
            });
        }
    }

    private Show(obj:any, data?: ISelectable):void
    {
        if(data instanceof Vehicle)
        {
            this.IsHidden = false;
            this.Items.forEach(item=>{
                item.Show();
            });
        }
    }
    public Update(viewX: number, viewY: number): void {
        this.SetPosition();
        super.Update(viewX,viewY);
    }

}