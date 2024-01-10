import objectAssign from 'object-assign';
import renderLine from './renderLine';
import renderPath from './renderPath';
import renderPoint from './renderPoint';
import renderRect from './renderRect';
import renderText from './renderText';
import renderSign from './renderSign';
import renderSignImg from './renderSignImg';

const isFirefox = /firefox/i.test(navigator.userAgent);

/**
 * Get the x/y translation to be used for transforming the annotations
 * based on the rotation of the viewport.
 *
 * @param {Object} viewport The viewport data from the page
 * @return {Object}
 */
function getTranslation(viewport) {
  let x;
  let y;

  // Modulus 360 on the rotation so that we only
  // have to worry about four possible values.
  switch(viewport.rotation % 360) {
    case 0:
      x = y = 0;
      break;
    case 90:
      x = 0;
      y = (viewport.width / viewport.scale) * -1;
      break;
    case 180:
      x = (viewport.width / viewport.scale) * -1;
      y = (viewport.height / viewport.scale) * -1;
      break;
    case 270:
      x = (viewport.height / viewport.scale) * -1;
      y = 0;
      break;
  }

  return { x, y };
}

/**
 * Transform the rotation and scale of a node using SVG's native transform attribute.
 *
 * @param {Node} node The node to be transformed
 * @param {Object} viewport The page's viewport data
 * @return {Node}
 */
function transform(node, viewport) {
  let trans = getTranslation(viewport);
  let flg = viewport.rotation > 0 ? -1 : 1;

  // Let SVG natively transform the element
  node.setAttribute('transform', `scale(${viewport.scale}) rotate(${viewport.rotation}) translate(${trans.x}, ${trans.y})`);
  
  // Manually adjust x/y for nested SVG nodes
  if (!isFirefox && node.nodeName.toLowerCase() === 'svg') {
    if (node.querySelector('path')) {
      node.setAttribute('x', parseInt(node.getAttribute('x'), 10) * viewport.scale);
      node.setAttribute('y', parseInt(node.getAttribute('y'), 10) * viewport.scale);

      let x = parseInt(node.getAttribute('x', 10));
      let y = parseInt(node.getAttribute('y', 10));
      let width = parseInt(node.getAttribute('width'), 10);
      let height = parseInt(node.getAttribute('height'), 10);
      let path = node.querySelector('path');
      let svg = path.parentNode;
    
      // Scale width/height
      [node, svg, path, node.querySelector('rect')].forEach((n) => {
        //alert(n.toString());
        n.setAttribute('width', parseInt(n.getAttribute('width'), 10) * viewport.scale);
        n.setAttribute('height', parseInt(n.getAttribute('height'), 10) * viewport.scale);
      });

      // Transform path but keep scale at 100% since it will be handled natively
      transform(path, objectAssign({}, viewport, { scale: 1 }));
      
      switch(viewport.rotation % 360) {
        case 90:
          node.setAttribute('x', viewport.width - y - width);
          node.setAttribute('y', x);
          svg.setAttribute('x', 1);
          svg.setAttribute('y', 0);
          break;
        case 180:
          node.setAttribute('x', viewport.width - x - width);
          node.setAttribute('y', viewport.height - y - height);
          svg.setAttribute('y', 2);
          break;
        case 270:
          node.setAttribute('x', y);
          node.setAttribute('y', viewport.height - x - height);
          svg.setAttribute('x', -1);
          svg.setAttribute('y', 0);
          break;
      }
    } else if (node.querySelector('image')) {
      node.setAttribute('x', parseInt(node.getAttribute('x'), 10) * viewport.scale);
      node.setAttribute('y', parseInt(node.getAttribute('y'), 10) * viewport.scale);

      var xsi = parseInt(node.getAttribute('x', 10));
      var ysi = parseInt(node.getAttribute('y', 10));
      var widthsi = parseInt(node.getAttribute('width'), 10);
      var heightsi = parseInt(node.getAttribute('height'), 10);
      var image = node.querySelector('image');
      var xi = parseInt(image.getAttribute('x', 10));
      var yi = parseInt(image.getAttribute('y', 10));
      var widthi = parseInt(image.getAttribute('width'), 10);
      var heighti = parseInt(image.getAttribute('height'), 10);
      //var svgimage = image.parentNode;
      // Scale width/height
      [node, image].forEach(function (n) {
          n.setAttribute('width', parseInt(n.getAttribute('width'), 10) * viewport.scale);
          n.setAttribute('height', parseInt(n.getAttribute('height'), 10) * viewport.scale);
      });

      // Transform image but keep scale at 100% since it will be handled natively
      transform(image, objectAssign({}, viewport, { scale: 1 }));
      
      switch (viewport.rotation % 360) {
          case 90:
              node.setAttribute('x', viewport.width - ysi - heightsi);
              node.setAttribute('y', xsi);
              node.setAttribute('width', heightsi);
              node.setAttribute('height', widthsi);
              image.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + 0 + ', ' + heighti * flg + ')');
              break;
          case 180:
              node.setAttribute('x', viewport.width - xsi - widthsi);
              node.setAttribute('y', viewport.height - ysi - heightsi);
              image.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthi * flg + ', ' + heighti * flg + ')');
              break;
          case 270:
              node.setAttribute('x', ysi);
              node.setAttribute('y', viewport.height - xsi - heightsi);
              node.setAttribute('width', heightsi);
              node.setAttribute('height', widthsi);
              image.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthi * flg + ', ' + 0 + ')');
              break;
      }
    } else if (node.querySelector('text')) {
      node.setAttribute('x', parseInt(node.getAttribute('x'), 10) * viewport.scale);
      node.setAttribute('y', parseInt(node.getAttribute('y'), 10) * viewport.scale);

      var text = node.querySelector('text');
      var svgrect = node.querySelector('rect');
      text.setAttribute('x', (parseInt(text.getAttribute('x'), 10) + 40) * viewport.scale - 40);
      text.setAttribute('y', (parseInt(text.getAttribute('y'), 10) - 5) * viewport.scale + 5);
      // Scale width/height
      [node, node.querySelector('rect')].forEach(function (n) {
          n.setAttribute('width', parseInt(n.getAttribute('width'), 10) * viewport.scale);
          n.setAttribute('height', parseInt(n.getAttribute('height'), 10) * viewport.scale);
      });
      var xst = parseInt(node.getAttribute('x', 10));
      var yst = parseInt(node.getAttribute('y', 10));
      var widthst = parseInt(node.getAttribute('width'), 10);
      var heightst = parseInt(node.getAttribute('height'), 10);
      //var widtht = parseInt(text.getAttribute('width'), 10);
      //var heightt = parseInt(text.getAttribute('height'), 10);
      var widthr = parseInt(svgrect.getAttribute('width'), 10);
      var heightr = parseInt(svgrect.getAttribute('height'), 10);

      // Transform text but keep scale at 100% since it will be handled natively      
      transform(text, objectAssign({}, viewport, { scale: 1 }));

      switch (viewport.rotation % 360) {
          case 90:
              node.setAttribute('x', viewport.width - yst - heightst);
              node.setAttribute('y', xst);
              node.setAttribute('width', heightst);
              node.setAttribute('height', widthst);
              text.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + 0 + ', ' + heightr * flg + ')');
              svgrect.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + 0 + ', ' + heightr * flg + ')');
              //svgrect.setAttribute('y', 0);
              break;
          case 180:

              node.setAttribute('x', viewport.width - xst - widthst);
              node.setAttribute('y', viewport.height - yst - heightst);
              text.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthr * flg + ', ' + heightr * flg + ')');
              svgrect.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthr * flg + ', ' + heightr * flg + ')');
              break;
          case 270:
              node.setAttribute('x', yst);
              node.setAttribute('y', viewport.height - xst - heightst);
              node.setAttribute('width', heightst);
              node.setAttribute('height', widthst);
              text.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthr * flg + ', ' + 0 + ')');
              svgrect.setAttribute('transform', 'scale(' + viewport.scale + ') rotate(' + viewport.rotation + ') translate(' + widthr * flg + ', ' + 0 + ')');
              break;
      }
    } 
  }

  return node;
}

