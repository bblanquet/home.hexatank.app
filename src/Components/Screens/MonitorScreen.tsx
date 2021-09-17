import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { MonitoringHook } from '../Hooks/MonitoringHook';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Grid from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Notification from '../Components/Notification';
import Switch from '../Common/Struct/Switch';
import { HookedComponent } from '../Framework/HookedComponent';
import { MonitoringState } from '../Model/MonitoringState';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';
import { RequestState } from '../Model/RequestState';

export default class MonitorScreen extends HookedComponent<{}, MonitoringHook, MonitoringState> {
	public GetDefaultHook(): MonitoringHook {
		const [ state, setState ] = useState(MonitoringHook.DefaultState());
		return new MonitoringHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<span>
				<Body
					header={<Navbar />}
					content={
						<Grid
							left={<span />}
							right={
								<Switch
									isLeft={this.Hook.State.State !== RequestState.LOADING}
									left={
										<Switch
											isLeft={
												this.Hook.State.State === RequestState.ERROR ||
												this.Hook.State.Errors.length === 0
											}
											left={
												<tbody>
													<tr class="d-flex">
														<td class="align-self-center">No record...</td>
													</tr>
												</tbody>
											}
											right={
												<tbody>
													{this.Hook.State.Errors.map((error) => {
														return (
															<tr class="d-flex">
																<td class="align-self-center">
																	<SmBtn
																		OnClick={() => this.Hook.Play(error.id)}
																		Color={ColorKind.Black}
																	>
																		<Icon Value="fas fa-play-circle" />
																	</SmBtn>
																</td>
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
									right={
										<tbody>
											<tr class="d-flex">
												<td class="align-self-center">
													<Icon Value="fas fa-spinner" /> Loading...
												</td>
											</tr>
										</tbody>
									}
								/>
							}
						/>
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn OnClick={() => this.Hook.Back()} Color={ColorKind.Black}>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn OnClick={() => this.Hook.Refresh()} Color={ColorKind.Red}>
									<Icon Value="fas fa-sync-alt" /> Refresh
								</SmBtn>
							</div>
						</div>
					}
				/>
				<Notification OnNotification={this.Hook.OnNotification} />
			</span>
		);
	}
}
