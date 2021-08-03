import { IaNameView } from './IaNameView';
import { RequestIaView } from './RequestIaView';
import { TroopIaView } from './TroopIaView';
import { ZKind } from '../../../../Items/ZKind';
import { BrainArea } from '../BrainArea';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { Item } from '../../../../Items/Item';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';

export class BrainAreaView extends Item {
	private _troopsView: TroopIaView;
	private _nameView: IaNameView;
	private _requestView: RequestIaView;
	constructor(private _hq: Headquarter, private _area: BrainArea) {
		super();
		this.GenerateSprite(this._hq.Identity.Skin.GetArea(), (e) => {
			e.alpha = 1;
			e.anchor.set(0.5);
		});
		this.Z = ZKind.Sky;
		this.IsCentralRef = true;
		this.InitPosition(this._area.GetCentralCell().GetBoundingBox().GetPosition());
		this._troopsView = new TroopIaView(this, this._area);
		this._requestView = new RequestIaView(this, this._area);
		this._nameView = new IaNameView(this, this._area);
	}

	public GetBoundingBox(): BoundingBox {
		return this._area.GetCentralCell().GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}
}