/**
 * Append an annotation as a child of an SVG.
 *
 * @param {SVGElement} svg The SVG element to append the annotation to
 * @param {Object} annotation The annotation definition to render and append
 * @param {Object} viewport The page's viewport data
 * @return {SVGElement} A node that was created and appended by this function
 */
export default function appendChild(svg, annotation, viewport) {
  if (!viewport) {
    viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
  }
  //alert(annotation.type);
  let child;
  switch (annotation.type) {
    case 'area':
    case 'highlight':
      child = renderRect(annotation);
      break;
    case 'strikeout':
      child = renderLine(annotation);
      break;
    case 'point':
      child = renderPoint(annotation);
      break;
    case 'textbox':
      child = renderText(annotation);
      break;
    case 'drawing':
      child = renderPath(annotation);
      break;
    case 'sign':
      child = renderSign(annotation);
      break;
    case 'signimg':
      child = renderSignImg(annotation);
      break;
  }

  // If no type was provided for an annotation it will result in node being null.
  // Skip appending/transforming if node doesn't exist.
  if (child) {
    // Set attributes
    child.setAttribute('data-pdf-annotate-id', annotation.uuid);
    child.setAttribute('data-pdf-annotate-type', annotation.type);

    switch (annotation.type) {
      case 'point':
        child.setAttribute('data-pdf-annotate-content', annotation.content);
        child.setAttribute('data-pdf-annotate-color', annotation.color);
        //child.setAttribute('data-pdf-annotate-content', annotation.content.replace(/\\n/g, '\r\n'));
          
        break;
      case 'textbox':
        child.setAttribute('data-pdf-annotate-content', annotation.content);
        break;
      case 'signimg':
        child.setAttribute('data-pdf-annotate-content', annotation.content);
        break;
    }
    
    child.setAttribute('aria-hidden', true);

    svg.appendChild(transform(child, viewport));
  }

  return child;
}
