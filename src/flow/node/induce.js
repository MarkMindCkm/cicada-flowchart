import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var induce = zrender.Path.extend({
    type: 'induce',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direct:'right'
    },
    buildPath: function (ctx, shape) {
       let {x,y,width,height,direct}=shape;
       if(direct=='right'){
            ctx.moveTo(x,y+height/2);
            ctx.lineTo(x+width/2,y+height/2);
            ctx.moveTo(x+width,y);
            ctx.lineTo(x+width/2,y);
            ctx.lineTo(x+width/2,y+height);
            ctx.lineTo(x+width,y+height);
       }
       else if(direct=='left'){
            ctx.moveTo(x,y);
            ctx.lineTo(x+width/2,y);
            ctx.lineTo(x+width/2,y+height);
            ctx.lineTo(x,y+height);
            ctx.moveTo(x+width/2,y+height/2)
            ctx.lineTo(x+width,y+height/2);
       }
       else if(direct=='top'){
            ctx.moveTo(x,y);
            ctx.lineTo(x,y+height/2);
            ctx.lineTo(x+width,y+height/2);
            ctx.lineTo(x+width,y);
            ctx.moveTo(x+width/2,y+height/2)
            ctx.lineTo(x+width/2,y+height);
       }
       else if(direct=='bottom'){
            ctx.moveTo(x+width/2,y);
            ctx.lineTo(x+width/2,y+height/2);
            ctx.moveTo(x,y+height)
            ctx.lineTo(x,y+height/2);
            ctx.lineTo(x+width,y+height/2);
            ctx.lineTo(x+width,y+height);
       }
      
       return ;
    }
});

class Induce extends induce {
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
        var b1 = { x: box.x + box.width / 4, y: box.y + box.height, index: 4, node: this, direct: 'bottom' };
        var b2 = { x: box.x + box.width / 2, y: box.y + box.height, index: 5, node: this, direct: 'bottom' };
        var b3 = { x: box.x + box.width *3/ 4, y: box.y + box.height, index: 6, node: this, direct: 'bottom' };
        var l1 = { x: box.x, y: box.y + box.height / 4, index: 7, node: this, direct: 'left' };
        var l2 = { x: box.x, y: box.y + box.height / 2, index: 8, node: this, direct: 'left' };
        var l3 = { x: box.x, y: box.y + box.height*3 / 4, index:9, node: this, direct: 'left'};
        this.anchors.push(t1,t2,t3,b1,b2,b3,l1,l2,l3);
    }
}

mixin(common,Induce.prototype);

export default Induce;