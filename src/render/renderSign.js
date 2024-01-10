import setAttributes from '../utils/setAttributes';

/**
 * Create SVGElement from an annotation definition.
 * This is used for anntations of type `sign`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGElement} A svg to be rendered
 */
export default function renderSign(a) {
    var outerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    setAttributes(outerSVG, {
        width: a.width,
        height: a.height,
        x: a.x,
        y: a.y
    });
    
    setAttributes(rect, {
        width: a.width,
        height: a.height,
        x: 0,
        y: 0,
        stroke: '#f00',
        fill: 'none'
    });

    setAttributes(text, {
        x: a.width/2-40,
        y: a.height/2+5,
        //width: a.width,
        //height: a.height,
        fill: '#f00',
        fontSize: 10
    });
    text.innerHTML = "ここに署名を追加";

    outerSVG.appendChild(rect);
    outerSVG.appendChild(text);
    //return rect;
    return outerSVG;
}
