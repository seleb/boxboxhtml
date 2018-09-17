// actions
export const UI_BOX_SELECT = 'ui:box:select';
export const UI_DRAGGING_SET = 'ui:dragging:set';

// action creators
export function selectBox(box = '') {
	return { type: UI_BOX_SELECT, box };
}
export function setDragging(id = '') {
	return { type: UI_DRAGGING_SET, id };
}

// reducer
const initialState = {
	selectedBox: '',
	dragging: '',
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UI_BOX_SELECT:
			return {
				...state,
				selectedBox: action.box === 'root' ? '' : action.box,
			};
		case UI_DRAGGING_SET:
			return {
				...state,
				dragging: action.id,
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
