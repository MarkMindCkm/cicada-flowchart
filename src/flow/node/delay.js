import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var delay = zrender.Path.extend({
    type: 'delay',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
        var x=shape.x;
        var y=shape.y;
        var width = shape.width;
        var height = shape.height;
        var r=height/2;
        ctx.moveTo(x,y);
        ctx.lineTo(x+width-r,y);
        //ctx.arc(x+width-r,y+r,r,Math.PI);
        ctx.arc(x+width-r, y+r, r, -Math.PI/2, Math.PI/2 , false);
        ctx.lineTo(x,y+height);
        ctx.closePath();
        return ;
    }
});

class Delay extends delay {
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
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    }
}

mixin(common,Delay.prototype);

export default Delay;