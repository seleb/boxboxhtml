import { h, Component } from 'preact';

import './OutlinerEntry.css';
import { connect } from 'preact-redux';
import { getSelectedBox, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, createBox, deleteBox, setAnchor } from '../../reducers/box';

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

	createBox = () => {
		this.props.createBox(this.props.id);
	}

	delete = () => {
		this.props.deleteBox(this.props.id);
	}

	render({
		id = '',
		name = '',
		selected = false,
		children = [],
		depth = 0,
	}) {
		return (
			<div class={`outliner-entry ${selected ? 'selected' : ''}`} onClick={this.onClick}>
				<div class="item">
					<span>{name}</span>
					{selected && id !== 'root' && <button class="delete" onClick={this.delete}>x</button>}
				</div>
				<ul class="children">
					{children.map(child => <li key={child}><OutlinerEntryConnected id={child} depth={depth + 1} /></li>)}
					{selected && <li class="new"><button onClick={this.createBox}>+</button></li>}
				</ul>
			</div>
		);
	}
}

export function mapStateToProps(state, { id = '' }) {
	const {
		name = '',
	} = getBoxById(state, id);
	return {
		selected: getSelectedBox(state) === id,
		name,
		children: getChildrenForId(state, id),
	};
}

const mapDispatchToProps = {
	selectBox,
	deleteBox,
	createBox,
	setAnchor,
};

const OutlinerEntryConnected = connect(mapStateToProps, mapDispatchToProps)(OutlinerEntry);

export default OutlinerEntryConnected;
