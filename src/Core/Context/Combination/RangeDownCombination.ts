import { SmallMenuItem } from './../../Menu/Buttons/SmallMenuItem';
import { ICombination } from "./ICombination";
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind";
import { InfluenceField } from "../../Cell/Field/InfluenceField";

export class RangeDownCombination implements ICombination {

    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
            && context.Items.length == 2
            && context.Items[0] instanceof InfluenceField
            && context.Items[1] instanceof SmallMenuItem
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if (this.IsMatching(context)) {
            let field = <InfluenceField>context.Items[0];
            field.RangeDown();
            PeerHandler.SendMessage(PacketKind.Field, {
                Hq: PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
                cell: field.GetCell().GetCoordinate(),
                Type: "InfluenceRangeUp"
            });
            context.Items.splice(1,1);
            return true;
        }
        return false;
    }

    Clear(): void {
    }
}