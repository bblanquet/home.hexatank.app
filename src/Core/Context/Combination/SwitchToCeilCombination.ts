// import { ICombination } from "./ICombination";
// import { Menu } from "../../Menu/Menu";
// import { Item } from "../../Items/Item";
// import { cell } from "../../cells/cell";
// import { Vehicle } from "../../Items/Unit/Vehicle";

// export class SwitchTocellCombination implements ICombination{
//     constructor(private _menus:Menu[]){
//     }

//     IsMatching(items: Item[]): boolean { 
//         return items.length == 2 
//         && (items[0] instanceof Vehicle)
//         && items[1] instanceof cell;
//     }    
//     Combine(items: Item[]): boolean {
//         if(this.IsMatching(items))
//         {
//             const vehicle = items[0] as Vehicle;
//             vehicle.SetSelected(false);
//             const cell = items[1] as cell;
//             cell.SetSelected(true);
//             this._menus.forEach(menu=>{menu.Show(cell);});
//             items.splice(0,1);
//             return true;
//         }
//         return false;
//     }
//     Clear(): void {
//     }


// }