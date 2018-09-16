import { h, Component } from 'preact';

import './App.css';
import Boxes from './App/Boxes';
import Editor from './App/Editor';
import Outliner from './App/Outliner';

export default function App() {
	return (
		<div class="app">
			<main>
				<Outliner />
				<Boxes />
				<Editor />
			</main>
			<footer>
				<h2>boxboxhtml</h2>
				<a href="https://twitter.com/SeanSLeBlanc">Contact</a>
			</footer>
		</div>
	);
}
