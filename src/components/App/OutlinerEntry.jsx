import { h, Component } from 'preact';

import './OutlinerEntry.css';
import { connect } from 'preact-redux';
import { getSelectedBox, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, createBox, setAnchor } from '../../reducers/box';
let num = 10;
export class OutlinerEntry extends Component {
	onClick = ({
		target,
		currentTarget,
	}) => {
		if (target !== currentTarget) {
			return;
		}
		if (!this.props.selected) {
			this.props.selectBox(this.props.id);
		} else {
			this.props.selectBox();
		}
	}

	render({
		id = '',
		selected = false,
		children = [],
	}) {
		return (
			<div class={`outliner-entry ${selected ? 'selected' : ''}`} onClick={this.onClick}>
				{id}
				<ol class="children">
					{children.map(child => <li key={child}><OutlinerEntryConnected id={child} /></li>)}
				</ol>
			</div>
		);
	}
}

export function mapStateToProps(state, { id = '' }) {
	return {
		selected: getSelectedBox(state) === id,
		...getBoxById(state, id),
		children: getChildrenForId(state, id),
	};
}

const mapDispatchToProps = {
	selectBox,
	createBox,
	setAnchor,
};

const OutlinerEntryConnected = connect(mapStateToProps, mapDispatchToProps)(OutlinerEntry);

export default OutlinerEntryConnected;
