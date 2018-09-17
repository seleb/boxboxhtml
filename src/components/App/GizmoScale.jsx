import { h } from 'preact';
import GizmoAnchor from './GizmoAnchor';

import './GizmoScale.css';

export default function GizmoScale({
	id = '',
}) {
	return (
		<div class="gizmo-group gizmo-scale">
			<GizmoAnchor boxId={id} anchors={['top']} />
			<GizmoAnchor boxId={id} anchors={['bottom']} />
			<GizmoAnchor boxId={id} anchors={['left']} />
			<GizmoAnchor boxId={id} anchors={['right']} />
		</div>
	);
}
