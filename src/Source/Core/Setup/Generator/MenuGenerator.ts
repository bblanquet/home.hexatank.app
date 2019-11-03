// import { EmptyMenuItem } from '../../Menu/EmptyMenuItem';
// import { Headquarter } from '../../Ceils/Field/Headquarter';
// import { Item } from '../../Items/Item';
// import { ISelectable } from '../../ISelectable';
// import { Archive } from '../../Utils/ResourceArchiver';
// import { CancelMenuItem } from '../../Menu/Buttons/CancelMenuItem';
// import { Vehicle } from '../../Items/Unit/Vehicle';
// import { TargetMenuItem } from '../../Menu/Buttons/TargetMenuItem';
// import { PatrolMenuItem } from '../../Menu/Buttons/PatrolMenuItem';
// import { Ceil } from '../../Ceils/Ceil';
// import { HealMenuItem } from '../../Menu/Buttons/HealMenuItem';
// import { AttackMenuItem } from '../../Menu/Buttons/AttackMenuItem';
// import { SpeedFieldMenuItem } from '../../Menu/Buttons/SpeedFieldMenuItem';
// import { MoneyMenuItem } from '../../Menu/Buttons/MoneyMenuItem'; 
// import { Menu } from '../../Menu/Menu';

// export class MenuGenerator
// {
//     public GetMenus(hq: Headquarter, items: Item[]):Array<Menu> {
//         let menus = new Array<Menu>();

//         // const vehicleMenu = new LeftMenu((data:ISelectable)=>data instanceof Vehicle,[new EmptyMenuItem(Archive.menu.topMenu),
//         // new TargetMenuItem(),
//         // new PatrolMenuItem(),
//         // new CancelMenuItem(),
//         // new EmptyMenuItem(Archive.menu.bottomMenu)]);
//         // items.splice(0, 0, vehicleMenu);

//         // const ceilMenu = new LeftMenu((data:ISelectable)=>data instanceof Ceil,[new EmptyMenuItem(Archive.menu.topMenu),
//         //     new HealMenuItem(),
//         //     new AttackMenuItem(),
//         //     new SpeedFieldMenuItem(), 
//         //     new MoneyMenuItem(),
//         //     new CancelMenuItem(),
//         //     new EmptyMenuItem(Archive.menu.bottomMenu)]);
//         // items.splice(0, 0, ceilMenu);

//         // menus.push(vehicleMenu);
//         // menus.push(ceilMenu);
//         return menus;
//     }
// }