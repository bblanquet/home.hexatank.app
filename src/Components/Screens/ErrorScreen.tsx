import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';

export default class ErrorScreen extends Component {
	private Back() {
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<Redirect>
				<StatBar />
				<div class="container-center">
					<Face eyes={[]} mouths={[]} face={'fill-exception'} />
					<div class="text-detail shadowEffect width80percent">
						<h5 class="card-title">OOPS an error occured</h5>
						<div>{GameContext.Error.message}</div>
						<p />
						<div class="sub-text-detail max200Height">{GameContext.Error.stack}</div>
					</div>
					<p />
					<Btn
						callBack={() => {
							this.Back();
						}}
						color={ColorKind.Black}
					>
						<Icon Value="fas fa-undo-alt" /> Back
					</Btn>
				</div>
			</Redirect>
		);
	}
}
