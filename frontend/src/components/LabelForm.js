import React, { useState } from 'react';

const LabelForm = ({ onGenerateLabels }) => {
	const [productCode, setProductCode] = useState('');
	const [sizeType, setSizeType] = useState('');
	const [sizeRange, setSizeRange] = useState([]);
	const [fromSize, setFromSize] = useState('');
	const [toSize, setToSize] = useState('');
	const [printSize, setPrintSize] = useState('');
	const [barcode, setBarcode] = useState('');
	const [quantity, setQuantity] = useState(65);
	const [labelData, setLabelData] = useState([]);
	const [editIndex, setEditIndex] = useState(null);

	const handleSizeTypeChange = (event) => {
		const { value } = event.target;
		setSizeType(value);
		setSizeRange(
			value === 'single'
				? ['XS', 'S', 'M', 'L', 'XL', 'XXL']
				: ['S-M', 'L-XL', 'Free Size', 'One Size']
		);
		setFromSize('');
		setToSize('');
		setPrintSize('');
	};

	const handleAddLabel = () => {
		const newLabel = {
			productCode,
			sizeType,
			sizeRange,
			fromSize,
			toSize,
			printSize,
			barcode,
			quantity,
		};

		let updatedLabels;
		if (editIndex !== null) {
			updatedLabels = [...labelData];
			updatedLabels[editIndex] = newLabel;
			setLabelData(updatedLabels);
			setEditIndex(null);
		} else {
			updatedLabels = [...labelData, newLabel];
			setLabelData(updatedLabels);
		}

		resetForm();
		handleGenerate(updatedLabels); // Regenerate labels after adding or updating
	};

	const handleEditLabel = (index) => {
		const labelToEdit = labelData[index];
		setProductCode(labelToEdit.productCode);
		setSizeType(labelToEdit.sizeType);
		setSizeRange(labelToEdit.sizeRange);
		setFromSize(labelToEdit.fromSize);
		setToSize(labelToEdit.toSize);
		setPrintSize(labelToEdit.printSize);
		setBarcode(labelToEdit.barcode);
		setQuantity(labelToEdit.quantity);
		setEditIndex(index);
	};

	const handleDeleteLabel = (index) => {
		const updatedLabels = labelData.filter((_, i) => i !== index);
		setLabelData(updatedLabels);
		handleGenerate(updatedLabels); // Regenerate labels after deleting
	};

	const resetForm = () => {
		setProductCode('');
		setSizeType('');
		setSizeRange([]);
		setFromSize('');
		setToSize('');
		setPrintSize('');
		setBarcode('');
		setQuantity(65);
		setEditIndex(null);
	};

	const handleGenerate = (labels) => {
		onGenerateLabels(labels || labelData);
	};

	return (
		<div>
			<div>
				<label>Product Code:</label>
				<input
					type='text'
					value={productCode}
					onChange={(e) => setProductCode(e.target.value)}
					placeholder='Enter product code'
				/>
			</div>
			<div>
				<label>Size Type:</label>
				<select
					value={sizeType}
					onChange={handleSizeTypeChange}
				>
					<option value=''>Select Size Type</option>
					<option value='single'>Single</option>
					<option value='double'>Double</option>
				</select>
			</div>
			{sizeRange.length > 0 && (
				<div>
					<label>From Size:</label>
					<select
						value={fromSize}
						onChange={(e) => setFromSize(e.target.value)}
					>
						<option value=''>Select From Size</option>
						{sizeRange.map((size) => (
							<option
								key={size}
								value={size}
							>
								{size}
							</option>
						))}
					</select>

					<label>To Size:</label>
					<select
						value={toSize}
						onChange={(e) => setToSize(e.target.value)}
					>
						<option value=''>Select To Size</option>
						{sizeRange
							.slice(sizeRange.indexOf(fromSize))
							.map((size) => (
								<option
									key={size}
									value={size}
								>
									{size}
								</option>
							))}
					</select>
				</div>
			)}
			{fromSize && toSize && (
				<div>
					<label>Print Size:</label>
					<select
						value={printSize}
						onChange={(e) => setPrintSize(e.target.value)}
					>
						<option value=''>Select Print Size</option>
						{sizeRange
							.slice(
								sizeRange.indexOf(fromSize),
								sizeRange.indexOf(toSize) + 1
							)
							.map((size) => (
								<option
									key={size}
									value={size}
								>
									{size}
								</option>
							))}
					</select>
				</div>
			)}
			<div>
				<label>Barcode:</label>
				<input
					type='text'
					value={barcode}
					onChange={(e) => setBarcode(e.target.value)}
					maxLength={12}
					placeholder='Enter 12-digit barcode'
				/>
			</div>
			<div>
				<label>Quantity:</label>
				<input
					type='number'
					value={quantity}
					onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
					min={1}
				/>
			</div>
			<button onClick={handleAddLabel}>
				{editIndex !== null
					? 'Update Label'
					: 'Add More Product Labels'}
			</button>
			{/* Restored Generate Button */}
			{labelData.length > 0 && (
				<div>
					<h3>Products Added:</h3>
					<ul>
						{labelData.map((label, index) => (
							<li key={index}>
								{label.productCode} - {label.fromSize} to{' '}
								{label.toSize} - {label.printSize} -{' '}
								{label.barcode} - Qty: {label.quantity}
								<button onClick={() => handleEditLabel(index)}>
									Edit
								</button>
								<button
									onClick={() => handleDeleteLabel(index)}
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default LabelForm;
