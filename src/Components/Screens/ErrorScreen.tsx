import { Component, h } from 'preact';
import { route } from 'preact-router';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import YellowFace from '../Components/Faces/YellowFace';
import StatBar from '../Components/StatBar';
import Body from '../Common/Struct/Body';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { SizeType } from '../Model/SizeType';

export default class ErrorScreen extends Component {
	private Back() {
		route('{{sub_path}}Home', true);
	}

	render() {
		return (
			<Body
				header={<StatBar />}
				content={
					<div class="container-center">
						<YellowFace Size={SizeType.Bg} />
						<div class="text-detail shadowEffect width80percent">
							<h5 class="card-title">OOPS an error occured, we will fix it quickly!</h5>
							<div>{Gameworld.Error.message}</div>
							<p />
							<div class="sub-text-detail max200Height">{Gameworld.Error.stack}</div>
						</div>
					</div>
				}
				footer={
					<div class="navbar nav-inner">
						<SmBtn
							OnClick={() => {
								this.Back();
							}}
							Color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</SmBtn>
					</div>
				}
			/>
		);
	}
}
