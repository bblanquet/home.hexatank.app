import { Component, h } from 'preact';
import { GameContext } from '../../../Core/Framework/Context/GameContext';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { Item } from '../../../Core/Items/Item';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../../Singletons';
import CircularV2Component from '../../Common/CircularV2/CircularV2';
import LightWhiteBtn from '../../Common/Button/Standard/LightWhiteBtn';
import { Point } from '../../../Utils/Geometry/Point';

export default class MultiMenuComponent extends Component<{ Item: Item }, {}> {
	private _interactionService: IInteractionService<GameContext>;
	constructor() {
		super();
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
	}
	render() {
		return (
			<div class="circle-menu">
				<CircularV2Component OnCancel={() => this.Cancel()}>
					<LightWhiteBtn
						CallBack={() => this.SendContext(new MultiTankMenuItem())}
						Icon={'fill-multi-tank'}
						Point={new Point(0, 0)}
					/>
					<LightWhiteBtn
						CallBack={() => this.SendContext(new MultiCellMenuItem())}
						Icon={'fill-multi-cell'}
						Point={new Point(0, 0)}
					/>
				</CircularV2Component>
			</div>
		);
	}

	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
	}

	private Cancel(): void {
		this._interactionService.OnMultiMenuShowed.Invoke(this, false);
	}
}
