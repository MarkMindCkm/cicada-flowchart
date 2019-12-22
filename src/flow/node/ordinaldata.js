import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var ordinaldata = zrender.Path.extend({
    type: 'ordinaldata',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
       let {x,y,width,height}=shape;
       var k = 0.5522848;
       var cx = x+width/2;
       var cy = y+height/2;
       var a = width/2;
       var b = height/2;
       var ox = a * k; // 水平控制点偏移量
       var oy = b * k; // 垂直控制点偏移量
       // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
       ctx.moveTo(cx-a, cy);
       ctx.bezierCurveTo(cx - a, cy - oy, cx - ox, cy - b, cx, cy - b);
       ctx.bezierCurveTo(cx + ox, cy - b, cx + a, cy - oy, cx + a, cy);
       ctx.bezierCurveTo(cx + a, cy + oy, cx + ox, cy + b, cx, cy + b);
       ctx.bezierCurveTo(cx - ox, cy + b, cx - a, cy + oy, cx - a, cy);
       ctx.closePath();
       ctx.moveTo(cx,y+height);
       ctx.lineTo(x+width,y+height);
       
       return ;
    }
});

class Ordinaldata extends ordinaldata {
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

mixin(common,Ordinaldata.prototype);

export default Ordinaldata;