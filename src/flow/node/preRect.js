import zrender from 'zrender'
import * as roundRectHelper  from '../help/roundRect'
import mixin from '../help/mixin'
import common from './common'
var preRect = zrender.Path.extend({
    type: 'preRect',
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
        var r = 2;
        shape.r=r;
        roundRectHelper.buildPath(ctx,shape);
        var x1=parseInt(x+width/10);
        var x2=parseInt(x+width/10*9);
        ctx.moveTo(x1,y);
        ctx.lineTo(x1,y+height);
        ctx.moveTo(x2,y);
        ctx.lineTo(x2,y+height);
        ctx.closePath();
        return ;
    }
});

class PreRect extends preRect {
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

mixin(common,PreRect.prototype);

export default PreRect;