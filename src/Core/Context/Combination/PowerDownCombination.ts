import { MinusMenuItem } from './../../Menu/Buttons/MinusMenuItem';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Cell/Field/InfluenceField';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class PowerDownCombination implements ICombination{
    
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
            && context.Items.length == 2
            && context.Items[0] instanceof InfluenceField
            && context.Items[1] instanceof MinusMenuItem
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if (this.IsMatching(context)) {
            let field = <InfluenceField>context.Items[0];
            field.PowerDown();
            context.Items.splice(1,1);
            return true;
        }
        return false;
    }

    Clear(): void {
    }


}