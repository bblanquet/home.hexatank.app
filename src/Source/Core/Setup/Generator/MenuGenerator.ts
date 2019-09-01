import { TopBar } from '../../Menu/TopBar';
import { TopMenu } from '../../Menu/TopMenu'; 
import { TruckMenuItem } from '../../Menu/TruckMenuItem';
import { EmptyMenuItem } from '../../Menu/EmptyMenuItem';
import { TankMenuItem } from '../../Menu/TankMenuItem';
import { Headquarter } from '../../Ceils/Field/Headquarter';
import { Item } from '../../Items/Item';
import { ISelectable } from '../../ISelectable';
import { Archive } from '../../Utils/ResourceArchiver';
import { CancelMenuItem } from '../../Menu/CancelMenuItem';
import { PauseButton } from '../../Menu/PauseButton';
import { ShowEnemiesMenuItem } from '../../Menu/ShowEnemiesMenuItem';
import { ResetButton } from '../../Menu/ResetButton';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { TargetMenuItem } from '../../Menu/TargetMenuItem';
import { PatrolMenuItem } from '../../Menu/PatrolMenuItem';
import { Ceil } from '../../Ceils/Ceil';
import { HealMenuItem } from '../../Menu/HealMenuItem';
import { AttackMenuItem } from '../../Menu/AttackMenuItem';
import { SpeedFieldMenuItem } from '../../Menu/SpeedFieldMenuItem';
import { MoneyMenuItem } from '../../Menu/MoneyMenuItem'; 
import { Menu } from '../../Menu/Menu';
import { LeftMenu } from "../../Menu/LeftMenu";

export class MenuGenerator
{
    public GetMenus(hq: Headquarter, items: Item[]):Array<Menu> {
        let menus = new Array<Menu>();

        const rightMenu = new LeftMenu((data:ISelectable)=>data instanceof Headquarter,
        [new EmptyMenuItem(Archive.menu.topMenu),
        new TankMenuItem(hq),
        new TruckMenuItem(hq),
        new CancelMenuItem(),
        new EmptyMenuItem(Archive.menu.bottomMenu)]);

        items.splice(0, 0, rightMenu);

        const zoomMenu = new TopMenu((data:ISelectable)=>true,
        [
            new PauseButton(),
            new ShowEnemiesMenuItem(),
            new ResetButton()
        ]);
        zoomMenu.Show(null);
        items.splice(0, 0, zoomMenu);

        const leftMenu = new LeftMenu((data:ISelectable)=>data instanceof Vehicle,[new EmptyMenuItem(Archive.menu.topMenu),
        new TargetMenuItem(),
        new PatrolMenuItem(),
        new CancelMenuItem(),
        new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu);

        const leftMenu2 = new LeftMenu((data:ISelectable)=>data instanceof Ceil,[new EmptyMenuItem(Archive.menu.topMenu),
            new HealMenuItem(),
            new AttackMenuItem(),
            new SpeedFieldMenuItem(),
            new MoneyMenuItem(),
            new CancelMenuItem(),
            new EmptyMenuItem(Archive.menu.bottomMenu)]);
        items.splice(0, 0, leftMenu2);

        const bottomMenu = new TopBar(hq);
        items.splice(0, 0, bottomMenu);

        menus.push(rightMenu);
        menus.push(leftMenu);
        menus.push(leftMenu2);
        return menus;
    }
}