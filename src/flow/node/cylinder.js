import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'

var cylinder = zrender.Path.extend({
    type: 'cylinder',
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
        ctx.moveTo(x,y+5);
        ctx.quadraticCurveTo(x+width/6,y,x+width/2,y);
        ctx.quadraticCurveTo(x+width*5/6,y,x+width,y+5);

        ctx.lineTo(x+width,y+height-5);
        ctx.quadraticCurveTo(x+width*5/6,y+height,x+width/2,y+height);
        ctx.quadraticCurveTo(x+width/6,y+height,x,y+height-5);
        ctx.closePath();

        ctx.moveTo(x+width,y+5);
        ctx.quadraticCurveTo(x+width*5/6,y+10,x+width/2,y+10);
        ctx.quadraticCurveTo(x+width/6,y+10,x,y+5);
       
    }
});

class Cylinder extends cylinder {
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
        var t = { x: box.x + box.width / 2, y: box.y, index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };

        this.anchors.push(t, r, b, l);
    }
}

mixin(common,Cylinder.prototype);

export default Cylinder;