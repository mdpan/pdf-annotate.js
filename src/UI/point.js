import PDFJSAnnotate from '../PDFJSAnnotate';
import appendChild from '../render/appendChild';
import {
  BORDER_COLOR,
  findSVGAtPoint,
  getMetadata,
  scaleDown
} from './utils';

let _enabled = false;
let _pointColor = '#fff9c7';
let input;

/**
 * Handle document.mouseup event
 *
 * @param {Event} The DOM event to be handled
 */
function handleDocumentMouseup(e) {
  if (input || !findSVGAtPoint(e.clientX, e.clientY)) {
    return
  }
  
  /*
  input = document.createElement('input');
  input.setAttribute('id', 'pdf-annotate-point-input');
  input.setAttribute('placeholder', 'Enter comment');
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = `${e.clientY}px`;
  input.style.left = `${e.clientX}px`;
  */

  //20210209
  input = document.createElement('textarea');
  input.setAttribute('id', 'pdf-annotate-point-input');
  input.setAttribute('placeholder', '付箋を入力してください');  
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = e.clientY + 'px';
  input.style.left = e.clientX + 'px';
  input.style.zIndex = '9999';
  input.style.background = _pointColor;
  input.style.width = '275px';
  input.rows = 5;

  if ($("#ShowUserNameInComment").val() === "1") {
    input.value = $("#UserName").val() + ": \r\n";
  }

  input.addEventListener('blur', handleInputBlur);
  //20210209
  //input.addEventListener('keyup', handleInputKeyup);


  document.body.appendChild(input);
  input.focus();
}

/**
 * Handle input.blur event
 */
function handleInputBlur() {
  savePoint();
}

/**
 * Handle input.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleInputKeyup(e) {
  if (e.keyCode === 27) {
    closeInput();
  } else if (e.keyCode === 13) {
    savePoint();
  }
}

/**
 * Save a new point annotation from input
 */
function savePoint() {
  if (input.value.trim().length > 0) {
    let clientX = parseInt(input.style.left, 10);
    let clientY = parseInt(input.style.top, 10);
    let content = input.value.trim();
    let svg = findSVGAtPoint(clientX, clientY);
    if (!svg) {
      return;
    }

    let rect = svg.getBoundingClientRect();
    let { documentId, pageNumber } = getMetadata(svg);
    let annotation = Object.assign({
        type: 'point',
        content: content,
        color: _pointColor
      }, scaleDown(svg, {
        x: clientX - rect.left,
        y: clientY - rect.top
      })
    );

    PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        PDFJSAnnotate.getStoreAdapter().addComment(
          documentId,
          annotation.uuid,
          content
        );

        appendChild(svg, annotation);
      });
  }

  closeInput();
}

/**
 * Close the input element
 */
function closeInput() {
  input.removeEventListener('blur', handleInputBlur);
  input.removeEventListener('keyup', handleInputKeyup);
  document.body.removeChild(input);
  input = null;
}

	/**
	 * Set the attributes of the point.
	 *	 
	 * @param {String} pointColor the background color 
	 */
   export function setPoint() {
		_pointColor = arguments.length <= 0 || arguments[0] === undefined ? '#fff9c7' : arguments[0];
	}
	

/**
 * Enable point annotation behavior
 */
export function enablePoint() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener('mouseup', handleDocumentMouseup);
}

/**
 * Disable point annotation behavior
 */
export function disablePoint() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleDocumentMouseup);
}

