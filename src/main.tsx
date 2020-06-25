import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import CanvasComponent from './Components/Canvas/CanvasComponent';
import CampaignComponent from './Components/Campaign/CampaignComponent';
import OffHostComponent from './Components/Network/Host/Off/OffHostComponent';
import OnHostComponent from './Components/Network/Host/On/OnHostComponent';
import OffJoinComponent from './Components/Network/Join/Off/OffJoinComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/CommonStyle.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

render(
	<Router>
		<HomeComponent path="/Home" />
		<SinglePlayerComponent path="/SinglePlayer" />
		<CampaignComponent path="/Campaign" />
		<CanvasComponent path="/Canvas" />
		<OffHostComponent path="/OffHost" />
		<OnHostComponent path="/OnHost/:serverName/:playerName/:isAdmin" />
		<OffJoinComponent path="/OffJoin" />
		<LoadingComponent path="/Loading" default />
	</Router>,
	document.querySelector('#app')
);
