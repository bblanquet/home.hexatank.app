import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { BrainKind } from '../../../Ia/Decision/BrainKind';

export class PlayerBlueprint {
	constructor(public Name: string, public Color: ColorKind, public IsPlayer: boolean, public IA: BrainKind) {}
}
