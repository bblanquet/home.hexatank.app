import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { MonitoringHook } from '../Hooks/CustomerHook';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Grid from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Notification from '../Components/Notification';
import Switch from '../Common/Struct/Switch';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CustomerState } from '../Model/CustomerState';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';

export default class MonitorScreen extends HookedComponent<{}, MonitoringHook, CustomerState> {
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
							left={''}
							right={
								<Switch
									isVisible={this.Hook.State.Errors.length === 0}
									left={
										<tbody>
											<tr class="d-flex">
												<td class="align-self-center">
													<Icon Value="fas fa-spinner" /> Loading
												</td>
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
																callBack={() => this.Hook.Play(error.id)}
																color={ColorKind.Black}
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
						/>
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn callBack={() => this.Hook.Back()} color={ColorKind.Black}>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn callBack={() => this.Hook.Refresh()} color={ColorKind.Red}>
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
