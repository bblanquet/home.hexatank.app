import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';
import { BtnInfo } from '../../Common/Circular/BtnInfo';
import SimpleCircularComponent from '../../Common/Circular/SimpleCircularComponent';

export default class MultiMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{ btns: BtnInfo[] }
> {
	componentWillMount() {
		let btns = [
			new BtnInfo(() => this.SendContext(new SpeedFieldMenuItem()), 'fill-multi-tank', 0),
			new BtnInfo(() => this.SendContext(new HealMenuItem()), 'fill-multi-cell', 0)
		];
		this.setState({
			btns
		});
	}

	render() {
		return <SimpleCircularComponent btns={this.state.btns} OnCancel={() => this.Cancel()} />;
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}

	private Cancel(): void {
		this.props.AppHandler.MultiMenuShowed.Invoke(this, false);
	}
}
