import zrender from 'zrender'
import connection from './path/connection'
export default class RelateLink extends zrender.Group {
    constructor(fromNode = null, toNode = null, text = "", stroke = '#666', textFill = '#666', textBackgroundColor = '#fff', type = "polyline", lineDashType = "solid") {
        super();
        this.fromNode = fromNode;
        this.toNode = toNode;

        this.direct = "";
        this.stroke = stroke;
        this.textFill = textFill || '#fff';
        this.lineDashType = lineDashType;
        this.textBackgroundColor = textBackgroundColor;
        this.fontStyle = 'normal';
        this.fontWeight = 'normal';
        this.lineCenter=[];

        //状态
        this.status = "create";   //create , add , over ,active
        this.cpx = { cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, fromcx: 0, fromcy: 0, tocx: 0, tocy: 0 };

        this.entryDirection = [1, 0], this.exitDirection = [-1, 0];
        this.entryExt = 20;
        this.exitExt = 20;
        this.text = text;
        this.lineWidth = 1;

        this.type = type;
        this.temx = 0;
        this.temy = 0;
        this.nodeType='edge';

        this.create();
        this.initEvent();
        this.relateText.hide();
    }

    setLineDashType(){
        if (this.lineDashType == 'solid') {
            this.lineDash = [0];
        } 
        else if(this.lineDashType=='dott') {
            this.lineDash = [2,2];
        }
        else if(this.lineDashType=='dash') {
            this.lineDash = [6,3];
        }
        else if(this.lineDashType=='dashed') {
            this.lineDash = [10,4,4,4];
        }
        // this.bs&&this.bs.attr({
        //     style:{
        //         lineDash:this.lineDash
        //     }
        // });
    }
    create() {
        this.setLineDashType();
        if (this.type == 'bs') {
            this.bs = new zrender.BezierCurve({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth,
                    lineDash: this.lineDash
                },
                z: 16
            });
        } else if (this.type == "polyline") {
            this.bs = new zrender.Polyline({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth,   
                    lineDash: this.lineDash
                },
                z: 16
            });
        } else {
            this.bs = new zrender.Line({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth,
                    lineDash: this.lineDash
                },
                z: 16
            });
        }

        this.cpx1 = new zrender.Circle({
            style: {
                stroke: '#666',
                fill: '#fff'
            },
            shape: {
                r: 4
            },
            draggable:true,
            z: 20000
        });
        this.cpx2 = new zrender.Circle({
            style: {
                stroke: '#666',
                fill: '#fff'
            },
            shape: {
                r: 4
            },
            draggable:true,
            z: 20000
        });
        // this.fromCircle = new zrender.Circle({
        //     style: {
        //         stroke: this.stroke,
        //         fill: '#fff'
        //     },
        //     shape: {
        //         r: 3
        //     },
        //     z: 17
        // });
        this.fromPointCircle=new zrender.Circle({
            style:{
                fill:'#fff',
                stroke:'red',
                shadowColor:'yellow',
                shadowBlur:3
            },
            shape:{
               r:4
            },
            z:10000
        });
        this.toPointCircle=new zrender.Circle({
            style:{
                fill:'#fff',
                stroke:'red',
                shadowColor:'yellow',
                shadowBlur:3
            },
            shape:{
               r:4
            },
            z:10000
        });

        this.fromPointCircle.edge=this;
        this.fromPointCircle.edgeType='from';
        this.toPointCircle.edge=this;
        this.toPointCircle.edgeType='to';

        this.line1 = new zrender.Line({
            style: {
                stroke: '#ccc'
            },
            z:10000
        });
        this.line2 = new zrender.Line({
            style: {
                stroke: '#ccc'
            },
            z:10000
        });

        this.pl = new zrender.Polygon({
            style: {
                stroke: this.stroke,
                fill: this.stroke
            },
            z: 17
        });



        this.relateText = new zrender.Text({
            style: {
                text: this.text,
                textFill: this.textFill,
                fontSize: 12,
                fontStyle: this.fontSize,
                fontWeight: this.fontWeight,
                textBackgroundColor: this.textBackgroundColor,
                textPadding: [2, 2],
                textBorderRadius: 2
            },
            z: 17
        }).on('dblclick', (e) => {
            e.relate = this;
            this.__zr.trigger('editRelate', e);
        });

        this.add(this.bs)
        this.add(this.line1)
        this.add(this.line2)
        //this.add(this.fromCircle)
        this.add(this.cpx1)
        this.add(this.cpx2)
        this.add(this.fromPointCircle)
        this.add(this.toPointCircle)
        this.add(this.pl)
        this.add(this.relateText);

        this.cpx1.relate = this;
        this.cpx1.mark = 'from';
        this.cpx2.relate = this;
        this.cpx2.mark = 'to';

        this.cpx1.hide();
        this.cpx2.hide();
        this.line1.hide();
        this.line2.hide();
        this.fromPointCircle.hide();
        this.toPointCircle.hide();
        this.pl.hide();
        //this.relateText.hide();
    }

    setFromNode(node){
        this.fromNode=node;
    }

    setFromAnch(anch){
        this.fromAnch=anch;
        if(anch){
            this.setFromPoint(this.fromNode.getAnchorByIndex(anch.point.index));
            this._refresh();
        }
    }

    removeFromNode(){
        this.fromNode=null;
        this.fromAnch=null;
    }

    setFromPoint(point,flag) {
            this.fromPoint = {...this.fromPoint,...point};
            this.cpx.x1 = point.x;
            this.cpx.y1 = point.y;
            this.calcDirection();
            if(flag){
                this._refresh();
                this.renderText();
            }
    }
    calc(x, y) {
        var fromPoint = this.fromPoint;
        var toPoint;
        if (x && y) {
            this.toPoint = { x, y };
            toPoint = this.toPoint;
        } else {
            toPoint = this.toPoint;
        }
        // var direct=this.judgeDirect(fromPoint,toPoint);
        // this.direct=direct;

        // if(direct=='righttop'||direct=="lefttop"){
        //      var x1=fromPoint.x+fromBox.width/2;
        //      var y1=fromPoint.y;
        //      var fromcx=fromBox.width/2;
        //      var fromcy=0;

        //      if(direct=='righttop'){      
        //         var r=0.5;
        //         var x2=toPoint.x+toBox.width*r-2;
        //         var y2=toPoint.y+toBox.height-2;
        //         var tocx=toBox.width*r;
        //         var tocy=toBox.height;
        //      }else{
        //         var r=0.5;
        //         var x2=toPoint.x+toBox.width*r+2;
        //         var y2=toPoint.y+toBox.height+2;
        //         var tocx=toBox.width*r;
        //         var tocy=toBox.height;
        //      }
        // }else if(direct=='rightbottom'||direct=="leftbottom"){
        //      var x1=fromPoint.x+fromBox.width/2;
        //      var y1=fromPoint.y+fromBox.height;
        //      var fromcx=fromBox.width/2;
        //      var fromcy=fromBox.height;
        //      if(direct=='rightbottom'){
        //         var r=0.5;
        //         var x2=toPoint.x+toBox.width*r-2;
        //         var y2=toPoint.y-2;
        //         var tocx=toBox.width*r;
        //         var tocy=0;
        //      }else{
        //         var r=0.5;
        //         var x2=toPoint.x+toBox.width*r+2;
        //         var y2=toPoint.y+2;
        //         var tocx=toBox.width*r;
        //         var tocy=0;
        //      }
        // }

        var cpx1 = fromPoint.x + (toPoint.x - fromPoint.x) / 4;
        var cpy1 = fromPoint.y + (toPoint.y - fromPoint.y) / 4;
        var cpx2 = fromPoint.x + (toPoint.x - fromPoint.x) / 4 * 3;
        var cpy2 = fromPoint.y + (toPoint.y - fromPoint.y) / 4 * 3;

        return {
            x1: fromPoint.x,
            y1: fromPoint.y,
            x2: toPoint.x,
            y2: toPoint.y,
            cpx1,
            cpx2,
            cpy1,
            cpy2
        }
    }

    judgeDirect(fromPoint, toPoint) {
        var d = '';
        if (fromPoint.x >= toPoint.x) {
            d = "left"
        } else {
            d = "right"
        }

        if (fromPoint.y >= toPoint.y) {
            d += "top"
        } else {
            d += "bottom"
        }
        return d;
    }

    calcDirection() {

        if (this.fromPoint && this.fromPoint.direct) {
            if (this.fromPoint.direct == 'top') {
                this.entryDirection = [0, -1];
            } else if (this.fromPoint.direct == 'right') {
                this.entryDirection = [1, 0];
            } else if (this.fromPoint.direct == 'bottom') {
                this.entryDirection = [0, 1];
            } else {
                this.entryDirection = [-1, 0];
            }
        }

        if (this.toPoint && this.toPoint.direct) {
            if (this.toPoint.direct == 'top') {
                this.exitDirection = [0, -1];
            } else if (this.toPoint.direct == 'right') {
                this.exitDirection = [1, 0];
            } else if (this.toPoint.direct == 'bottom') {
                this.exitDirection = [0, 1];
            } else {
                this.exitDirection = [-1, 0];
            }
        }
    }

    polylineConnection(x, y) {
        if (x&&y) {
            this.toPoint = {
                x: x,
                y: y
            };
        }
        this.calcDirection();

        let obj = {
            entryPoint: [this.fromPoint.x, this.fromPoint.y],
            exitPoint: [this.toPoint.x, this.toPoint.y],
            entryDirection: this.entryDirection,
            exitDirection: this.exitDirection,
            entryExt: this.entryExt,
            exitExt: this.exitExt
        }
        if(typeof obj.entryPoint[0]=='number'&&typeof obj.entryPoint[0]=='number'
        &&typeof obj.exitPoint[0]=='number'&&typeof obj.exitPoint[0]=='number'){

            var ps = connection(obj);
            var points = [];

            ps.forEach(item => {
                points.push(item.position);
                // if(item.type=="pathMiddleP"){
                //     this.lineCenter=item.position;
                // }
            });

            this.cpx.cpx1 = points[1][0];
            this.cpx.cpy1 = points[1][1];

            this.cpx.cpx2 = points[points.length - 2][0];
            this.cpx.cpy2 = points[points.length - 2][1];

            var len = ps.length;

            var n = parseInt(len / 2) - 1;
            this.lineCenter = [(points[n][0] + points[n + 1][0]) / 2, (points[n][1] + points[n + 1][1]) / 2]

            if (this.lineWidth % 2 == 1) {
                points.forEach(item => {
                    item[0] = parseInt(item[0]) + 0.5;
                    item[1] = parseInt(item[1]) + 0.5;
                })
            } else {
                points.forEach(item => {
                    item[0] = parseInt(item[0]);
                    item[1] = parseInt(item[1]);
                })
            }

            this.cpx.points=zrender.util.clone(points);
            this.cpx.lineCenter=this.lineCenter.slice();

            this.bs.attr({
                shape: {
                    points
                }
            });
            this.renderText();
       }
    }

    move(x, y) {
        if (this.fromPoint.direct == 'left' || this.fromPoint.direct == 'right') {
            if (x > this.fromPoint.x || x > this.temx) {
                this.exitDirection = [-1, 0];
            } else if (x < this.fromPoint.x || x < this.temx) {
                this.exitDirection = [1, 0];
            }
        } else {
            if (y > this.fromPoint.y || y > this.temy) {
                this.exitDirection = [0, -1];
            } else if (y < this.fromPoint.y || x < this.temy) {
                this.exitDirection = [0, 1];
            }
        }
        this.temx = x;
        this.temy = y;

        if (this.type == 'polyline') {
            this.polylineConnection(x, y)
        } else {
            var box = this.calc(x, y);
            this.bs.attr({
                shape: box
            });
            this._refresh();
        }
    }

    //计算三角形坐标
    calcPoints(box) {
        if (!box) {
            return;
        }
        var angle;
        if (this.type == "line") {
            angle = Math.atan((box.x1 - box.x2) / (box.y1 - box.y2));
        } else {
            angle = Math.atan((box.cpx2 - box.x2) / (box.cpy2 - box.y2));
        }
        var w = 8;
        var h = 3;
        var points = [];
        var p1 = [], p2 = [];
        if (this.type == 'line') {
            if (box.y1 >= box.y2) {
                p1[0] = (w) * Math.sin(angle) - (-h) * Math.cos(angle) + box.x2;
                p1[1] = (w) * Math.cos(angle) + (-h) * Math.sin(angle) + box.y2;
                p2[0] = (w) * Math.sin(angle) - (h) * Math.cos(angle) + box.x2;
                p2[1] = (w) * Math.cos(angle) + (h) * Math.sin(angle) + box.y2;
            } else {
                p1[0] = (-w) * Math.sin(angle) - (-h) * Math.cos(angle) + box.x2;
                p1[1] = (-w) * Math.cos(angle) + (-h) * Math.sin(angle) + box.y2;
                p2[0] = (-w) * Math.sin(angle) - (h) * Math.cos(angle) + box.x2;
                p2[1] = (-w) * Math.cos(angle) + (h) * Math.sin(angle) + box.y2;
            }
        } else {
            if (box.cpy2 >= box.y2) {
                p1[0] = (w) * Math.sin(angle) - (-h) * Math.cos(angle) + box.x2;
                p1[1] = (w) * Math.cos(angle) + (-h) * Math.sin(angle) + box.y2;
                p2[0] = (w) * Math.sin(angle) - (h) * Math.cos(angle) + box.x2;
                p2[1] = (w) * Math.cos(angle) + (h) * Math.sin(angle) + box.y2;
            } else {
                p1[0] = (-w) * Math.sin(angle) - (-h) * Math.cos(angle) + box.x2;
                p1[1] = (-w) * Math.cos(angle) + (-h) * Math.sin(angle) + box.y2;
                p2[0] = (-w) * Math.sin(angle) - (h) * Math.cos(angle) + box.x2;
                p2[1] = (-w) * Math.cos(angle) + (h) * Math.sin(angle) + box.y2;
            }
        }
        var p3 = [box.x2, box.y2];
        points.push(p1,p2,p3);

        return points;
    }

    setToNode(node) {
        this.toNode = node;
    }
    setToAnch(anch){
        this.toAnch=anch;
        if(anch){
            this.setToPoint(this.toNode.getAnchorByIndex(anch.point.index));
            this._refresh();
        }
    }

    removeToNode(){
        this.toNode=null;
        this.toAnch=null;
    }

    setToPoint(point) {
        this.toPoint = {...this.toPoint,...point};
        this.cpx.x2 = point.x;
        this.cpx.y2 = point.y;
        this.calcDirection();
        this._refresh();
        this.renderText();
    }

    active() {
        this.status = 'active';
        this.bs.setStyle('stroke', 'orange');
        this.fromPointCircle.attr({
            shape:{
                cx:this.cpx.x1,
                cy:this.cpx.y1
            }
        });
        this.toPointCircle.attr({
            shape:{
                cx:this.cpx.x2,
                cy:this.cpx.y2
            }
        });
        this.fromPointCircle.show();
        this.toPointCircle.show();
        if(this.type=='bs'){
            var box=this.cpx;
            this.cpx1.attr({
                position:[box.cpx1,box.cpy1]
            });
            this.cpx2.attr({
                position:[box.cpx2,box.cpy2]
            });
            this.cpx1.show();
            this.cpx2.show();
            this.line1.show();
            this.line2.show();
        }
        
    }

    unactive() {
        this.status = 'over';
        this.bs.setStyle('stroke', this.stroke);
        this.cpx1.hide();
        this.cpx2.hide();
        this.line1.hide();
        this.line2.hide();
        this.fromPointCircle.hide();
        this.toPointCircle.hide();
    }

    isactive() {
        return this.status == 'active';
    }

    setTextBackground(color) {
        this.textBackgroundColor = color;
        this.relateText.attr({
            style: {
                textBackgroundColor: color
            }
        })
    }

    flush() {
        //this.move();
        this._refresh();
    }

    refresh() {
        this._refresh();
    }

    doRefresh() {
        this._refresh();
    }
    showCircle(){
      
        this.fromPointCircle.show();
        this.toPointCircle.show();
    }

    initEvent() {
        this.bs.on('click', () => {
            this.active();
            this.__zr&&this.__zr.trigger('clearSelectNode');
            this.__zr&&this.__zr.trigger('selectEdge', { edge: this });
        });

        this.bs.on('dblclick', (e) => {
            e.edge = this;
            e.status='editEdge';
            e.text=this.relateText.style.text;
            this.__zr&&this.__zr.trigger('edit', e);
        });

        this.bs.on('contextmenu', (e) => {
            this.active();
            this.__zr&&this.__zr.trigger('showRelateLinkMenu', e);
        });
        this.fromPointCircle.on('mousedown',()=>{
            this.fromPointCircle.oldCenter={
                x:this.fromPointCircle.shape.cx,
                y:this.fromPointCircle.shape.cy
            }
        });
        this.toPointCircle.on('mousedown',()=>{
            this.toPointCircle.oldCenter={
                x:this.toPointCircle.shape.cx,
                y:this.toPointCircle.shape.cy
            }
        });

        // this.cpx1.on('dragstart',()=>{
        //     this.cpx1.oldPos=this.cpx1.position.slice();
        // });
        this.cpx1.on('drag',()=>{
            var pos=this.cpx1.position.slice();
            this.cpx.cpx1=pos[0];
            this.cpx.cpy1=pos[1];
           // window.edge=this;
           // window.console.log(pos[0]);
            this._refresh();
        });
        this.cpx2.on('drag',()=>{
            var pos=this.cpx2.position.slice();
            this.cpx.cpx2=pos[0];
            this.cpx.cpy2=pos[1]
            this._refresh();
        });
    }

    setCpx1(x, y, dx, dy) {
        this.cpx.cpx1 = x;
        this.cpx.cpy1 = y;

        this.setx1(x, y, dx, dy);
        this._refresh();
    }

    setCpx2(x, y, dx, dy) {
        this.cpx.cpx2 = x;
        this.cpx.cpy2 = y;
        this.setx2(x, y, dx, dy);
        this._refresh();
    }

    _refresh() {
       // window.console.log(1111111111);
        this.setLineDashType();
        var points;
        var box = this.cpx;
        if (this.type == 'bs' || this.type == "line") {
            this.bs.attr({
                shape: box
            });
           
        } else {
            this.fromPoint = { ...this.fromPoint, ...{ x: this.cpx.x1, y: this.cpx.y1 } };
            this.toPoint = { ...this.toPoint, ...{ x: this.cpx.x2, y: this.cpx.y2 } };
            this.polylineConnection();
        }
        // this.fromCircle.attr({
        //     shape: {
        //         cx: box.x1,
        //         cy: box.y1
        //     }
        // })

       
       // if(this.type=='bs'){
            this.line1.attr({
                shape: {
                    x1: box.x1,
                    y1: box.y1,
                    x2: box.cpx1,
                    y2: box.cpy1
                }
            })
            this.line2.attr({
                shape: {
                    x1: box.x2,
                    y1: box.y2,
                    x2: box.cpx2,
                    y2: box.cpy2
                }
            })
     //   }

        points = this.calcPoints(box)
        this.pl.attr({
            shape: {
                points: points
            }
        })
        this.pl.show();
        this.renderText();
    }

    setx1(x, y) {
        var pos = this.fromNode.getPosition();
        var box = this.fromNode.getBoundingRect();

        if (x >= pos.x - 2 && x <= pos.x + box.width + 2) {
            this.cpx.x1 = x;
            this.cpx.fromcx = x - pos.x;
        } else if (x < pos.x - 2 || x > pos.x + box.width + 2) {
            if (y > pos.y - 2 && y < pos.y + box.height + 2) {
                this.cpx.y1 = y;
                this.cpx.fromcy = y - pos.y;
            }
        }

    }

    setx2(x, y) {
        var pos = this.toNode.getPosition();
        var box = this.toNode.getBoundingRect();
        if (x > pos.x - 2 && x < pos.x + box.width + 2) {
            this.cpx.x2 = x;
            this.cpx.tocx = x - pos.x;
        } else if (x < pos.x - 2 || x > pos.x + box.width + 2) {
            if (y > pos.y - 2 && y < pos.y + box.height + 2) {
                this.cpx.y2 = y;
                this.cpx.tocy = y - pos.y;
            }
        }
    }

    getCpx() {
        return {
            cpx1: this.cpx.cpx1,
            cpx2: this.cpx.cpx2,
            cpy1: this.cpx.cpy1,
            cpy2: this.cpx.cpy2,
            x1: this.cpx.x1,
            y1: this.cpx.y1,
            x2: this.cpx.x2,
            y2: this.cpx.y2,
            points:zrender.util.clone(this.cpx.points),
            lineCenter:this.lineCenter.slice(),
            type:this.type
        }
    }

    setCpx(box) {
        this.cpx = zrender.util.clone(box);
        if(box.type=='polyline'){
            this.cpx=box;
            this.lineCenter=this.cpx.lineCenter.slice();
            this.bs.attr({
                shape: {
                    points:box.points
                }
            });
            var points = this.calcPoints(box);
            this.pl.attr({
                shape:{
                    points
                }
            })
            this.renderText();
        }else{
            this._refresh();
        }
    }
    setPosition(x,y){
        this.attr({
            position:[x,y]
        })
    }

    renderText() {
        const box = this.cpx;

        const p1 = [box.x1, box.y1];
        const cp1 = [box.cpx1, box.cpy1];
        const cp2 = [box.cpx2, box.cpy2];
        const p2 = [box.x2, box.y2];
        var point;

        if (this.type == 'bs') {
            point = this.threeBezier(0.5, p1, cp1, cp2, p2);
        } else if (this.type == "polyline") {
            point = this.lineCenter;
        } else {
            point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        }

        var textBox = this.relateText.getBoundingRect();
        var x = point[0] - textBox.width / 2;
        var y = point[1] - textBox.height / 2;


        this.relateText.attr({
            style: {
                textBackgroundColor: this.textBackgroundColor
            },
            position: [x, y]
        });

        // if(this.text=='联系'||this.text=='relate'||!this.text){
        //     this.relateText.hide();
        // }else{
        //     this.relateText.show();
        // }
        if(this.text){
            this.relateText.show();
        }else{
            this.relateText.hide();
        }

    }

    setText(text) {
        this.text = text;
        this.relateText.setStyle('text', this.text);
        this.renderText();
    }

    getText(){
        return this.text||this.relateText.style.text;
    }

    setColor(color) {
        this.stroke = color;
        this.bs.attr({
            style: {
                stroke: color
            }
        });
        // this.fromCircle.attr({
        //     style: {
        //         stroke: color,
        //         //fill:color
        //     }
        // });
        this.pl.attr({
            style: {
                stroke: color
            }
        });
    }
    /**
     * @desc 一阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     */
    oneBezier(t, p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        let x = x1 + (x2 - x1) * t;
        let y = y1 + (y2 - y1) * t;
        return [x, y];
    }
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    twoBezier(t, p1, cp, p2) {
        const [x1, y1] = p1;
        const [cx, cy] = cp;
        const [x2, y2] = p2;
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }
    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
    threeBezier(t, p1, cp1, cp2, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [cx1, cy1] = cp1;
        const [cx2, cy2] = cp2;
        let x =
            x1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cx1 * t * (1 - t) * (1 - t) +
            3 * cx2 * t * t * (1 - t) +
            x2 * t * t * t;
        let y =
            y1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cy1 * t * (1 - t) * (1 - t) +
            3 * cy2 * t * t * (1 - t) +
            y2 * t * t * t;
        return [x, y];
    }

    getTextPosition() {
        var pos = this.position.slice();
        var tpos = this.relateText.position.slice();
        return {
            x: pos[0] + tpos[0],
            y: pos[1] + tpos[1]
        }
    }

    getTextBox() {
        return this.relateText.getBoundingRect()
    }

    setAttr(stroke) {
        this.bs.attr({
            style: {
                stroke
            }
        });
        // this.fromCircle.attr({
        //     style: {
        //         stroke
        //     }
        // });
        this.pl.attr({
            style: {
                stroke,
                fill: this.stroke
            }
        });
        this.relateText.attr({
            style: {
                text: this.text,
                textFill: this.textFill,
                fontSize: this.fontSize,
                fontStyle: this.fontStyle,
                fontWeight: this.fontWeight,
                textBackgroundColor: this.textBackgroundColor
            }
        });
    }

    setData(data) {
        this.id=data['id'];
        this.text = data['text'];
        this.stroke = data['stroke'];
        this.textFill = data['textFill'];
        this.type = data['type'];
        this.textBackgroundColor = data['fill'],
        this.lineDashType = data['lineDashType'] || this.lineDashType;
        this.lineWidth = data['lineWidth'] || 1;
        this.fontSize = data['fontSize'] || 12,
        this.fontStyle = data['fontStyle'] || 'normal';
        this.fontWeight = data['fontWeight'];
        this.entryExt = data['ext'];
        this.exitExt = data['ext'];

        this.entryDirection=data['entryDirection'];
        this.exitDirection=data['exitDirection'];

        if(data['position']){
            this.setPosition(data['position'][0],data['position'][1]);
        }

        this.cpx = data['cpx'] || this.getCpx();
        this.lineCenter=data['lineCenter'];
    
        this.setLineDashType();
       // this.lineDash=data['lineDash'].slice();

        // this.setAttr(this.stroke, this.textFill, this.textBackgroundColor);
        // this.setText(this.text);
        // this.changeType(this.type);

        // if(data['fromNode']){
        //     let node=this.editor.getNodeById(data['fromNode']);
        //     if(node){
        //         let point=node.getAntchrsByIndex(data['fromAnch']);
        //         this.fromNode=node;
        //         this.fromAnch=point.anch;
        //     }
        // }

        // if(data['toNode']){
        //     let node=this.editor.getNodeById(data['toNode']);
        //     if(node){
        //         let point=node.getAntchrsByIndex(data['toAnch']);
        //         this.toNode=node;
        //         this.toAnch=point.anch;
        //     }
        // }

        this.setAttr(this.stroke, this.textFill, this.textBackgroundColor);
        this.setText(this.text);
        this.changeType(this.type);

        if (this.type == "bs") {
            this.setCpx(data.cpx);
        }

        if(this.text){
            this.relateText.show();
        }else{
            this.relateText.hide();
        }
    }

    getData() {
        var cpx = this.getCpx();
        return {
             ...{   id:this.id||this.bs.id,
                    fromNode: this.fromNode&&this.fromNode.getId()||'',
                    endNode: this.toNode&&this.toNode.getId()||'',
                    fromAnch:this.fromAnch&&this.fromAnch.point.index||'',
                    toAnch:this.toAnch&&this.toAnch.point.index||'',
                    text: this.text,
                    stroke: this.stroke,
                    textFill: this.textFill,
                    lineWidth: this.lineWidth,
                    lineDashType:this.lineDashType,
                    fontSize: this.fontSize,
                    fontStyle: this.fontStyle,
                    fontWeight: this.fontWeight,
                    type: this.type,
                    ext:this.entryExt,
                    lineDash: this.lineDash.slice(),
                    fill: this.textBackgroundColor,
                    lineCenter:this.lineCenter.slice(),
                    entryDirection:this.entryDirection.slice(),
                    entryExt:this.entryExt,
                    exitDirection:this.exitDirection.slice(),
                    exitExt:this.exitExt,
                    cpx,
                    position:this.position.slice()
            }
        }
    }

    changeType(type) {
        this.type = type || this.type;
        this.remove(this.bs);

        if (type == 'bs') {
            this.bs = new zrender.BezierCurve({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth || 1,
                    lineDash: this.lineDash 
                },
                z: 16
            });
        } else if (type == "polyline") {
            this.bs = new zrender.Polyline({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth || 1,
                    lineDash: this.lineDash 
                },
                z: 16
            });
        } else {
            this.bs = new zrender.Line({
                style: {
                    stroke: this.stroke,
                    lineWidth: this.lineWidth || 1,
                    lineDash: this.lineDash 
                },
                z: 16
            });
        }
        this.add(this.bs);
        this.initEvent();
        this._refresh();
    }
}