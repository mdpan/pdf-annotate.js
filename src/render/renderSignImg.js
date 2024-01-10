import setAttributes from '../utils/setAttributes';

/**
 * Create SVGElement from an annotation definition.
 * This is used for anntations of type `signimg`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGElement} A svg to be rendered
 */
export default function renderSignImg(a) {
    var outerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    
    setAttributes(outerSVG, {
        width: a.width,
        height: a.height,
        x: a.x,
        y: a.y
    });
    setAttributes(img, {
        width: a.width,
        height: a.height,
        x: 0,
        y: 0,
        href: a.content
        });

    outerSVG.appendChild(img);
    return outerSVG;
}
