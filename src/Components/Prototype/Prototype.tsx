import { h, Component } from 'preact';

import PanelComponent from '../Common/Panel/PanelComponent';

export default class PrototypeComponent extends Component<any, { percentage: number }> {
	constructor() {
		super();
	}

	componentDidMount() {}

	render() {
		return <PanelComponent />;
	}
}
