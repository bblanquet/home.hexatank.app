import { ColorBackground } from './Elements/ColorBackground';
import { ButtonItem } from './Elements/ButtonItem';
import { AbstractMenu } from "./Elements/AbstractMenu";
import { PlaygroundHelper } from '../Core/Utils/PlaygroundHelper';

export class MainMenu extends AbstractMenu
{
    constructor(){
        super([new ButtonItem("Start",0x525252),new ButtonItem("Network",0x525252)]);
        this.background = new ColorBackground(0x525252);
    }

    private SetPosition() {
        let width = 50;
        let height = 75;
        let leftMargin = PlaygroundHelper.Settings.ScreenWidth / 2 - this.buttons.length * height / 2;
        
        var i = 0;
        this.buttons.forEach(button => {
            button.SetBoundingBox({ x: leftMargin + i * width, y: 20, width: width, height: height });
            i += 1;
        });
    }

}