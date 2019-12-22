import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var document = zrender.Path.extend({
    type: 'document',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
        var width = shape.width;
        var height = shape.height;
        var x=shape.x;
        var y=shape.y;
        ctx.moveTo(x,y);
        ctx.lineTo(x+width,y);
        ctx.lineTo(x+width,y+height-14);
        ctx.quadraticCurveTo(x+width/4*3,parseInt(y+height-20),x+width/2,parseInt(y+height-14));
        ctx.quadraticCurveTo(x+width/4,y+height,x,parseInt(y+height-7));
        ctx.lineTo(x,y);
        ctx.closePath();

        return ;
    }
});

class Document extends document {
    constructor(data) {
        super(data);
        this.data = data;
        this.oldfill = this.data.style.fill;
        this.anchors = [];
        this.nodeType = "node";
        this.createAnchors();
    }
    createAnchors() {
        this.anchors = [];
        var g = new zrender.Group();
        var box = g.getBoundingRect([this]);
        var t = { x: box.x + box.width / 2, y: box.y, index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height - 10, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    }
  
}

mixin(common,Document.prototype);

export default Document;