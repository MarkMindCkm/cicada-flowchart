import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'

var arrowRight = zrender.Path.extend({
    type: 'arrowRight',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
        var x = shape.x;
        var y = shape.y;
        var height = shape.height;
        var width = shape.width;

        var x1=parseInt(x + width - 36);
        var y1=parseInt(y + height / 5);
        var y2=parseInt(y + height / 5 * 4);

        ctx.moveTo(x,y1);
        ctx.lineTo(x1,y1);
        ctx.lineTo(x1,y);
        ctx.lineTo(x + width, y + height / 2);
        ctx.lineTo(x1,y + height);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x, y2);
        ctx.closePath();

    }
});

class ArrowRight extends arrowRight {
    constructor(data) {
        super(data);
        this.data = data;
        this.oldfill = this.data.style.fill;
        this.anchors = [];
        this.nodeType = "node";
        this.createAnchors();
    }
    createAnchors() {
        var g = new zrender.Group();
        this.anchors = [];
        var box = g.getBoundingRect([this]);
        var t = { x: box.x + box.width / 2, y: box.y + box.height / 5, index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height / 5 * 4, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    }
}

mixin(common,ArrowRight.prototype);

export default ArrowRight;