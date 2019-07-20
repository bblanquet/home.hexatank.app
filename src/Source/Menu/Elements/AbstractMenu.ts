import { ColorBackground } from './ColorBackground';
import { ButtonItem } from './ButtonItem';
export abstract class MainMenu
{
    buttons:Array<ButtonItem>
    background:ColorBackground;
    public IsVisible:boolean;
    
    constructor()
    {
        
    }
}