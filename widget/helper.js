export const getFullPath = (targetElement, exact = true) => {
	const stack = [];
	let nextElement = targetElement;

	while (nextElement.nodeName !== 'HTML') {
		const nodeName = nextElement.nodeName.toLowerCase();

		if (nextElement.getAttribute('id')) {
			stack.unshift(`#${nextElement.id}`);
		} else if (nextElement.getAttribute('class')) {
			const index = exact ? getPosAsChildOfParent(nextElement) : null;

			stack.unshift(
				`${nodeName}.${Array.from(nextElement.classList).join('.')}${exact ? `:nth-child(${index})` : ''}`,
			);
		} else {
			const index = exact ? getPosAsChildOfParent(nextElement) : null;

			stack.unshift(`${nodeName}${exact ? `:nth-child(${index})` : ''}`);
		}

		nextElement = nextElement.parentNode;
	}

	return `html > ${stack.join(' > ')}`;
};

export const getPosAsChildOfParent = (sib) => {
	const parentChildCount = sib.parentNode.childElementCount;

	if (!sib.nextElementSibling) {
		if (parentChildCount > 0) {
			return parentChildCount;
		} else {
			return 0;
		}
	}

	let count = 0;
	let currentSib = sib;

	while (currentSib) {
		const nextSib = currentSib.nextElementSibling;
		if (nextSib) {
			count += 1;
			currentSib = nextSib;
		} else {
			currentSib = null;
		}
	}

	return parentChildCount - count;
};

export const truncateFullPath = (fullPath) => {
	const paths = fullPath.split('>');

	if (paths.length > 1) {
		return `... > ${paths[paths.length - 1]}`;
	}

	return fullPath;
};

export const dragElement = (elmnt) => {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

	document.getElementById('widget-top').onmousedown = dragMouseDown;

	// if (document.getElementById(elmnt.id + 'header')) {
	// 	/* if present, the header is where you move the DIV from:*/

	// } else {
	// 	/* otherwise, move the DIV from anywhere inside the DIV:*/
	// 	elmnt.onmousedown = dragMouseDown;
	// }

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		// set the element's new position:
		elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
		elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
};

// module.exports = {
// 	getFullPath,
// 	getPosAsChildOfParent,
// 	truncateFullPath,
// 	dragElement
// };