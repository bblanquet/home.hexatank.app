import { BigMenuItem } from './../../Menu/Buttons/BigMenuItem';
import { ICombination } from "./ICombination";
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { InfluenceField } from "../../Cell/Field/InfluenceField";
import { GameSettings } from '../../Utils/GameSettings';

export class RangeUpCombination implements ICombination {

    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
            && context.Items.length == 2
            && context.Items[0] instanceof InfluenceField
            && context.Items[1] instanceof BigMenuItem
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if (this.IsMatching(context)) {
            let field = <InfluenceField>context.Items[0];
            if (field.HasStock() ||
                PlaygroundHelper.PlayerHeadquarter.Buy(GameSettings.TruckPrice * PlaygroundHelper.PlayerHeadquarter.GetTotalEnergy())) {
                field.RangeUp();
            }
            context.Items.splice(1, 1);
            return true;
        }
        return false;
    }

    Clear(): void {
    }
}