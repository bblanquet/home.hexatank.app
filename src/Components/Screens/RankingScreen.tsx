import { JSX, h } from 'preact';
import { useState } from 'preact/hooks';
import { RankingHook } from '../Hooks/RankingHook';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Grid from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';
import Notification from '../Components/Notification';
import { HookedComponent } from '../Framework/HookedComponent';
import { PlayerRankState } from '../Model/PlayerRankState';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';
import { RequestState } from '../Model/RequestState';
import Switch from '../Common/Struct/Switch';

export default class RankingScreen extends HookedComponent<{}, RankingHook, PlayerRankState> {
	public GetDefaultHook(): RankingHook {
		const [ state, setState ] = useState(RankingHook.DefaultState());
		return new RankingHook(state, setState);
	}

	public GetRank(rank: number) {
		if (rank === 1) {
			return (
				<span class="badge badge-dark">
					<span style="color:#ffcb2e">
						<Icon Value="fas fa-medal" />
					</span>
				</span>
			);
		} else if (rank === 2) {
			return (
				<span class="badge badge-dark">
					<span style="color:#e0e0e0">
						<Icon Value="fas fa-medal" />
					</span>
				</span>
			);
		} else if (rank === 3) {
			return (
				<span class="badge badge-dark">
					<span style="color:#eb5026">
						<Icon Value="fas fa-medal" />
					</span>
				</span>
			);
		} else {
			return <span class="badge badge-dark"> #{rank} </span>;
		}
	}

	public Rendering(): JSX.Element {
		return (
			<span>
				<Body
					header={<Navbar />}
					content={
						<Grid
							left={
								<thead>
									<tr class="d-flex">
										<th class="align-text-center" style="width:20%">
											#
										</th>
										<th style="width:50%">Name</th>
										<th class="align-text-center" style="width:30%">
											Score
										</th>
									</tr>
								</thead>
							}
							right={
								<Switch
									isLeft={this.Hook.State.State !== RequestState.LOADING}
									left={
										<tbody>
											{this.Hook.State.Players.map((r) => (
												<tr class="d-flex">
													<td class="align-text-center" style="width:20%">
														{this.GetRank(r.rank)}
													</td>
													<td style="width:50%">{r.name}</td>
													<td class="align-text-center" style="width:30%">
														<span class="badge badge-light">{r.score}</span>
													</td>
												</tr>
											))}
										</tbody>
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
