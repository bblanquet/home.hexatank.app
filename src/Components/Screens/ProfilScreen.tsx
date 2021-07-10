import { h, JSX } from 'preact';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import SmUploadBtn from '../Common/Button/Stylish/SmUploadBtn';
import Grid from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Body from '../Common/Struct/Body';
import Redirect from '../Components/Redirect';
import Switch from '../Common/Struct/Switch';
import Visible from '../Common/Struct/Visible';
import Navbar from '../Common/Struct/Navbar';
import { HookedComponent } from '../Hooks/HookedComponent';
import { ProfilHook } from '../Hooks/ProfilHook';
import { ProfilState } from '../Model/ProfilState';
import { useState } from 'preact/hooks';
import { Env } from '../../Env';

export default class ProfilScreen extends HookedComponent<{}, ProfilHook, ProfilState> {
	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Body
					header={
						<Navbar>
							<SmBtn callBack={() => this.Hook.Delete()} color={ColorKind.Black}>
								<Icon Value="fas fa-trash" /> {this.Hook.State.SelectedRecords.length}
							</SmBtn>
							<SmUploadBtn
								color={ColorKind.Blue}
								icon={'fas fa-file-upload'}
								callBack={(e: any) => this.Hook.Upload(e)}
							/>

							<Visible isVisible={this.Hook.State.SelectedRecords.length === 1}>
								<SmBtn callBack={() => this.Hook.Download()} color={ColorKind.Green}>
									<Icon Value="fas fa-file-download" />
								</SmBtn>
							</Visible>
							<Visible isVisible={this.Hook.State.SelectedRecords.length === 2 && !Env.IsPrd()}>
								<SmBtn
									callBack={() => {
										this.Hook.ToCompare();
									}}
									color={ColorKind.Red}
								>
									<Icon Value="fas fa-chart-pie" />
								</SmBtn>
							</Visible>
						</Navbar>
					}
					content={
						<Grid
							left={
								<thead>
									<tr class="d-flex">
										<th>
											Last games{' '}
											{this.Hook.State.Records.filter((e) => e.Record.IsVictory).length}{' '}
											<span style="color:#8fe336">
												<Icon Value={'fas fa-plus-square'} />
											</span>{' '}
											/ {this.Hook.State.Records.filter((e) => !e.Record.IsVictory).length}{' '}
											<span style="color:#d93232">
												<Icon Value={'fas fa-minus-square'} />
											</span>
										</th>
									</tr>
								</thead>
							}
							right={
								this.Hook.State.Records && this.Hook.State.Records.length === 0 ? (
									<tbody>
										<tr class="d-flex">
											<td class="align-self-center">No record available...</td>
										</tr>
									</tbody>
								) : (
									<tbody>
										{this.Hook.State.Records.map((record) => {
											return (
												<tr class="d-flex">
													<td class="align-self-center">
														<div class="container-center-horizontal">
															<SmActiveBtn
																left={<Icon Value={'fas fa-toggle-off'} />}
																right={<Icon Value={'fas fa-toggle-on'} />}
																leftColor={ColorKind.Red}
																rightColor={ColorKind.Black}
																callBack={() => this.Hook.Select(record)}
																isActive={record.IsSelected}
															/>
															<div class="very-small-left-margin" />
															<SmBtn
																callBack={() => this.Hook.Play(record.Record)}
																color={ColorKind.Black}
															>
																<Icon Value="fas fa-play-circle" />
															</SmBtn>
															<div class="very-small-left-margin">
																<Switch
																	isVisible={record.Record.IsVictory}
																	left={
																		<span style="color:#8fe336">
																			<Icon Value={'fas fa-plus-square'} />
																		</span>
																	}
																	right={
																		<span style="color:#d93232">
																			<Icon Value={'fas fa-minus-square'} />
																		</span>
																	}
																/>{' '}
																{record.Record.Title}
															</div>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								)
							}
						/>
					}
					footer={
						<div class="navbar nav-inner">
							<SmBtn
								callBack={() => {
									this.Hook.ToHome();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</SmBtn>
						</div>
					}
				/>
			</Redirect>
		);
	}
	public GetDefaultHook() {
		return new ProfilHook(useState(ProfilHook.DefaultState()));
	}
}
