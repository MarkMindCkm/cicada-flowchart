import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var processBar = zrender.Path.extend({
    type: 'processBar',
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
        ctx.moveTo(x,y);
        ctx.lineTo(x+width-20,y);
        ctx.lineTo(x+width,y+height/2);
        ctx.lineTo(x+width-20,y+height);
        ctx.lineTo(x,y+height);
        ctx.lineTo(x+20,y+height/2);
        ctx.closePath();
    }
});

class ProcessBar extends processBar {
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
        var t = { x: box.x + box.width / 2, y: box.y , index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };

        this.anchors.push(t, r, b, l);
    }
}

mixin(common,ProcessBar.prototype);

export default ProcessBar;