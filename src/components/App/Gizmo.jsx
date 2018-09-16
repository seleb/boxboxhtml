import { h, Component } from 'preact';

import './Gizmo.css';
import { connect } from 'preact-redux';
import { getSelectedBox } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';
export class Gizmo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dragging: false,
		};
	}
	onMouseDownX = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			dragging: 'x',
		});
		this.startDragging(event);
	}
	onMouseDownY = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			dragging: 'y',
		});
		this.startDragging(event);
	}
	onMouseDownBoth = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			dragging: 'both',
		});
		this.startDragging(event);
	}
	onMouseUp = event => {
		event.preventDefault();
		event.stopPropagation();
		// stop dragging
		this.setState({
			dragging: false,
		});
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('mousemove', this.onMouseMove);
	}
	onMouseMove = event => {
		event.preventDefault();
		event.stopPropagation();
		const {
			dragging = false,
		} = this.state;
		const { x = 0, y = 0 } = this.getMousePos(event);
		const deltaX = dragging !== 'y' ? x - this.x : 0;
		this.x = x;
		const deltaY = dragging !== 'x' ? y - this.y : 0;
		this.y = y;
		this.props.setAnchor({
			id: this.props.id,
			anchorLeft: this.props.anchorLeft + deltaX,
			anchorRight: this.props.anchorRight + deltaX,
			anchorTop: this.props.anchorTop + deltaY,
			anchorBottom: this.props.anchorBottom + deltaY,
		});
	}

	getMousePos(event) {
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		return {
			x: (clientX - this.parentX) / this.parentWidth,
			y: (clientY - this.parentY) / this.parentHeight,
		};
	}

	startDragging(event) {
		// get parent dimensions for calculating new anchor positions
		const parent = this.gizmo.parentElement.parentElement.parentElement.parentElement.parentElement; // :/
		const { left = 0, right = 0, top = 0, bottom = 0 } = parent.getBoundingClientRect();
		this.parentX = left;
		this.parentY = right;
		this.parentWidth = right - left;
		this.parentHeight = bottom - top;
		// get current mouse position as starting point to calc deltas
		const { x = 0, y = 0 } = this.getMousePos(event);
		this.x = x;
		this.y = y;
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
	}

	render({ }, {
		dragging = false,
	}) {
		return (
			<div class="gizmo" onMouseUp={this.onMouseUp} ref={gizmo => this.gizmo = gizmo}>
				<div class="gizmo-translate">
					{(!dragging || dragging === 'x') && <div class={`x ${dragging === 'x' ? 'selected' : ''}`} onMouseDown={this.onMouseDownX} />}
					{(!dragging || dragging === 'y') && <div class={`y ${dragging === 'y' ? 'selected' : ''}`} onMouseDown={this.onMouseDownY} />}
					{(!dragging || dragging === 'both') && <div class={`both ${dragging === 'both' ? 'selected' : ''}`} onMouseDown={this.onMouseDownBoth} />}
				</div>
			</div>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	return {
		id,
		...getBoxById(state, id),
	};
}

const mapDispatchToProps = {
	setAnchor,
};

const GizmoConnected = connect(mapStateToProps, mapDispatchToProps)(Gizmo);

export default GizmoConnected;
