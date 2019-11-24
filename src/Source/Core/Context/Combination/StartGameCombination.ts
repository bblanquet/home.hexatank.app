// import { GameSetup } from './../../GameSetup';
// import { ICombination } from "./ICombination";
// import { Item } from "../../Items/Item";
// import { InteractionContext } from '../InteractionContext';
// import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';

// export class StartGameCombination implements ICombination{
    
//     _gameSetup:GameSetup;
//     _interaction:InteractionContext;

//     StartGameCombination(interaction:InteractionContext){
//         this._gameSetup = new GameSetup();
//         this._interaction = interaction;
//     }

//     IsMatching(items: Item[]): boolean {
//         throw new Error("Method not implemented.");
//     }    
    
//     Combine(items: Item[]): boolean 
//     {
//         if(this.IsMatching(items)){
//             PlaygroundHelper.SpriteProvider.PreloadTexture();
//             this._gameSetup.SetGame().forEach(element => {
//                 PlaygroundHelper.Playground.Items.push(<Item> element);        
//             });
//             this._interaction.SetCombination(this._gameSetup.GetMenus(),this._gameSetup.GetHq());
//             return true;
//         }
//         return false;
//     }

//     Clear(): void {
//         throw new Error("Method not implemented.");
//     }
// }