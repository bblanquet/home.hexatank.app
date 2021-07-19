import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';

export class PlayerBlueprint {
	constructor(public Name: string, public Color: ColorKind, public IsPlayer: boolean, public IA?: string) {}

	public IsIA(): boolean {
		return !isNullOrUndefined(this.IA);
	}
}
