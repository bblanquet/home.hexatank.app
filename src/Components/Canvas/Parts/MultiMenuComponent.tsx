import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';
import { BtnInfo } from '../../Common/Circular/BtnInfo';
import ExpCircularComponent from '../../Common/Circular/ExpCircularComponent';
import WhiteBtn from '../../Common/Button/Standard/WhiteBtn';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class MultiMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{ btns: BtnInfo[] }
> {
	render() {
		return (
			<ExpCircularComponent OnCancel={() => this.Cancel()}>
				<WhiteBtn
					CallBack={() => this.SendContext(new SpeedFieldMenuItem())}
					icon={'fill-multi-tank'}
					Point={new Point(0, 0)}
				/>
				<WhiteBtn
					CallBack={() => this.SendContext(new HealMenuItem())}
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
		this.props.AppHandler.MultiMenuShowed.Invoke(this, false);
	}
}
