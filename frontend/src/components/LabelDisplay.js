import React from 'react';
import './LabelDisplay.css';

const LabelDisplay = ({ labels }) => {
	const labelsPerPage = 65;

	// Function to split labels into chunks of 65
	const chunkLabels = (labels, chunkSize) => {
		const chunks = [];
		for (let i = 0; i < labels.length; i += chunkSize) {
			chunks.push(labels.slice(i, i + chunkSize));
		}
		return chunks;
	};

	// Flatten the labels and then chunk them by 65
	const allLabels = labels.flatMap((label) =>
		Array.from({ length: label.quantity }).map(() => label)
	);
	const labelChunks = chunkLabels(allLabels, labelsPerPage);

	return (
		<div>
			{labelChunks.map((labelChunk, pageIndex) => (
				<div
					key={pageIndex}
					className='label-sheet'
				>
					{labelChunk.map((label, index) => (
						// Calculate grid position for the label
						<div
							key={index}
							className='label'
							style={{
								gridColumn: `${(index % 5) * 2 + 1} / span 1`,
								gridRow: `${
									Math.floor(index / 5) * 2 + 1
								} / span 1`,
							}}
						>
							<div className='label-product-code'>
								{label.productCode}
							</div>
							<div className='label-size-range'>
								{label.sizeRange
									.slice(
										label.sizeRange.indexOf(label.fromSize),
										label.sizeRange.indexOf(label.toSize) +
											1
									)
									.map((size) => (
										<span
											key={size}
											className={
												size === label.printSize
													? 'circle'
													: ''
											}
										>
											{size}
										</span>
									))}
							</div>
							<div className='label-barcode'>
								<img
									src={`https://barcode.tec-it.com/barcode.ashx?data=${label.barcode}&code=EAN13&dpi=96`}
									alt='barcode'
								/>
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default LabelDisplay;
