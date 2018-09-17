import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, getDragging, setDragging } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';

import Gizmo from './Gizmo';

import './GizmoTranslate.css';

export class GizmoTranslate extends Component {
	onMouseDownX = event => {
		return this.gizmo.getWrappedInstance().startDragging(event, 'x');
	}
	onMouseDownY = event => {
		return this.gizmo.getWrappedInstance().startDragging(event, 'y');
	}
	onMouseDownBoth = event => {
		return this.gizmo.getWrappedInstance().startDragging(event, 'both');
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
		return (
			<Gizmo onDrag={this.onDrag} boxId={id} ref={gizmo => this.gizmo = gizmo}>
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
