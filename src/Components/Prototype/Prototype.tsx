import { h, Component } from 'preact';
import { Point } from '../../Core/Utils/Geometry/Point';
import LightDarkBtn from '../Common/Button/Standard/LightDarkBtn';
import CircularV2Component from '../Common/CircularV2/CircularV2';

import PanelComponent from '../Common/Panel/PanelComponent';

export default class PrototypeComponent extends Component<any, { percentage: number }> {
	constructor() {
		super();
	}

	componentDidMount() {}

	render() {
		return (
			<PanelComponent>
				<CircularV2Component OnCancel={() => {}}>
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-influence" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-thunder" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-shield" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-money" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-power" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-poison" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-speed" Point={new Point(0, 0)} />
					<LightDarkBtn CallBack={() => {}} Amount={`2`} Icon="fill-medic" Point={new Point(0, 0)} />
				</CircularV2Component>
			</PanelComponent>
		);
	}
}
