import zrender from 'zrender';
class Frame {
    constructor(editor) {
        //   super();
        this.editor=editor;
        this.w = 6;
        this.isShow=true;
        this.createBar();
        this.initEvent();
        this.hide();
    }
    addTo(zr) {
        this.zr = zr;
        zr.add(this.lefttopbar);
        zr.add(this.leftbottombar);
        zr.add(this.righttopbar);
        zr.add(this.rightbottombar);
        zr.add(this.frame);
    }
    createBar() {
        var w = this.w;
        this.frame = new zrender.Rect({
            style: {
                fill: 'transparent'
            }
        });
        this.lefttopbar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'nw-resize',
            z: 30001
        })
        this.righttopbar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'ne-resize',
            z: 30001
        })
        this.leftbottombar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'sw-resize',
            z: 30001
        })
        this.rightbottombar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'se-resize',
            z: 30001
        });
        //    this.add(this.lefttopbar);
        //    this.add(this.leftbottombar);
        //    this.add(this.righttopbar);
        //    this.add(this.rightbottombar);
        //    this.add(this.frame);
        this.hide();
    }
    hide() {
        if(this.isShow){
            this.lefttopbar.hide();
            this.leftbottombar.hide();
            this.righttopbar.hide();
            this.rightbottombar.hide();
            this.frame.hide();
            this.isShow=false;
        }
    }
    show() {
        if(!this.isShow){
            this.lefttopbar.show();
            this.leftbottombar.show();
            this.righttopbar.show();
            this.rightbottombar.show();
            this.frame.show();
            this.isShow=true;
        }
    }
    boxSelect(box, item) {
        this.boxItem = item;
        box.x = parseInt(box.x) + 0.5;
        box.y = parseInt(box.y) + 0.5;
        box.width = box.width - 1;
        box.height = box.height - 1;
        this.box = box;
        this.frame.attr({
            position: [box.x, box.y],
            style: {
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                x: 0,
                y: 0,
                width: box.width,
                height: box.height
            }
        });

        // this.refreshBar();
        this.show();
    }
    refreshBar() {
        var w = this.w;
        // window.console.log(-w/2,this.lefttopbar);
        this.lefttopbar.attr({
            position: [this.box.x, this.box.y],
            shape: {
                x: -w / 2,
                y: -w / 2,
            }
        });

        this.righttopbar.attr({
            position: [this.box.x + this.box.width, this.box.y],
            shape: {
                x: -w / 2,
                y: -w / 2
            }
        });

        this.leftbottombar.attr({
            position: [this.box.x, this.box.y + this.box.height],
            shape: {
                x: -w / 2,
                y: -w / 2
            }
        });

        this.rightbottombar.attr({
            position: [this.box.x + this.box.width, this.box.y + this.box.height],
            shape: {
                x: -w / 2,
                y: -w / 2
            }
        });
    }

    refreshGroup() {
        //this.groupItem.eachChild((child)=>{
        var box = this.box;
        var p = this.boxItem.position.slice();
        if (this.boxItem.type == "ellipse") {
            var rx = box.width / 2;
            var ry = box.height / 2;
            var cx = box.x + rx;
            var cy = box.y + ry;

            this.boxItem.attr({
                shape: {
                    cx: cx - p[0],
                    cy: cy - p[1],
                    rx,
                    ry
                }
            });
        } else if(this.boxItem.type=='image') {
            this.boxItem.attr({
                position:[box.x,box.y],
                style: {
                    width: box.width,
                    height: box.height
                }
            });
            
        }else{
            this.boxItem.attr({
                position:[box.x,box.y],
                shape: {
                    x:0,
                    y:0,
                    width: box.width,
                    height: box.height
                }
            });
        }

        // });
    }

    initEvent() {
        var that = this;
        var  drag = false, sx, sy, oldData,x,y,width,height;
        var bars = [this.lefttopbar, this.leftbottombar, this.righttopbar, this.rightbottombar];

        bars.forEach((bar, i) => {

            bar.on('dragstart', function (e) {
               // pos = this.position.slice();
                x  = that.box.x;
                y  = that.box.y;
                width  = that.box.width;
                height = that.box.height;
                drag = true;
                sx = e.offsetX;
                sy = e.offsetY;
                oldData = that.boxItem.getData();
                
                that.editor.status='resizeNode';
            });

            bar.on('drag', function (e) {
                if (drag) {
                    var dx = e.offsetX - sx;
                    var dy = e.offsetY - sy;
                    if (i == 0) {
                        that.box.x = x + dx;
                        that.box.y = y + dy;
                        that.box.width = width - dx;
                        that.box.height = height - dy;
                    } else if (i == 1) {
                        that.box.x = x + dx;
                        that.box.y = y;
                        that.box.width = width - dx;
                        that.box.height = height + dy;
                    } else if (i == 2) {
                        that.box.x = x;
                        that.box.y = y + dy;
                        that.box.width = width + dx;
                        that.box.height = height - dy;
                    } else {
                        that.box.x = x;
                        that.box.y = y;
                        that.box.width = width + dx;
                        that.box.height = height + dy;
                        //window.console.log(x,y);
                    }

                    // this.attr({
                    //     position: [pos[0] + dx, pos[1] + dy]
                    // })
                    // window.console.log(dx,dy)
                   
                    that.refreshGroup();
                    that.boxSelect(that.box, that.boxItem);
                    that.refreshBar();
                    that.boxItem.refreshEdge();
                    if (that.boxItem.nodeGroup) {
                        that.boxItem.nodeGroup.refresh();
                    }
                }
            });

            bar.on('dragend', function () {
                this.__zr&&this.__zr.trigger('resizeNode', { oldData });
                drag = false;
                that.editor.status=''
            });

        });

        document.addEventListener('mouseup', () => {
            if(drag){
                drag = false;
                this.editor.status=''
            }
        });
        // document.addEventListener('mousedown', () => {
        //     pos = this.position.slice();
        //     box = { ...{}, ...that.box };
        //     drag = true;
        //     sx = e.offsetX;
        //     sy = e.offsetY;
        //     oldData = that.boxItem.getData();
        // });
        // document.addEventListener('mousemove', () => {
        //     drag = false;
        // });
    }




}

export default Frame;