import { Component, h } from 'preact';
import { Item } from '../../../../Core/Items/Item';
import { MultiTankMenuItem } from '../../../../Core/Menu/Buttons/MultiTankMenuItem';
import { MultiCellMenuItem } from '../../../../Core/Menu/Buttons/MultiCellMenuItem';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import ExpCircularComponent from '../../../Common/Circular/CircularComponent';
import WhiteBtn from '../../../Common/Button/Standard/SmWhiteBtnComponent';
import { Point } from '../../../../Core/Utils/Geometry/Point';
import { lazyInject } from '../../../../inversify.config';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { TYPES } from '../../../../types';

export default class MultiMenuComponent extends Component<{ Item: Item }, {}> {
	@lazyInject(TYPES.Empty) private _interactionService: IInteractionService;

	render() {
		return (
			<ExpCircularComponent OnCancel={() => this.Cancel()} isDark={false}>
				<WhiteBtn
					CallBack={() => this.SendContext(new MultiTankMenuItem())}
					icon={'fill-multi-tank'}
					Point={new Point(0, 0)}
				/>
				<WhiteBtn
					CallBack={() => this.SendContext(new MultiCellMenuItem())}
					icon={'fill-multi-cell'}
					Point={new Point(0, 0)}
				/>
			</ExpCircularComponent>
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
