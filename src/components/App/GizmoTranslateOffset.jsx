import { h } from 'preact';

import GizmoOffset from './GizmoOffset';

import './GizmoTranslateOffset.css';

export default function GizmoTranslateOffset({
	id = '',
}) {
	return (
		<div class="gizmo-group gizmo-translate-offset">
			<GizmoOffset offsets={['left', 'right']} />
			<GizmoOffset offsets={['top', 'bottom']} />
			<GizmoOffset offsets={['left', 'right', 'top', 'bottom']} />
		</div>
	);
}
