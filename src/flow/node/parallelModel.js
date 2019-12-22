import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var parallelModel = zrender.Path.extend({
    type: 'parallelModel',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
       let {x,y,width,height}=shape;
       ctx.moveTo(x,y);
       ctx.lineTo(x+width,y);
       ctx.moveTo(x,y+height);
       ctx.lineTo(x+width,y+height);
       return ;
    }
});

class ParallelModel extends parallelModel {
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
        var t1 = { x: box.x + box.width / 4, y: box.y, index: 1, node: this, direct: 'top' };
        var t2 = { x: box.x + box.width / 2, y: box.y, index: 2, node: this, direct: 'top' };
        var t3 = { x: box.x + box.width*3 / 4, y: box.y, index: 3, node: this, direct: 'top' };
        var t5 = { x: box.x , y: box.y, index: 4, node: this, direct: 'top' };
        var t4 = { x: box.x + box.width, y: box.y, index: 5, node: this, direct: 'top' };
        
        var b1 = { x: box.x + box.width / 4, y: box.y + box.height, index: 6, node: this, direct: 'bottom' };
        var b2 = { x: box.x + box.width / 2, y: box.y + box.height, index: 7, node: this, direct: 'bottom' };
        var b3 = { x: box.x + box.width *3/ 4, y: box.y + box.height, index: 8, node: this, direct: 'bottom' };
        var b4 = { x: box.x  , y: box.y + box.height, index: 9, node: this, direct: 'bottom' };
        var b5 = { x: box.x + box.width , y: box.y + box.height, index: 10, node: this, direct: 'bottom' };
     
        this.anchors.push(t1,t2,t3,t4,t5,b1,b2,b3,b4,b5);
    }
  

}

mixin(common,ParallelModel.prototype);

export default ParallelModel;