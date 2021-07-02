import { h, Component } from 'preact';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Components/Panel/SmPanelComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Notification from '../Components/Notification/NotificationComponent';
import InputComponent from '../Common/Text/TextComponent';
import IconInputComponent from '../Common/Text/IconTextComponent';
import { GuestHook } from '../Hooks/GuestHook';
import { useState } from 'preact/hooks';
import Switch from '../Components/Switch';

export default class GuestComponent extends Component {
	private _hook: GuestHook;
	constructor() {
		super();
		const [ state, setState ] = useState(GuestHook.DefaultState());
		this._hook = new GuestHook(state, setState);
	}

	componentWillUnmount() {
		this._hook.Unmount();
	}

	render() {
		return (
			<Redirect>
				<Notification OnNotification={this._hook.OnNotification}>
					<SmPanelComponent>
						<div class="container-center-horizontal">
							<InputComponent
								max={15}
								type={'text'}
								value={this._hook.State.PlayerName}
								label={'Name'}
								isEditable={true}
								onInput={(e: any) => this._hook.SetUsername(e.target.value as string)}
							/>
							<div class="space-out" />
							<SmButtonComponent callBack={() => this._hook.Randomize()} color={ColorKind.Blue}>
								<Icon Value="fas fa-random" />
							</SmButtonComponent>
						</div>
						<IconInputComponent
							type={'text'}
							value={this._hook.State.filter}
							icon={'fas fa-filter'}
							isEditable={true}
							onInput={(e: any) => this._hook.SetFilter(e.target.value)}
						/>
						<IconInputComponent
							type={'text'}
							value={this._hook.State.Password}
							icon={'fas fa-lock'}
							isEditable={true}
							onInput={(e: any) => this._hook.SetPassword(e.target.value)}
						/>
						<GridComponent
							left={''}
							right={
								<Switch
									isVisible={this._hook.State.Rooms.length === 0}
									left={
										<tbody>
											<tr class="d-flex">
												<td class="align-self-center">No room available...</td>
											</tr>
										</tbody>
									}
									right={
										<tbody>
											{this._hook.State.DisplayableRooms.map((roomInfo) => {
												return (
													<tr class="d-flex">
														<td class="align-self-center">
															<SmButtonComponent
																callBack={() => this._hook.Join(roomInfo.Name)}
																color={ColorKind.Black}
															>
																Join
															</SmButtonComponent>
														</td>
														<td class="align-self-center">
															<Visible isVisible={roomInfo.HasPassword}>
																<Icon Value="fas fa-lock" />
															</Visible>
															{` ${roomInfo.Name}`}
														</td>
														<td class="align-self-center">
															{roomInfo.PlayerCount}/{roomInfo.Count}
														</td>
													</tr>
												);
											})}
										</tbody>
									}
								/>
							}
						/>
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this._hook.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
							<ButtonComponent
								callBack={() => {
									this._hook.Refresh();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-sync-alt" /> Refresh
							</ButtonComponent>
						</div>
					</SmPanelComponent>
				</Notification>
			</Redirect>
		);
	}
}
