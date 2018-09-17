import { h } from 'preact';

import GizmoAnchor from './GizmoAnchor';

import './GizmoTranslate.css';

export default function GizmoTranslate({
	id = '',
}) {
	return (
		<div class="gizmo-group gizmo-translate">
			<GizmoAnchor anchors={['left', 'right']} />
			<GizmoAnchor anchors={['top', 'bottom']} />
			<GizmoAnchor anchors={['left', 'right', 'top', 'bottom']} />
		</div>
	);
}
