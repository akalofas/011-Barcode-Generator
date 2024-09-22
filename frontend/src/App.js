import React, { useState, useRef } from 'react';
import LabelForm from './components/LabelForm';
// import LabelDisplay from './components/LabelDisplay';
import generatePDF from './utils/generatePDF.js';
import './App.css';

const App = () => {
	const [labels, setLabels] = useState([]);
	const labelSheetRef = useRef();

	const handleGenerateLabels = (labelData) => {
		setLabels(labelData);
	};

	const handleGeneratePdf = () => {
		generatePDF(labels);
	}

	const totalLabels = labels.reduce((sum, label) => sum + label.quantity, 0);

	const sheetsNeeded = Math.ceil(totalLabels / 65);

	const labelsOnLastSheet = totalLabels % 65 || 65;

	return (
		<div className='app'>
			<h1>Label Printing App</h1>
			<LabelForm onGenerateLabels={handleGenerateLabels} />
			{totalLabels > 0 && (
				<>
					<p>Total Labels: {totalLabels}</p>
					<p>Pages Needed: {sheetsNeeded} sheets</p>
					<p>
						In the last sheet, there are {65 - labelsOnLastSheet}{' '}
						label(s) left.
					</p>
					<button onClick={handleGeneratePdf}>Generate PDF</button>
				</>
			)}
		</div>
	);
};

export default App;
