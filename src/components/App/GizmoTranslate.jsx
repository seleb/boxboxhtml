import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, getDragging, setDragging } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';

import Gizmo from './Gizmo';

import './GizmoTranslate.css';

export class GizmoTranslate extends Component {
	onMouseDownX = event => {
		event.preventDefault();
		event.stopPropagation();
		this.props.setDragging(this.props.id, 'x');
		return false;
	}
	onMouseDownY = event => {
		event.preventDefault();
		event.stopPropagation();
		this.props.setDragging(this.props.id, 'y');
		return false;
	}
	onMouseDownBoth = event => {
		event.preventDefault();
		event.stopPropagation();
		this.props.setDragging(this.props.id, 'both');
		return false;
	}
	onDrag = ({
		deltaX = 0,
		deltaY = 0,
	}) => {
		this.props.setAnchor({
			id: this.props.id,
			anchorLeft: this.props.anchorLeft + deltaX,
			anchorRight: this.props.anchorRight + deltaX,
			anchorTop: this.props.anchorTop + deltaY,
			anchorBottom: this.props.anchorBottom + deltaY,
		});
	}

	render({
		id = '',
		dragging: {
			id: draggingId = '',
			dragging = false,
		} = {},
	}) {
		if (draggingId && id !== draggingId) {
			return null;
		}
		return (
			<Gizmo onDrag={this.onDrag} id={id} ref={gizmo => this.gizmo = gizmo} dragging={dragging}>
				<div class="gizmo-translate">
					{(!dragging || dragging === 'x') && <div class={`x ${dragging === 'x' ? 'selected' : ''}`} onMouseDown={this.onMouseDownX} />}
					{(!dragging || dragging === 'y') && <div class={`y ${dragging === 'y' ? 'selected' : ''}`} onMouseDown={this.onMouseDownY} />}
					{(!dragging || dragging === 'both') && <div class={`both ${dragging === 'both' ? 'selected' : ''}`} onMouseDown={this.onMouseDownBoth} />}
				</div>
			</Gizmo>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	return {
		id,
		...getBoxById(state, id),
		dragging: getDragging(state),
	};
}

const mapDispatchToProps = {
	setAnchor,
	setDragging,
};

const GizmoTranslateConnected = connect(mapStateToProps, mapDispatchToProps)(GizmoTranslate);

export default GizmoTranslateConnected;
