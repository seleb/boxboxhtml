import { h, Component, Fragment } from 'preact';

import './Box.css';
import { connect } from 'preact-redux';
import { getSelectedBox, selectBox } from '../../reducers/ui';
import { getBoxById, getChildrenForId, createBox, setAnchor } from '../../reducers/box';
let num = 10;
export class Box extends Component {
	componentDidMount() {
		if (num > 0) {
			const n = Math.floor(Math.random() * 2) + 1;
			num -= n;
			for (let i = 0; i < n; ++i) {
				this.props.createBox(this.props.id);
			}
		}
		if (this.props.id !== 'root') {
			this.props.setAnchor({
				id: this.props.id,
				anchorLeft: Math.random() * 0.5,
				anchorRight: Math.random() * 0.5 + 0.5,
				anchorTop: Math.random() * 0.5,
				anchorBottom: Math.random() * 0.5 + 0.5,
			});
		}
	}

	onClick = ({
		target,
		currentTarget,
	}) => {
		if (target !== currentTarget) {
			return;
		}
		if (!this.props.selected) {
			this.props.selectBox(this.props.id);
		}
	}

	render({
		id = '',
		selected = false,
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 1,
		anchorTop = 0,
		anchorBottom = 1,
		children = [],
	}) {
		const anchorStyle = {
			top: `${anchorTop * 100}%`,
			bottom: `${(1 - anchorBottom) * 100}%`,
			left: `${anchorLeft * 100}%`,
			right: `${(1 - anchorRight) * 100}%`,
		};
		const offsetStyle = {
			top: `${offsetTop}px`,
			bottom: `${offsetBottom}px`,
			left: `${offsetLeft}px`,
			right: `${offsetRight}px`,
		};
		const style = {
			top: `calc(${anchorStyle.top} + ${offsetStyle.top})`,
			bottom: `calc(${anchorStyle.bottom} + ${offsetStyle.bottom})`,
			left: `calc(${anchorStyle.left} + ${offsetStyle.left})`,
			right: `calc(${anchorStyle.right} + ${offsetStyle.right})`,
		};
		return (
			<Fragment>
				<div class={`box ${selected ? 'selected' : ''}`} onClick={this.onClick} style={style}>
					{id}
					<ol class="children">
					{children.map(child => <li key={child}><BoxConnected id={child} /></li>)}
					</ol>
				</div>
			<div class="box-anchor" style={anchorStyle}>
					<div class="box-offset" style={offsetStyle} />
				</div>
			</Fragment>
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

const BoxConnected = connect(mapStateToProps, mapDispatchToProps)(Box);

export default BoxConnected;
