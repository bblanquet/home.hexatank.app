import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { CustomerHook } from '../Hooks/CustomerHook';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Components/Panel/SmPanelComponent';
import Notification from '../Components/Notification';
import Switch from '../Components/Switch';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CustomerState } from '../Model/CustomerState';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';

export default class CustomerScreen extends HookedComponent<{}, CustomerHook, CustomerState> {
	public GetDefaultHook(): CustomerHook {
		const [ state, setState ] = useState(CustomerHook.DefaultState());
		return new CustomerHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<SmPanelComponent>
				<GridComponent
					left={''}
					right={
						<Switch
							isVisible={this.Hook.State.Errors.length === 0}
							left={
								<tbody>
									<tr class="d-flex">
										<td class="align-self-center">No errors...</td>
									</tr>
								</tbody>
							}
							right={
								<tbody>
									{this.Hook.State.Errors.map((error) => {
										return (
											<tr class="d-flex">
												<td class="align-self-center">
													{luxon.DateTime
														.fromJSDate(new Date(error.date))
														.toLocaleString(DateTime.DATE_FULL)}
												</td>
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
					<ButtonComponent callBack={() => this.Hook.Back()} color={ColorKind.Black}>
						<Icon Value="fas fa-undo-alt" /> Back
					</ButtonComponent>
					<ButtonComponent callBack={() => this.Hook.Refresh()} color={ColorKind.Red}>
						<Icon Value="fas fa-sync-alt" /> Refresh
					</ButtonComponent>
				</div>
				<Notification OnNotification={this.Hook.OnNotification} />
			</SmPanelComponent>
		);
	}
}
