import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { generate } from 'shortid';
import { getDragging, setDragging } from '../../reducers/ui';

import './Gizmo.css';

export class Gizmo extends Component {
	componentDidMount() {
		this.id = generate();
	}
	onMouseUp = event => {
		event.preventDefault();
		event.stopPropagation();
		// stop dragging
		this.props.stopDragging();
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('mousemove', this.onMouseMove);
		return false;
	}
	onMouseMove = event => {
		event.preventDefault();
		event.stopPropagation();
		const {
			dragging = false,
		} = this.props;
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		const {
			x = 0,
			y = 0,
		} = this.props.getMousePos({
			clientX,
			clientY,
			...this.parent,
		});
		const drag = {
			deltaX: x - this.x,
			deltaY: y - this.y,
		};
		this.x = x;
		this.y = y;
		this.props.onDrag(drag);
		return false;
	}

	startDragging = event => {
		event.preventDefault();
		event.stopPropagation();
		// get parent dimensions for calculating new anchor positions
		const parent = this.gizmo.closest('.box'); // :/
		const {
			left = 0,
			right = 0,
			top = 0,
			bottom = 0,
		} = parent.getBoundingClientRect();
		this.parent = {
			parentX: left,
			parentY: top,
			parentWidth: right - left,
			parentHeight: bottom - top,
		};
		// get current mouse position as starting point to calc deltas
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		const {
			x = 0,
			y = 0,
		} = this.props.getMousePos({
			clientX,
			clientY,
			...this.parent,
		});
		this.x = x;
		this.y = y;
		this.props.startDragging(this.id);
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
		return false;
	}

	render({
		children = [],
		draggingId = '',
	}) {
		const isDragging = draggingId === this.id;
		if (draggingId && !isDragging) {
			return;
		}
		return (
			<div class={`gizmo ${isDragging ? 'selected' : ''}`} ref={gizmo => this.gizmo = gizmo}>{children}</div>
		);
	}
}

export function mapStateToProps(state) {
	return {
		draggingId: getDragging(state),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		startDragging: id => dispatch(setDragging(id)),
		stopDragging: () => dispatch(setDragging()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(Gizmo);
