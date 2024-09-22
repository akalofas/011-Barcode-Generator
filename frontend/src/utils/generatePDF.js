import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

const generatePDF = (labels) => {
	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	});

	const labelsPerPage = 65;

	labels
		.flatMap((label) =>
			Array.from({ length: label.quantity }).map((_, i) => {
				return { ...label, key: `${label.productCode}-${i}` };
			})
		)
		.forEach((label, index) => {
			if (index > 0 && index % labelsPerPage === 0) {
				pdf.addPage();
			}

			// Calculate position for each label
			const col = index % 5;
			const row = Math.floor((index % labelsPerPage) / 5);
			const xPos = 4.75 + col * 38.1;
			const yPos = 10 + row * 21.2;

			// Draw the label background and borders
			// pdf.rect(xPos, yPos, 38.16653323, 20.85390713);

			// Add product code
			pdf.setFont('Arial', 'bold');
			pdf.setFontSize(13);
			pdf.text(label.productCode, xPos + 4.5, yPos + 5.5);

			// Determine size range alignment
			pdf.setFont('Arial', 'normal');
			pdf.setFontSize(9);
			const sizeRangeArray = label.sizeRange.slice(
				label.sizeRange.indexOf(label.fromSize),
				label.sizeRange.indexOf(label.toSize) + 1
			);

			let sizeRangeText = '';
			let circleXPos = xPos + 4.5; // Default circle position if there's only one item
			let circleWidth = 2; // Default circle radius

			if (sizeRangeArray.length === 1) {
				// If there's only one item, keep it left-aligned
				sizeRangeText = sizeRangeArray[0];
				pdf.text(sizeRangeText, xPos + 4.5, yPos + 10);
				circleWidth = pdf.getTextWidth(sizeRangeText) / 2 + 1; // Adjust circle width
				circleXPos += pdf.getTextWidth(sizeRangeText) / 2;
			} else {
				// Calculate the positions for each size
				const startPosition = xPos + 4.5;
				const endPosition = xPos + 38.1 - 2;
				const totalWidth = endPosition - startPosition;

				// Calculate total text width for all sizes
				const totalTextWidth = sizeRangeArray.reduce(
					(acc, size) => acc + pdf.getTextWidth(size),
					0
				);

				// Calculate space between sizes
				const spaceBetween =
					(totalWidth - totalTextWidth) / (sizeRangeArray.length - 1);

				// Position each size
				let currentPosition = startPosition;

				sizeRangeArray.forEach((size, index) => {
					pdf.text(size, currentPosition, yPos + 10);

					if (size === label.printSize) {
						// Set the circle position and width based on the current size position
						circleXPos =
							currentPosition + pdf.getTextWidth(size) / 2;
						circleWidth = pdf.getTextWidth(size) / 2 + 1; // Adjust circle width
					}

					if (index < sizeRangeArray.length - 1) {
						// Move to the next position
						currentPosition +=
							pdf.getTextWidth(size) + spaceBetween;
					}

					// Concatenate sizes for later use
					sizeRangeText += size + ' ';
				});

				// Handle text overflow
				if (pdf.getTextWidth(sizeRangeText) > 38.1 - 10) {
					pdf.setFontSize(8); // Reduce font size to fit
				}
			}

			// Set the line bolder
			pdf.setLineWidth(0.55);

			// Draw the circle around the selected size, adjusting its width dynamically
			pdf.ellipse(circleXPos, yPos + 9, circleWidth, 2, 'S');

			// Generate barcode
			const barcodeCanvas = document.createElement('canvas');
			JsBarcode(barcodeCanvas, label.barcode, { format: 'EAN13' });

			// Crop the top 50% of the barcode image
			const croppedCanvas = document.createElement('canvas');
			const ctx = croppedCanvas.getContext('2d');
			const barcodeHeight = barcodeCanvas.height;
			const barcodeWidth = barcodeCanvas.width;

			// Set canvas size to the cropped area
			croppedCanvas.width = barcodeWidth;
			croppedCanvas.height = barcodeHeight / 2;

			// Draw the cropped image on the new canvas
			ctx.drawImage(
				barcodeCanvas,
				0,
				barcodeHeight / 2, // Start cropping at halfway down the height
				barcodeWidth,
				barcodeHeight / 2, // Crop the bottom 50% of the image
				0,
				0, // Position at top-left corner of the new canvas
				barcodeWidth,
				barcodeHeight / 2 // Draw in full width and cropped height
			);

			const croppedBarcodeDataURL = croppedCanvas.toDataURL('image/png');

			// Add cropped barcode to PDF
			pdf.addImage(croppedBarcodeDataURL, 'PNG', xPos, yPos + 11, 37, 10);
		});

	pdf.save('labels.pdf');
};

export default generatePDF