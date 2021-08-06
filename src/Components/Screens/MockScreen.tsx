import { h, Component } from 'preact';
import Navbar from '../Common/Struct/Navbar';
import Body from '../Common/Struct/Body';
import Column from '../Common/Struct/Column';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import AnimatedIcon from '../Common/Button/Badge/AnimatedIcon';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Line from '../Common/Struct/Line';
import { Face } from '../Components/Face';

export default class MockScreen extends Component<{}, {}> {
	render() {
		return (
			<Body
				header={<Navbar />}
				content={
					<Column>
						<div
							class="d-flex"
							style="flex-direction:row;align-content:space-between;align-items: center; margin:10px"
						>
							<SmBtn OnClick={() => {}} Color={ColorKind.Blue}>
								<Icon Value="fas fa-chevron-left" />
							</SmBtn>
							<Face
								eyes={[ 'fill-green-eyes1', 'fill-green-eyes2' ]}
								mouths={[
									'fill-green-mouth-1',
									'fill-green-mouth-2',
									'fill-green-mouth-3',
									'fill-green-mouth-4'
								]}
								face={'fill-green-face'}
							/>

							<SmBtn OnClick={() => {}} Color={ColorKind.Red}>
								<Icon Value="fas fa-chevron-right" />
							</SmBtn>
						</div>
						<Line>
							<SmBtn OnClick={() => {}} Color={ColorKind.Green}>
								<div class={`fill-campaign max-width`} />
								<Icon Value="fas fa-arrow-alt-circle-right" /> 1
							</SmBtn>
							<SmBtn OnClick={() => {}} Color={ColorKind.Green}>
								<div class={`fill-gold-campaign max-width`}>
									<AnimatedIcon
										values={[ 'fill-light-1', 'fill-light-2', 'fill-light-3', 'fill-light-4' ]}
										frequency={1000}
									/>
								</div>
								<Icon Value="fas fa-arrow-alt-circle-right" /> 2
							</SmBtn>
						</Line>
						<Line>
							<SmBtn OnClick={() => {}} Color={ColorKind.Green}>
								<div class={`fill-campaign max-width`} />
								<Icon Value="fas fa-arrow-alt-circle-right" /> 3
							</SmBtn>
							<SmBtn OnClick={() => {}} Color={ColorKind.Green}>
								<div class={`fill-gold-campaign max-width`}>
									<AnimatedIcon
										values={[ 'fill-light-1', 'fill-light-2', 'fill-light-3', 'fill-light-4' ]}
										frequency={1000}
									/>
								</div>
								<Icon Value="fas fa-arrow-alt-circle-right" /> 4
							</SmBtn>
						</Line>
						<Line>
							<SmBtn OnClick={() => {}} Color={ColorKind.Yellow}>
								<div class={`fill-lock max-width`} />
								<Icon Value="fas fa-arrow-alt-circle-right" /> 5
							</SmBtn>
						</Line>
					</Column>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v 0.8.14</div>
					</div>
				}
			/>
		);
	}
}
