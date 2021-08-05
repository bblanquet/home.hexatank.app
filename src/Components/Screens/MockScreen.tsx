import { h, Component } from 'preact';
import Navbar from '../Common/Struct/Navbar';
import Body from '../Common/Struct/Body';
import Column from '../Common/Struct/Column';
import ImgPicker from '../Common/Picker/ImgPicker';

export default class MockScreen extends Component<{}, {}> {
	render() {
		return (
			<Body
				header={<Navbar />}
				content={
					<Column>
						<ImgPicker
							Items={[
								{ Css: 'fill-sand-tree', Color: '#fece63' },
								{ Css: 'fill-ice-tree', Color: '#acddf3' },
								{ Css: 'fill-forest-tree', Color: '#00a651' }
							]}
							OnSelected={(e: number) => {}}
						/>
						<ImgPicker
							Items={[
								{ Css: 'fill-black-tank', Color: 'white' },
								{ Css: 'fill-red-tank', Color: 'white' },
								{ Css: 'fill-yellow-tank', Color: 'white' },
								{ Css: 'fill-purple-tank', Color: 'white' },
								{ Css: 'fill-blue-tank', Color: 'white' }
							]}
							OnSelected={(e: number) => {}}
						/>
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
