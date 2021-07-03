import { Component, h } from 'preact';
import { useState } from 'preact/hooks';
import { CustomerHook } from '../Hooks/CustomerHook';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Components/Panel/SmPanelComponent';
import Notification from '../Components/Notification';
import Switch from '../Components/Switch';

export default class CustomerScreen extends Component {
	private _hook: CustomerHook;
	constructor() {
		super();
		const [ state, setState ] = useState(CustomerHook.DefaultState());
		this._hook = new CustomerHook(state, setState);
	}

	componentWillUnmount() {
		this._hook.Unmount();
	}

	render() {
		return (
			<SmPanelComponent>
				<GridComponent
					left={''}
					right={
						<Switch
							isVisible={this._hook.State.Errors.length === 0}
							left={
								<tbody>
									<tr class="d-flex">
										<td class="align-self-center">No errors...</td>
									</tr>
								</tbody>
							}
							right={
								<tbody>
									{this._hook.State.Errors.map((error) => {
										return (
											<tr class="d-flex">
												<td class="align-self-center">{error.name}</td>
											</tr>
										);
									})}
								</tbody>
							}
						/>
					}
				/>
				<div class="container-center-horizontal">
					<ButtonComponent callBack={() => this._hook.Back()} color={ColorKind.Black}>
						<Icon Value="fas fa-undo-alt" /> Back
					</ButtonComponent>
					<ButtonComponent callBack={() => this._hook.Refresh()} color={ColorKind.Red}>
						<Icon Value="fas fa-sync-alt" /> Refresh
					</ButtonComponent>
				</div>
				<Notification OnNotification={this._hook.OnNotification} />
			</SmPanelComponent>
		);
	}
}
