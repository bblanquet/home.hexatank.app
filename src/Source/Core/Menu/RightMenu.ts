import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { ISelectable } from "../ISelectable"; 
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class RightMenu extends Menu{

    constructor(private _isOk:{(data:ISelectable):boolean},items:Array<MenuItem>){
        super();
        this.IsHidden = false; 
        this.Items = items;

        this.SetPosition();

        // this.IsHidden = true;
        // this.Items.forEach(item=>{
        //     item.Hide();
        // });
    }

    private SetPosition() { 
        let width = 50; 
        let height = 75;
        let margin = (PlaygroundHelper.Settings.ScreenHeight / 2) 
        - (this.Items.length * height/ 2);
        let x = PlaygroundHelper.Settings.ScreenWidth - width;
        let i = 0;
        this.Items.forEach(item => {
            item.SetBoundingBox({ x: x, y: margin + i * height, width: width, height: height });
            i += 1;
        });
    }

    protected Hide(data: ISelectable):void
    {
        super.Hide(data);
        this.IsHidden = true; 
        this.Items.forEach(item=>{
            item.Hide();
        });
    }

    public Show(data: ISelectable):void
    {
        if(this._isOk(data))
        {
            if(data){
                super.Show(data);
            }
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