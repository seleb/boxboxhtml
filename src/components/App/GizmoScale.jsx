import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { getSelectedBox, getDragging, setDragging } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';

import Gizmo from './Gizmo';

import './GizmoScale.css';

export class GizmoScale extends Component {
	onMouseDown = event => {
		return this.gizmo.getWrappedInstance().startDragging(event, this.props.dir);
	}
	onDrag = ({
		deltaX = 0,
		deltaY = 0,
	}) => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.props;
		const anchor = {
			anchorLeft,
			anchorRight,
			anchorTop,
			anchorBottom
		};
		switch (this.props.anchor) {
			case 'anchorLeft': anchor.anchorLeft += deltaX; break;
			case 'anchorRight': anchor.anchorRight += deltaX; break;
			case 'anchorTop': anchor.anchorTop += deltaY; break;
			case 'anchorBottom': anchor.anchorBottom += deltaY; break;
			default: break;
		}
		this.props.setAnchor({
			id: this.props.id,
			...anchor,
		});
	}

	render({
		id = '',
		dragging: {
			id: draggingId = '',
			dragging = false,
		} = {},
		anchor = '',
	}) {
		return (
			<Gizmo onDrag={this.onDrag} boxId={id} ref={gizmo => this.gizmo = gizmo}>
				<div class={`gizmo-scale ${anchor} ${dragging ? 'selected' : ''}`} onMouseDown={this.onMouseDown} />
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

const GizmoScaleConnected = connect(mapStateToProps, mapDispatchToProps)(GizmoScale);

export default GizmoScaleConnected;
