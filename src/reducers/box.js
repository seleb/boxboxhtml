import { generate } from 'shortid';
import { getSelectedBox, getGridOffset, getGridAnchor } from "./ui";
import { clamp } from '../utils';

// actions
export const BOX_CREATE = 'box:create';
export const BOX_DELETE = 'box:delete';
export const BOX_NAME_SET = 'box:name:set';
export const BOX_OFFSET_SET = 'box:offset:set';
export const BOX_ANCHOR_SET = 'box:anchor:set';

// action creators
export function createBox(parent = 'root') {
	return { type: BOX_CREATE, id: generate(), parent };
}

export function deleteBox(id = '') {
	return { type: BOX_DELETE, id };
}

export function setOffset({ id = '', offsetLeft = 0, offsetRight = 0, offsetTop = 0, offsetBottom = 0 }) {
	return { type: BOX_OFFSET_SET, id, offsetLeft, offsetRight, offsetTop, offsetBottom };
}

export function setAnchor({ id = '', anchorLeft = 0, anchorRight = 0, anchorTop = 0, anchorBottom = 0 }) {
	return { type: BOX_ANCHOR_SET, id, anchorLeft, anchorRight, anchorTop, anchorBottom };
}

// reducer

const initialBox = {
	// px offset from anchor
	offsetLeft: 0,
	offsetRight: 0,
	offsetTop: 0,
	offsetBottom: 0,
	// % anchor from parent
	anchorLeft: 0,
	anchorRight: 1,
	anchorTop: 0,
	anchorBottom: 1,
};
const initialState = {
	byId: {
		root: initialBox,
	},
	children: {
		root: [],
	},
	parents: {},
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case BOX_CREATE:
			return {
				...state,
				byId: {
					...state.byId,
					[action.id]: initialBox,
				},
				children: {
					...state.children,
					[action.parent]: state.children[action.parent].concat(action.id),
					[action.id]: [],
				},
				parents: {
					...state.parents,
					[action.id]: action.parent,
				},
			};
		case BOX_DELETE:
			{
				const deleteRecurse = (state = {}, id = '') => {
					const {
						byId: {
							[id]: deleted = {},
							...byId,
						},
						children: {
							[id]: deletedChildren = [],
							...children,
						},
						parents: {
							[id]: parent,
							...parents,
						},
					} = state;
					children[parent] = (children[parent] || []).filter(child => child !== id);
					return deletedChildren.reduce((result = {}, child = '') => {
						return deleteRecurse(result, child);
					}, { byId, children, parents });
				};
				const newState = deleteRecurse(state, action.id);
				return newState;
			}
		case BOX_OFFSET_SET:
		case BOX_ANCHOR_SET:
			return {
				...state,
				byId: {
					...state.byId,
					[action.id]: reducerBox(state.byId[action.id], action),
				},
			}
		default:
			return state;
	}
}

export function reducerBox(state = initialBox, action) {
	switch (action.type) {
		case BOX_OFFSET_SET:
			return {
				...state,
				offsetLeft: action.offsetLeft,
				offsetRight: action.offsetRight,
				offsetTop: action.offsetTop,
				offsetBottom: action.offsetBottom,
			};
		case BOX_ANCHOR_SET:
			return {
				...state,
				anchorLeft: action.anchorLeft,
				anchorRight: action.anchorRight,
				anchorTop: action.anchorTop,
				anchorBottom: action.anchorBottom,
			};
	}
}

// selectors
export const getState = ({ box = {} } = {}) => box;
export const getById = (state) => {
	const { byId = {} } = getState(state);
	return byId;
};
export const getBoxById = (state, id) => {
	let {
		[id]: {
			offsetLeft = 0,
			offsetRight = 0,
			offsetTop = 0,
			offsetBottom = 0,
			anchorLeft = 0,
			anchorRight = 0,
			anchorTop = 0,
			anchorBottom = 0,
		} = {},
	} = getById(state, id);

	const gridAnchor = getGridAnchor(state);
	if (gridAnchor > 0) {
		anchorRight = Math.round(anchorRight * gridAnchor) / gridAnchor;
		anchorLeft = Math.round(anchorLeft * gridAnchor) / gridAnchor;
		anchorTop = Math.round(anchorTop * gridAnchor) / gridAnchor;
		anchorBottom = Math.round(anchorBottom * gridAnchor) / gridAnchor;
	}
	const gridOffset = getGridOffset(state);
	if (gridOffset > 0) {
		offsetRight = Math.round(offsetRight / gridOffset) * gridOffset;
		offsetLeft = Math.round(offsetLeft / gridOffset) * gridOffset;
		offsetTop = Math.round(offsetTop / gridOffset) * gridOffset;
		offsetBottom = Math.round(offsetBottom / gridOffset) * gridOffset;
	}
	return {
		offsetLeft: parseFloat(offsetLeft),
		offsetRight: parseFloat(offsetRight),
		offsetTop: parseFloat(offsetTop),
		offsetBottom: parseFloat(offsetBottom),
		anchorLeft: parseFloat(anchorLeft),
		anchorRight: parseFloat(anchorRight),
		anchorTop: parseFloat(anchorTop),
		anchorBottom: parseFloat(anchorBottom),
	};
};
export const getSelectedBoxObj = (state) => {
	const id = getSelectedBox(state);
	return getBoxById(state, id);
};
export const getChildren = (state) => {
	const { children = {} } = getState(state);
	return children;
};
export const getChildrenForId = (state, id) => {
	const {
		[id]: children = []
	} = getChildren(state);
	return children;
};
