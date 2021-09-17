import { h, JSX } from 'preact';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Grid from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Redirect from '../Components/Redirect';
import Visible from '../Common/Struct/Visible';
import Notification from '../Components/Notification';
import CtmBtnInput from '../Common/Input/CtmBtnInput';
import CtmIconInput from '../Common/Input/CtmIconInput';
import { GuestHook } from '../Hooks/GuestHook';
import { useState } from 'preact/hooks';
import Switch from '../Common/Struct/Switch';
import { GuestState } from '../Model/GuestState';
import { HookedComponent } from '../Framework/HookedComponent';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';
import Column from '../Common/Struct/Column';

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
				<Body
					header={
						<div style="border-bottom:15px solid rgb(27, 27, 27); background-color:rgb(31, 31, 31);">
							<Navbar />
							<div
								class="square"
								style="padding-top:10px;box-shadow: rgb(0,0,0,0.5) 0px 0px 10px 0px inset;"
							>
								<Column>
									<CtmBtnInput
										max={15}
										type={'text'}
										value={this.Hook.State.PlayerName}
										label={'Name'}
										onInput={(e: any) => this.Hook.SetUsername(e.target.value as string)}
										onClick={() => this.Hook.Randomize()}
										icon={'fas fa-random'}
									/>
									<CtmIconInput
										type={'text'}
										value={this.Hook.State.filter}
										icon={'fas fa-filter'}
										isEditable={true}
										onInput={(e: any) => this.Hook.SetFilter(e.target.value)}
									/>
									<CtmIconInput
										type={'text'}
										value={this.Hook.State.Password}
										icon={'fas fa-lock'}
										isEditable={true}
										onInput={(e: any) => this.Hook.SetPassword(e.target.value)}
									/>
								</Column>
							</div>
						</div>
					}
					content={
						<Grid
							left={<span />}
							right={
								<Switch
									isLeft={this.Hook.State.Rooms.length === 0}
									left={
										<tbody>
											<tr class="d-flex">
												<td class="align-self-center">No room available...</td>
											</tr>
										</tbody>
									}
									right={
										<tbody>
											{this.Hook.State.Rooms.map((roomInfo) => {
												return (
													<tr class="d-flex">
														<td class="align-self-center">
															<SmBtn
																OnClick={() => this.Hook.Join(roomInfo.Name)}
																Color={ColorKind.Black}
															>
																Join
															</SmBtn>
														</td>
														<td class="align-self-center">
															<Visible isVisible={roomInfo.Country !== 'na'}>
																<span
																	class={`fp fp-rounded ${roomInfo.Country.toLocaleLowerCase()}`}
																/>
															</Visible>
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
									OnClick={() => {
										this.Hook.Back();
									}}
									Color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn
									OnClick={() => {
										this.Hook.Refresh();
									}}
									Color={ColorKind.Red}
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
