import { h, Component } from 'preact';

import './Gizmo.css';
import { connect } from 'preact-redux';
import { getSelectedBox } from '../../reducers/ui';
import { getBoxById, setAnchor } from '../../reducers/box';
export class Gizmo extends Component {
	constructor(props){
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
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		const deltaX = dragging !== 'y' ? clientX - this.x : 0;
		this.x = clientX;
		const deltaY = dragging !== 'x' ? clientY - this.y : 0;
		this.y = clientY;
		this.props.setAnchor({
			id: this.props.id,
			anchorLeft: this.props.anchorLeft + deltaX / 100,
			anchorRight: this.props.anchorRight + deltaX / 100,
			anchorTop: this.props.anchorTop + deltaY / 100,
			anchorBottom: this.props.anchorBottom + deltaY / 100,
		});
	}

	startDragging = (event) => {
		const {
			clientX = 0,
			clientY = 0,
		} = event;
		this.x = clientX;
		this.y = clientY;
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
	}

	render({}, {
		dragging = false,
	}) {
		return (
			<div class="gizmo" onMouseUp={this.onMouseUp}>
				<div class="gizmo-translate">
					<div class={`x ${dragging==='x' ? 'selected': ''}`} onMouseDown={this.onMouseDownX}/>
					<div class={`y ${dragging==='y' ? 'selected': ''}`} onMouseDown={this.onMouseDownY}/>
					<div class={`both ${dragging==='both' ? 'selected': ''}`} onMouseDown={this.onMouseDownBoth}/>
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
