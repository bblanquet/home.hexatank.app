import { h, Component } from 'preact';
import { SizeKind } from '../../Model/Sizekind';
import { Face } from '../Face';

export default class YellowFace extends Component<
	{
		Size: SizeKind;
	},
	{}
> {
	render() {
		return <Face Size={this.props.Size} Eyes={[]} Mouths={[]} Face={'fill-yellow-face'} />;
	}
}
