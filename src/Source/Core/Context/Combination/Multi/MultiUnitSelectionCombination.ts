import { InteractionContext } from './../../InteractionContext';
import { MultiSelectionHandler } from './../../../Utils/MultiSelectionHandler';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { Ceil } from '../../../Ceils/Ceil';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { PlaygroundHelper } from '../../../Utils/PlaygroundHelper';
import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { InteractionKind } from '../../IInteractionContext';

export class MultiUnitSelectionCombination implements ICombination{ 
    private _multiHandler:MultiSelectionHandler;
    private _vehicles:Vehicle[];

    constructor(private _multiselection:MultiSelectionMenu,private _multiContext:MovingInteractionContext, private _interactionContext:InteractionContext){
        this._multiHandler = new MultiSelectionHandler();
        this._vehicles = [];
    }

    IsMatching(context: CombinationContext): boolean {
        return this._multiselection.GetMode() === SelectionMode.unit
        && context.ContextMode === ContextMode.MultipleSelection
        && context.InteractionKind === InteractionKind.Up;
    }    

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            if (this._vehicles.length === 0) {
                this.SetVehicles(this._multiContext.GetCells());
                this._multiContext.Stop();
                if (this._vehicles.length === 0) {
                    this._interactionContext.Mode = ContextMode.SingleSelection;
                    PlaygroundHelper.RestartNavigation();
                }
                return true;
            }
            else {
                if (this._multiContext.GetCells().length > 0) {
                    this._multiHandler.GiveOrders(this._vehicles, this._multiContext.GetCells());
                }
                this._vehicles.forEach(v => {
                    v.SetSelected(false);
                });
                this._vehicles = [];
                this._multiContext.Stop();
                this._interactionContext.Mode = ContextMode.SingleSelection;
                PlaygroundHelper.RestartNavigation();
            }
            return true;
        }
        return false;
    }


    private SetVehicles(cells:Ceil[]):void{
        cells.forEach( c=>{
            let occupier = (<Ceil><unknown>c).GetOccupier();
            if(occupier 
                && occupier instanceof Vehicle
                && !PlaygroundHelper.PlayerHeadquarter.IsEnemy(occupier)){
                    this._vehicles.push(occupier);
                }
        });
        this._vehicles.forEach(v=>{
            v.SetSelected(true);
        });
    }

    Clear(): void {
    }


}