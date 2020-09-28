import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../../../Core/App/AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';
import ExpCircularComponent from '../../Common/Circular/CircularComponent';
import WhiteBtn from '../../Common/Button/Standard/SmWhiteBtnComponent';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class MultiMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
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
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}

	private Cancel(): void {
		this.props.AppHandler.OnMultiMenuShowed.Invoke(this, false);
	}
}
