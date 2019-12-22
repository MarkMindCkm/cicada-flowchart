import zrender from 'zrender';
import mixin from '../help/mixin'
import common from './common'

class Circle extends zrender.Ellipse {
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
        var cy=box.y+box.height/2;
  
        var t = { x: box.x + box.width / 2, y: box.y, index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    
        let point=this.getPoint(box.width / 4,box);
        
        let p1 = { x: box.x + box.width*3/4, y: cy+point-2, index: 5, node: this, direct: 'right' };
        let p2 = { x: box.x + box.width*3/4, y: cy-point+2, index: 6, node: this, direct: 'right' };
        let p3 = { x: box.x + box.width/4, y: cy+point-2, index: 7, node: this, direct: 'left' };
        let p4 = { x: box.x + box.width/4, y: cy-point+2, index: 8, node: this, direct: 'left' };
        this.anchors.push(p1, p2, p3, p4);
    }

    getPoint(x,box){
            let a=box.width/2;
            let b=box.height/2;
            //椭圆公式 计算y值
            let y=Math.sqrt(b*b*Math.sqrt(1-(x*x)/(a*a)));
            return y;
    }
}


mixin(common,Circle.prototype);

export default Circle;