import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { InfluenceMenuItem } from '../../../Core/Menu/Buttons/InfluenceMenuItem';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../../Core/Menu/Buttons/MoneyMenuItem';
import { ShieldMenuItem } from '../../../Core/Menu/Buttons/ShieldMenuItem';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';
import { ThunderMenuItem } from '../../../Core/Menu/Buttons/ThunderMenuItem';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { BtnInfo } from '../../Circular/BtnInfo';
import CircularComponent from '../../Circular/CircularComponent';
import { PoisonMenuItem } from '../../../Core/Menu/Buttons/PoisonMenuItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';

export default class CellMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{ btns: BtnInfo[] }
> {
	componentWillMount() {
		let btns = [
			new BtnInfo(
				() => this.SendContext(new InfluenceMenuItem()),
				'fill-influence',
				this.props.GameContext.GetMainHq().GetReactorsCount()
			)
		];
		if (true || this.IsCovered()) {
			btns = btns.concat([
				new BtnInfo(() => this.SendContext(new ThunderMenuItem()), 'fill-thunder', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new ShieldMenuItem()), 'fill-shield', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new MoneyMenuItem()), 'fill-money', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new AttackMenuItem()), 'fill-power', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new PoisonMenuItem()), 'fill-poison', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new SpeedFieldMenuItem()), 'fill-speed', GameSettings.FieldPrice),
				new BtnInfo(() => this.SendContext(new HealMenuItem()), 'fill-medic', GameSettings.FieldPrice)
			]);
		}
		this.setState({
			btns
		});
	}

	render() {
		return <CircularComponent btns={this.state.btns} OnCancel={() => this.Cancel()} />;
	}

	private IsCovered(): boolean {
		return this.props.GameContext.GetMainHq().IsCovered(this.props.Item as Cell);
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}

	private Cancel(): void {
		this.SendContext(new CancelMenuItem());
	}
}

// private DisplayNetwork() {
// 	return (
// 		<button
// 			type="button"
// 			class="btn btn-dark without-padding"
// 			onClick={(e: any) => this.SendContext(new NetworkMenuItem())}
// 		>
// 			<div class="fill-network max-width standard-space" />
// 			<div class="max-width align-text-center darker">
// 				{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span>
// 			</div>
// 		</button>
// 	);
// }
