// actions
export const UI_BOX_SELECT = 'ui:box:select';
export const UI_DRAGGING_SET = 'ui:dragging:set';
export const UI_GRIDANCHOR_SET = 'ui:gridanchor:set';
export const UI_GRIDOFFSET_SET = 'ui:gridoffset:set';

// action creators
export function selectBox(box = '') {
	return { type: UI_BOX_SELECT, box };
}
export function setDragging(id = '') {
	return { type: UI_DRAGGING_SET, id };
}
export function setGridAnchor(grid = 0) {
	return { type: UI_GRIDANCHOR_SET, grid };
}
export function setGridOffset(grid = 0) {
	return { type: UI_GRIDOFFSET_SET, grid };
}

// reducer
const initialState = {
	selectedBox: 'root',
	dragging: '',
	gridAnchor: 10,
	gridOffset: 10,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UI_BOX_SELECT:
			return {
				...state,
				selectedBox: action.box,
			};
		case UI_DRAGGING_SET:
			return {
				...state,
				dragging: action.id,
			};
		case UI_GRIDANCHOR_SET:
			return {
				...state,
				gridAnchor: action.grid,
			};
		case UI_GRIDOFFSET_SET:
			return {
				...state,
				gridOffset: action.grid,
			};
		default:
			return state;
	}
}

// selectors
export const getState = ({ ui = {} } = {}) => ui;
export const getSelectedBox = (state) => {
	const { selectedBox = '' } = getState(state);
	return selectedBox;
};
export const getDragging = (state) => {
	const { dragging = '' } = getState(state);
	return dragging;
};
export const getGridAnchor = (state) => {
	const { gridAnchor = 0 } = getState(state);
	return Math.max(0, Math.floor(gridAnchor));
};
export const getGridOffset = (state) => {
	const { gridOffset = 0 } = getState(state);
	return Math.max(0, Math.floor(gridOffset));
};
