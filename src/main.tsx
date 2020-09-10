import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import CanvasComponent from './Components/Canvas/CanvasComponent';
import CampaignComponent from './Components/Campaign/CampaignComponent';
import GuestComponent from './Components/Network/Guest/GuestComponent';
import CreatingHostComponent from './Components/Network/Creating/CreatingHostComponent';
import HostingComponent from './Components/Network/Host/HostingComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import CircularComponent from './Components/Circular/CircularComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/CommonStyle.scss';
import './Components/Style/Circular.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { BtnInfo } from './Components/Circular/BtnInfo';

var btn = [
	new BtnInfo(() => {}, 'fill-influence', 4),
	new BtnInfo(() => {}, 'fill-thunder', 4),
	new BtnInfo(() => {}, 'fill-shield', 4),
	new BtnInfo(() => {}, 'fill-money', 4),
	new BtnInfo(() => {}, 'fill-power', 4),
	new BtnInfo(() => {}, 'fill-poison', 4),
	new BtnInfo(() => {}, 'fill-speed', 4),
	new BtnInfo(() => {}, 'fill-medic', 4)
];

render(
	<Router>
		<HomeComponent path="/Home" />
		<SinglePlayerComponent path="/SinglePlayer" />
		<CampaignComponent path="/Campaign" />
		<CanvasComponent path="/Canvas" />
		<CreatingHostComponent path="/CreatingHost" />
		<HostingComponent path="/Hosting/:RoomName/:playerName/:isAdmin" />
		<GuestComponent path="/OffJoin" />
		<LoadingComponent path="/Loading" default />
		<CircularComponent path="/circular" OnCancel={() => {}} btns={btn} />
	</Router>,
	document.querySelector('#app')
);
