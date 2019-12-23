// import { ICombination } from "./ICombination";
// import { ISelectable } from "../../ISelectable";
// import { Menu } from "../../Menu/Menu";
// import { Item } from "../../Items/Item";
// import { Vehicle } from "../../Items/Unit/Vehicle";
// import { cell } from "../../cells/cell";
// import { Headquarter } from "../../cells/Field/Headquarter";

// export class SwitchToHeadquarterCombination implements ICombination{
//     constructor(private _menus:Menu[]){
//     }

//     IsMatching(items: Item[]): boolean 
//     {
//         return items.length == 2 
//         && (items[0] instanceof Vehicle ||  items[0] instanceof cell)
//         && items[1] instanceof Headquarter;    
//     }    
    
//     Combine(items: Item[]): boolean 
//     {
//         if(this.IsMatching(items))
//         {
//             const hq = items[0] as any as ISelectable;
//             hq.SetSelected(false);
//             const vehicle = items[1] as Headquarter;
//             vehicle.SetSelected(true);
//             this._menus.forEach(menu=>{menu.Show(vehicle);});
//             items.splice(0,1);
//             return true;
//         }   
//         return false; 
//     }

//     Clear(): void {
//     }
// }