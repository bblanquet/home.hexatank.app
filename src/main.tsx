import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import CanvasComponent from './Components/Canvas/CanvasComponent';
import LightCanvasComponent from './Components/LightCanvas/LightCanvasComponent';
import CampaignComponent from './Components/Campaign/CampaignComponent';
import BlueCampaignComponent from './Components/Campaign/BlueCampaignComponent';
import GuestComponent from './Components/Network/Guest/GuestComponent';
import CreatingHostComponent from './Components/Network/Creating/CreatingHostComponent';
import HostingComponent from './Components/Network/Host/HostingComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import PopupComponent from './Components/Popup/PopupComponent';
import PlaybackComponent from './Components/Playback/PlaybackComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/CommonStyle.scss';
import './Components/Style/Circular.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { Groups } from './Core/Utils/Collections/Groups';
import { Curve } from './Core/Utils/Stats/Curve';
import { StatsKind } from './Core/Utils/Stats/StatsKind';
import { DateValue } from './Core/Utils/Stats/DateValue';
import { GameStatus } from './Components/Canvas/GameStatus';

function Context() {
	const c = new Groups<Curve>();
	c.Add(
		StatsKind[StatsKind.Cell],
		new Curve(
			[
				new DateValue(GetDuration(0), 1),
				new DateValue(GetDuration(3), 2),
				new DateValue(GetDuration(5), 5),
				new DateValue(GetDuration(7), 1)
			],
			'#4287f5'
		)
	);
	c.Add(
		StatsKind[StatsKind.Cell],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#f54242'
		)
	);

	c.Add(
		StatsKind[StatsKind.Diamond],
		new Curve(
			[
				new DateValue(GetDuration(0), 1),
				new DateValue(GetDuration(3), 2),
				new DateValue(GetDuration(5), 5),
				new DateValue(GetDuration(7), 1)
			],
			'#f54293'
		)
	);
	c.Add(
		StatsKind[StatsKind.Energy],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#f542f5'
		)
	);
	c.Add(
		StatsKind[StatsKind.Unit],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#42f545'
		)
	);
	return c;
}

function GetDuration(seconds: number): number {
	return new Date(new Date().getTime()).setSeconds(seconds) - new Date().getTime();
}

render(
	<Router>
		<HomeComponent path="/Home" />
		<SinglePlayerComponent path="/SinglePlayer" />
		<CampaignComponent path="/Campaign" />
		<BlueCampaignComponent path="/BlueCampaignComponent" />
		<CanvasComponent path="/Canvas" />
		<LightCanvasComponent path="/LightCanvas" />
		<CreatingHostComponent path="/CreatingHost" />
		<HostingComponent path="/Hosting/:RoomName/:playerName/:isAdmin" />
		<GuestComponent path="/OffJoin" />
		<PlaybackComponent path="/Playback" />
		<LoadingComponent path="/Loading" default />
		<PopupComponent path="/Popup" curves={Context()} status={GameStatus.Won} context={{}} />
	</Router>,
	document.querySelector('#app')
);
