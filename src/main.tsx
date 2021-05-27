import './Register';
import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import TrainingComponent from './Components/Campaign/TrainingComponent';
import ErrorComponent from './Components/Error/ErrorComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import GameCanvasComponent from './Components/Canvas/Game/GameCanvasComponent';
import RecordCanvasComponent from './Components/Canvas/Record/RecordCanvasComponent';
import CamouflageComponent from './Components/Canvas/Camouflage/CamouflageComponent';
import CampaignComponent from './Components/Campaign/CampaignComponent';
import BlueCampaignComponent from './Components/Campaign/BlueCampaignComponent';
import BadgeComponent from './Components/Badge/BagdeComponent';
import GuestComponent from './Components/Network/Guest/GuestComponent';
import CreatingHostComponent from './Components/Network/Creating/CreatingHostComponent';
import HostingComponent from './Components/Network/Host/HostingComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import ComparerComponent from './Components/Comparer/ComparerComponent';
import PopupComponent from './Components/Popup/PopupComponent';
import RecordComponent from './Components/Record/RecordComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/CommonStyle.scss';
import './Components/Style/CircularMenu.css';
import './Components/Style/IconStyle.css';
import './Components/Style/BtnStyle.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { GameStatus } from './Core/Framework/GameStatus';
import { Context } from './Context';
import { RecordObject } from './Core/Framework/Record/RecordObject';

const App = (e: any) => {
	return (
		<Router>
			<HomeComponent path="/Home" />
			<LoadingComponent path="/Loading" default />
			<ErrorComponent path="/Error" />
			<SinglePlayerComponent path="/SinglePlayer" />
			<CampaignComponent path="/Campaign" />
			<TrainingComponent path="/Training" />
			<BlueCampaignComponent path="/BlueCampaignComponent" />
			<GameCanvasComponent path="/Canvas" />
			<BadgeComponent path="/Badge" />
			<RecordCanvasComponent path="/RecordCanvas" />
			<CreatingHostComponent path="/CreatingHost" />
			<HostingComponent path="/Hosting" />
			<CamouflageComponent path="/Camouflage" />
			<GuestComponent path="/OffJoin" />
			<RecordComponent path="/Record" />
			<PopupComponent
				path="/Popup"
				points={10}
				curves={Context()}
				status={GameStatus.Won}
				context={new RecordObject()}
			/>
			<ComparerComponent path="/Comparer" />
		</Router>
	);
};

render(<App />, document.body);
