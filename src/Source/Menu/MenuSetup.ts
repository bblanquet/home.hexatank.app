import { PlaygroundHelper } from './../Core/Utils/PlaygroundHelper';
import { MainMenu } from './MainMenu';

export class MenuSetup{

    public Set():void {
        var menu = new MainMenu();
        menu.buttons.forEach(button=>
        {
            PlaygroundHelper.MenuPlayground.Items.push(button);
        });
        PlaygroundHelper.MenuPlayground.Items.push(menu.background);
    }
}