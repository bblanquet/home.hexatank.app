import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { CustomerHook } from '../Hooks/CustomerHook';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Notification from '../Components/Notification';
import Switch from '../Components/Switch';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CustomerState } from '../Model/CustomerState';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Struct from '../Components/Struct';
import Navbar from '../Components/Navbar';

export default class MonitorScreen extends HookedComponent<{}, CustomerHook, CustomerState> {
	public GetDefaultHook(): CustomerHook {
		const [ state, setState ] = useState(CustomerHook.DefaultState());
		return new CustomerHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<span>
				<Struct
					header={<Navbar />}
					content={
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
															<SmBtn
																callBack={() => this.Hook.Play(error)}
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
