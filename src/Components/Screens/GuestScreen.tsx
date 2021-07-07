import { h, JSX } from 'preact';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import SmPanel from '../Components/Panel/SmPanel';
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
import Struct from '../Components/Struct';
import Navbar from '../Components/Navbar';

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
				<Struct
					header={
						<span>
							<Navbar />
							<div style="margin:10px">
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
									<SmBtn callBack={() => this.Hook.Randomize()} color={ColorKind.Blue}>
										<Icon Value="fas fa-random" />
									</SmBtn>
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
							</div>
						</span>
					}
					content={
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
															<SmBtn
																callBack={() => this.Hook.Join(roomInfo.Name)}
																color={ColorKind.Black}
															>
																Join
															</SmBtn>
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
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn
									callBack={() => {
										this.Hook.Back();
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn
									callBack={() => {
										this.Hook.Refresh();
									}}
									color={ColorKind.Red}
								>
									<Icon Value="fas fa-sync-alt" /> Refresh
								</SmBtn>
							</div>
						</div>
					}
				/>
				<Notification OnNotification={this.Hook.OnNotification} />
			</Redirect>
		);
	}
}
