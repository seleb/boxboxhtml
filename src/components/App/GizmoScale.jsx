import { h } from 'preact';
import GizmoAnchor from './GizmoAnchor';

import './GizmoScale.css';

export default function GizmoScale({
	id = '',
}) {
	return (
		<div class="gizmo-group gizmo-scale">
			{/* edges */}
			<GizmoAnchor boxId={id} anchors={['top']} />
			<GizmoAnchor boxId={id} anchors={['bottom']} />
			<GizmoAnchor boxId={id} anchors={['left']} />
			<GizmoAnchor boxId={id} anchors={['right']} />
			{/* corners */}
			<GizmoAnchor boxId={id} anchors={['top','left']} />
			<GizmoAnchor boxId={id} anchors={['bottom','left']} />
			<GizmoAnchor boxId={id} anchors={['top','right']} />
			<GizmoAnchor boxId={id} anchors={['bottom','right']} />
		</div>
	);
}
