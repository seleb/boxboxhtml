import { h, Component } from 'preact';

import './Editor.css';
import { connect } from 'preact-redux';
import { getSelectedBox, getGridAnchor, getGridOffset, setGridAnchor, setGridOffset } from '../../reducers/ui';
import { getBoxById, getChildrenForId, setOffset, setAnchor } from '../../reducers/box';
import Export from './Export';

export function OffsetCtrl({
	name = '',
	value = 0,
	onInput,
	step = 'any',
}) {
	const labelName = `offset${name}`;
	return (
		<div class="ctrl ctrl-offset">
			<label htmlFor={labelName}>{name}</label>
			<input name={labelName} id={labelName} type="number" step={step} value={value} onInput={onInput} />
			<label htmlFor={labelName}>px</label>
		</div>
	);
}

export class Editor extends Component {
	onInputOffset = ({
		currentTarget: {
			name = '',
			value = 0,
		},
	}) => {
		const {
			offsetLeft = 0,
			offsetRight = 0,
			offsetTop = 0,
			offsetBottom = 0,
		} = this.props;
		this.props.setOffset({
			id: this.props.id,
			...{ offsetLeft, offsetRight, offsetTop, offsetBottom },
			[name]: value,
		});
	}

	onInputAnchor = ({
		currentTarget: {
			name = '',
			value = 0,
		},
	}) => {
		const {
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = this.props;
		this.props.setAnchor({
			id: this.props.id,
			...{ anchorLeft, anchorRight, anchorTop, anchorBottom },
			[name]: value,
		});
	}

	onInputGridAnchor = ({
		currentTarget: {
			value = 0,
		},
	}) => {
		this.props.setGridAnchor(value);
	}

	onInputGridOffset = ({
		currentTarget: {
			value = 0,
		},
	}) => {
		this.props.setGridOffset(value);
	}

	render({
		id = '',
		offsetLeft = 0,
		offsetRight = 0,
		offsetTop = 0,
		offsetBottom = 0,
		anchorLeft = 0,
		anchorRight = 1,
		anchorTop = 0,
		anchorBottom = 1,
		gridAnchor = 0,
		gridOffset = 0,
	}) {
		return (
			<div class="editor">
				<section class="section-grid">
					<h2>Grid</h2>
					<label htmlFor="gridAnchor">Anchor <input type="number" min="0" max="100" value={gridAnchor} onInput={this.onInputGridAnchor} /> segments</label>
					<label htmlFor="gridOffset">Offset <input type="number" min="0" value={gridOffset} onInput={this.onInputGridOffset} />px</label>
				</section>
				<section class="section-offsets">
					<h2>Offset</h2>
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetLeft} name="Left" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetRight} name="Right" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetTop} name="Top" />
					<OffsetCtrl step={gridOffset} onInput={this.onInputOffset} value={offsetBottom} name="Bottom" />
				</section>
				<section class="section-anchors">
					<h2>Anchor</h2>
					<label htmlFor="anchorLeft">Left</label>
					<input name="anchorLeft" type="range" min="0" max={anchorRight} step="any" value={anchorLeft} onInput={this.onInputAnchor} />
					<input name="anchorLeft" type="number" min="0" max={anchorRight} step="0.1" value={anchorLeft} onInput={this.onInputAnchor} />
					<label htmlFor="anchorRight">Right</label>
					<input name="anchorRight" type="range" min={anchorLeft} max="1" step="any" value={anchorRight} onInput={this.onInputAnchor} />
					<input name="anchorRight" type="number" min={anchorLeft} max="1" step="0.1" value={anchorRight} onInput={this.onInputAnchor} />
					<label htmlFor="anchorTop">Top</label>
					<input name="anchorTop" type="range" min="0" max={anchorBottom} step="any" value={anchorTop} onInput={this.onInputAnchor} />
					<input name="anchorTop" type="number" min="0" max={anchorBottom} step="0.1" value={anchorTop} onInput={this.onInputAnchor} />
					<label htmlFor="anchorBottom">Bottom</label>
					<input name="anchorBottom" type="range" min={anchorTop} max="1" step="any" value={anchorBottom} onInput={this.onInputAnchor} />
					<input name="anchorBottom" type="number" min={anchorTop} max="1" step="0.1" value={anchorBottom} onInput={this.onInputAnchor} />
				</section>
				<section class="section-export">
					<h2>Export</h2>
					<Export />
				</section>
			</div>
		);
	}
}

export function mapStateToProps(state) {
	const id = getSelectedBox(state);
	return {
		id,
		...getBoxById(state, id),
		children: getChildrenForId(state, id),
		gridAnchor: getGridAnchor(state),
		gridOffset: getGridOffset(state),
	};
}

const mapDispatchToProps = {
	setOffset,
	setAnchor,
	setGridAnchor,
	setGridOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
