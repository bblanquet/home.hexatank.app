import { h, JSX } from 'preact';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Components/Panel/SmPanelComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Notification from '../Components/Notification';
import InputComponent from '../Common/Text/TextComponent';
import IconInputComponent from '../Common/Text/IconTextComponent';
import { GuestHook } from '../Hooks/GuestHook';
import { useState } from 'preact/hooks';
import Switch from '../Components/Switch';
import { GuestState } from '../Model/GuestState';
import { HookedComponent } from '../Hooks/HookedComponent';

export default class GuestComponent extends HookedComponent<{}, GuestHook, GuestState> {
	componentWillUnmount() {
		this.Hook.Unmount();
	}

	public GetDefaultHook(): GuestHook {
		const [ state, setState ] = useState(GuestHook.DefaultState());
		return new GuestHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="container-center-horizontal">
						<InputComponent
							max={15}
							type={'text'}
							value={this.Hook.State.PlayerName}
							label={'Name'}
							isEditable={true}
							onInput={(e: any) => this.Hook.SetUsername(e.target.value as string)}
						/>
						<div class="space-out" />
						<SmButtonComponent callBack={() => this.Hook.Randomize()} color={ColorKind.Blue}>
							<Icon Value="fas fa-random" />
						</SmButtonComponent>
					</div>
					<IconInputComponent
						type={'text'}
						value={this.Hook.State.filter}
						icon={'fas fa-filter'}
						isEditable={true}
						onInput={(e: any) => this.Hook.SetFilter(e.target.value)}
					/>
					<IconInputComponent
						type={'text'}
						value={this.Hook.State.Password}
						icon={'fas fa-lock'}
						isEditable={true}
						onInput={(e: any) => this.Hook.SetPassword(e.target.value)}
					/>
					<GridComponent
						left={''}
						right={
							<Switch
								isVisible={this.Hook.State.Rooms.length === 0}
								left={
									<tbody>
										<tr class="d-flex">
											<td class="align-self-center">No room available...</td>
										</tr>
									</tbody>
								}
								right={
									<tbody>
										{this.Hook.State.DisplayableRooms.map((roomInfo) => {
											return (
												<tr class="d-flex">
													<td class="align-self-center">
														<SmButtonComponent
															callBack={() => this.Hook.Join(roomInfo.Name)}
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
								this.Hook.Back();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
						<ButtonComponent
							callBack={() => {
								this.Hook.Refresh();
							}}
							color={ColorKind.Red}
						>
							<Icon Value="fas fa-sync-alt" /> Refresh
						</ButtonComponent>
					</div>
				</SmPanelComponent>
				<Notification OnNotification={this.Hook.OnNotification} />
			</Redirect>
		);
	}
}
