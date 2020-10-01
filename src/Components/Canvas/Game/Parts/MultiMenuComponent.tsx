import { Component, h } from 'preact';
import { Item } from '../../../../Core/Items/Item';
import { MultiTankMenuItem } from '../../../../Core/Menu/Buttons/MultiTankMenuItem';
import { MultiCellMenuItem } from '../../../../Core/Menu/Buttons/MultiCellMenuItem';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import ExpCircularComponent from '../../../Common/Circular/CircularComponent';
import WhiteBtn from '../../../Common/Button/Standard/SmWhiteBtnComponent';
import { Point } from '../../../../Core/Utils/Geometry/Point';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../../Factory';

export default class MultiMenuComponent extends Component<{ Item: Item }, {}> {
	private _interactionService: IInteractionService;
	constructor() {
		super();
		this._interactionService = Factory.Load<IInteractionService>(FactoryKey.Interaction);
	}
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
