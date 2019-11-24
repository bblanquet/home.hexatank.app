import { Ceil } from './../../../Ceils/Ceil';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { PlaygroundHelper } from '../../../Utils/PlaygroundHelper';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { PeerHandler } from '../../../../Menu/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../../Menu/Network/PacketKind';
import { HealField } from '../../../Ceils/Field/HealField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { AttackField } from '../../../Ceils/Field/AttackField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { MoneyField } from '../../../Ceils/Field/MoneyField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { FastField } from '../../../Ceils/Field/FastField';
import { InteractionContext } from '../../InteractionContext';
import { InteractionKind } from '../../IInteractionContext';

export class MultiCellSelectionCombination implements ICombination{
    private _cells:Ceil[];

    constructor(private _multiselection:MultiSelectionMenu,private _multiSelectionContext:MovingInteractionContext, private _interactionContext:InteractionContext){
        this._cells = [];
    }

    IsMatching(context: CombinationContext): boolean {
        return (context.ContextMode === ContextMode.MultipleSelection 
            && this._multiselection.GetMode() === SelectionMode.cell
            && context.InteractionKind === InteractionKind.Up)
        || 
        (context.ContextMode === ContextMode.SingleSelection 
            && context.InteractionKind === InteractionKind.Up
            && this._cells.length > 0
            && context.Items.length > 0
            && !(context.Items[context.Items.length] instanceof Ceil));
    }    
    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            if (this._cells.length === 0) {
                this._cells = this._multiSelectionContext.GetCells();
                this._cells.forEach(c=>{
                    c.SetSelected(true);
                });
                this._multiSelectionContext.Stop();
                if (this._cells.length === 0) 
                {
                    this._interactionContext.Mode = ContextMode.SingleSelection;
                    PlaygroundHelper.RestartNavigation();
                }
                else 
                {
                    PlaygroundHelper.SelectedItem.trigger(this,this._cells[0]);
                    this._interactionContext.Mode = ContextMode.SingleSelection;
                }
            }
            else 
            {
                let menuItem = context.Items[0];
                if(menuItem && 
                    PlaygroundHelper.PlayerHeadquarter.GetAmount() 
                    >= PlaygroundHelper.Settings.FieldPrice*this._cells.length){
                    
                    if(menuItem instanceof HealMenuItem ){
                        this._cells.forEach(c=>{
                            PeerHandler.SendMessage(PacketKind.Field,{
                                Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                                Ceil:c.GetCoordinate(),
                                Type:"Heal"
                            });
                            let field = new HealField(c);
                            PlaygroundHelper.Playground.Items.push(field);
                        });
                    }
                    else if(menuItem instanceof AttackMenuItem)
                    {
                        this._cells.forEach(c=>{
                            PeerHandler.SendMessage(PacketKind.Field,{
                                Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                                Ceil:c.GetCoordinate(),
                                Type:"Attack"
                            });
                            let field = new AttackField(c);
                            PlaygroundHelper.Playground.Items.push(field);
                        });
                    }
                    else if(menuItem instanceof SpeedFieldMenuItem)
                    {
                        this._cells.forEach(c=>{
                            PeerHandler.SendMessage(PacketKind.Field,{
                                Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                                Ceil:c.GetCoordinate(),
                                Type:"Money"
                            });
                            let field = new MoneyField(c);
                            PlaygroundHelper.Playground.Items.push(field);
                        });
                    }
                    else if(menuItem instanceof MoneyMenuItem){
                        this._cells.forEach(c=>{
                            PeerHandler.SendMessage(PacketKind.Field,{
                                Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                                Ceil:c.GetCoordinate(),
                                Type:"Fast"
                            });
                            let field = new FastField(c);
                            PlaygroundHelper.Playground.Items.push(field);
                        });
                    }
                }
                this._cells.forEach(c => {
                    c.SetSelected(false);
                });
                this._cells = [];
                context.Items.splice(context.Items.length-1,1);
                PlaygroundHelper.RestartNavigation();
            }
            return true;
        }
        return false;
    }
    Clear(): void {
    }


}