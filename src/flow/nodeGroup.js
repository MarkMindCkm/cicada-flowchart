import zrender from 'zrender';
import Anch from './anch';

class NodeGroup extends zrender.Group {
    constructor(nodes = [], text = '新建分组', fill = '#fafafa', stroke = '#ccc', textFill = '#333', strokeType = "dash",z=1) {
        super();
        this.nodes = nodes;
        this.groupText = text;
        this.stroke = stroke;
        this.fill = fill;
        this.textFill = textFill;
        this.strokeType = strokeType;
        this.headFill = '';
        this.locked=false;
        this.lockImage={
            lockImage:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVQ4T2NkoBAwYtOvKCkgz/iftZfhP4MEWJ6R4cV/xt/F959/eIiuHsMAJUFBfgY25tP/GBlSH7x4cxCkQU5CSIuFgWnGvx9//B58+PAB2RBMAyREGv/9/Xf8wet3O5AVKkiIODAyMDjdf/GmDr8B4iKb7718E8TAwPAbzbmsSuIi6++9fONDyIDd916+ccUWNkriIhhycC/IifErMTGxyjH9Y+j5x8RQgs0AmNy/f78fPXr18R4kfKFAWUKk6/9/Br5///+LMTExXsJmwL9///WYGBlfMTIyfLr74k0ZhgF//jIuf/j69Xl8SUNeVNSQhfl/5KgBtAoDBgYGJwYGhi8EMigPAwPDPoxYIDdXAwB8nKARpjp7NAAAAABJRU5ErkJggg==',
            unLockImage:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA00lEQVQ4T93TIUuDURSA4WdJmC4blvQ/iHmiYYYV2/6FMEw2MSwOhIFhdTBYmFXDksExFlzSosXmTxDkwhe+Xa67sDVPPuc9977nnIoto/JH/Q7ucI49zHGN5zg/BQjFUyzQwzcu0MUZZmVICnCFJhpRt07xopMcYIwn9CPAIZao5gCPGGAYAXbxhvqmgKTvsoMa3rGfmewHWngNeWXAESZoZwCXeMFtDDgu/h1krYsg9ws3/xAQJI5wkHFwj8+UxLAoD1hZ1QTsB6fFvayMcaPD/gW+1yoRIiSCtwAAAABJRU5ErkJggg=='
        };
        this.lockImageItem=new zrender.Image({
            style:{
                image:this.lockImage.unLockImage,
                width:16,
                height:16
            },
            z:z+1
        })
        this.getLineDash();
        this.showHead = true;
        this.anchors = [];
        this.groupStyle = {
            fill: this.fill,
            lineWidth: 1,
            stroke: this.stroke,
            lineDash: this.lineDash
        };
        this.headStyle = {
            fill: this.fill,
            lineWidth: 1,
            stroke: this.stroke,
            text: this.groupText,
            textFill: this.textFill,
            lineDash: this.lineDash,
            textPosition: 'insideLeft',
            fontSize: 12,
            fontStyle: '',
            fontWeight: '',
            transformText:true
        };
        
        this.z=z;

        this.groupRect = new zrender.Rect({
            style: this.groupStyle,
            z:z
        });
        this.groupHead = new zrender.Rect({
            style: this.headStyle,
            z:z
        });
        this.gtext = new zrender.Text({
            style: {
                textPadding: [6, 10],
                fontSize: 14,
                text: this.groupText
            }
        });

        this.nodeType='group';

        this.add(this.groupRect);
        this.add(this.groupHead);
        this.add(this.lockImageItem);

        this.redoGroup();

        this.groupHead.nodeGroup = this;
        this.groupRect.nodeGroup = this;
        

        this.create();
        this.createAnchors();
        this.anch = new Anch(this);
        this.anch.hide();
        
        this.initEvent();
    }
    getId() {
        return this.id || this.groupRect.id;
    }
    setId(id){
        this.id=id;
    }
    getLineDash() {
        if (this.strokeType == 'solid') {
            this.lineDash = [];
        } else {
            this.lineDash = [4, 2];
        }
    }
    create(nodes) {
               if(this.locked){
                    let pos = this.position.slice();
                    let g = new zrender.Group();
                    let box=g.getBoundingRect([this]);
                    box.width = parseInt(box.width);
                    box.height = parseInt(box.height);
                    box = {
                        x: pos[0],
                        y: pos[1],
                        width:box.width,
                        height:box.height
                    }
                   this.box = box
                   this._refresh();
                   return;
               }

                var g = new zrender.Group();
                let box = {};
                this.gtext.setStyle('text', this.groupText);
                this.tb = this.gtext.getBoundingRect();
                var tb = this.tb;
                tb.height = Math.ceil(tb.height);

                if (this.nodes.length > 0) {
                    box = g.getBoundingRect(nodes || this.nodes);
                    box.x = parseInt(box.x);
                    box.y = parseInt(box.y);
                    box.width = parseInt(box.width);
                    box.height = parseInt(box.height);

                    if (box.width < 40) {
                        box.width = 40;
                    }

                    if (box.height < 40) {
                        box.height = 40;
                    }
                
                    box.x -= 20;
                    box.width += 40;

                    if (this.showHead) {
                        box.y = box.y - tb.height - 20;
                        box.height += 40 + tb.height;
                        this.groupHead.show();
                    } else {
                        box.y = box.y - 20;
                        box.height += 40;
                        this.groupHead.hide();
                    }
                    this.box = box;

            } else {  
            
                var pos = this.position.slice();
                box = {
                    x: pos[0],
                    y: pos[1],
                    width:80,
                    height:60+ tb.height
                }
                this.box = box
            }

          this._refresh();
       
    }

    toggleLock(){
         this.locked=!this.locked;
         if(this.locked){
            this.lockImageItem.attr({
                style:{
                    image:this.lockImage.lockImage
                }
            });
         }else{
            this.lockImageItem.attr({
                style:{
                    image:this.lockImage.unLockImage
                }
            });
         }
    }

    createAnchors() {
        this.anchors = [];
        var box = this.box;
        var t1 = { x: box.x + box.width / 4, y: box.y, index: 1, node: this, direct: 'top' };
        var t2 = { x: box.x + box.width / 2, y: box.y, index: 2, node: this, direct: 'top' };
        var t3 = { x: box.x + box.width / 4 * 3, y: box.y, index: 3, node: this, direct: 'top' };
        var r1 = { x: box.x + box.width, y: box.y + box.height / 4, index: 4, node: this, direct: 'right' };
        var r2 = { x: box.x + box.width, y: box.y + box.height / 2, index: 5, node: this, direct: 'right' };
        var r3 = { x: box.x + box.width, y: box.y + box.height / 4 * 3, index: 6, node: this, direct: 'right' };
        var b1 = { x: box.x + box.width / 4, y: box.y + box.height, index: 7, node: this, direct: 'bottom' };
        var b2 = { x: box.x + box.width / 2, y: box.y + box.height, index: 8, node: this, direct: 'bottom' };
        var b3 = { x: box.x + box.width / 4 * 3, y: box.y + box.height, index: 9, node: this, direct: 'bottom' };
        var l1 = { x: box.x, y: box.y + box.height / 4, index: 10, node: this, direct: 'left' };
        var l2 = { x: box.x, y: box.y + box.height / 2, index: 11, node: this, direct: 'left' };
        var l3 = { x: box.x, y: box.y + box.height / 4 * 3, index: 12, node: this, direct: 'left' };
        this.anchors.push(t1, t2, t3, r1, r2, r3, b1, b2, b3, l1, l2, l3);
    }

    getAnchorByIndex(index) {
        return this.anchors.filter(item => item.index == index)[0];
    }
    getAnchByIndex(index){
        if(this.anch){
            return this.anch.getBarByIndex(index);
        }
    }

    getAnchors() {
        return this.anchors;
    }

    _refresh() {
            var box = this.box;
            this.attr({
                position: [box.x, box.y]
            });
            
            if(!this.locked){
                var tb = this.tb;
                this.groupRect.attr({
                    style: this.groupStyle,
                    shape: {
                        x: 0.5,
                        y: 0.5,
                        width: box.width,
                        height: box.height
                    }
                });
        
                this.groupHead.attr({
                    style: this.headStyle,
                    shape: {
                        x: 0.5,
                        y: 0.5,
                        width: box.width,
                        height: tb.height
                    }
                });
                this.lockImageItem.attr({
                    position:[box.width-20,5]
                });

            }else{
                this.groupRect.attr({
                    style: this.groupStyle
                });
                this.groupHead.attr({
                    style: this.headStyle
                });
            }
    

    }
    setPosition(x, y) {
        this.attr({
            position: [x, y]
        });
    }
    getPosition() {
        var p = this.position.slice()
        return {
            x: p[0],
            y: p[1]
        }
    }
    viewTemGroup(mark, node) {
       
        if (mark == 'up') {
            let nodes = this.nodes.slice();
            this.create(nodes.concat(node));

        } else {
            let nodes = this.nodes.filter(n => {
                return n != node;
            });
            
            if (nodes.length) {
                this.create(nodes)
            } else {
                this.create([this]);
            }
            
        }
    }
    move(dx, dy) {
        var p = this.getPosition();
        this.attr({
            position: [p.x + dx, p.y + dy]
        });
    }
    addNode(node) {
        node.nodeGroup = this;
        if (this.nodes.indexOf(node == -1)) {
            this.nodes.push(node);
            this.refresh();
        }
    }
    
    setLevel(z){
        this.z=z;
        this.groupRect.attr({
            z:z
        });
        this.groupHead.attr({
            z:z
        });
    }

    getLevel(){
        return this.z
    }
    
    removeNode(node) {
        var index = this.nodes.indexOf(node)
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
        node.nodeGroup = null;
        this.refresh();
    }
    refresh() {
        this.create();
        this.refreshEdge();
        var topGroup=this.topGroup;
        while(topGroup){
            topGroup.refresh();
            topGroup=topGroup.topGroup;
        }
    }
    refreshEdge() {
       // this.create();
        this.createAnchors();
        this.anch.refresh();
        this.__zr && this.__zr.trigger('refreshEdge', { node: this });
    }
    cancelGroup() {
        this.nodes.forEach(node => {
            node.nodeGroup = null
        });
    }
    redoGroup() {
        this.nodes.forEach(node => {
            node.nodeGroup = this;
        });
    }
    getStyle() {
        var fontData = this.groupHead.style;
        return {
            stroke: this.stroke,
            groupFill: this.fill,
            text: this.text,
            showHead: this.showHead,
            ...fontData
        }
    }

    getGroupStyle() {
        return zrender.util.clone(this.groupStyle);
    }

    setGroupStyle(data) {
        this.stroke = data.stroke;
        this.fill = data.fill;
        this.groupStyle = { ...this.groupStyle, ...data };
        this.headStyle.stroke = this.stroke;
        this.refresh();
    }

    getHeadStyle() {
        return zrender.util.clone(this.headStyle);
    }

    setHeadStyle(data) {
        this.headFill = data.fill;
        this.groupText = data.text;
        this.headStyle = { ...this.headStyle, ...data };
        this.gtext.setStyle('fontSize', data.fontSize);
        this.gtext.setStyle('text', data.groupText);
        this.refresh();
    }

    changeHead(flag) {
        this.showHead = flag;
        if (flag) {
            this.groupHead.show();
        } else {
            this.groupHead.hide();
        }
        this.refresh();
    }
    
    getGroupData(group){
        var nodes=[];
        group.nodes.forEach(n=>{
            if(n.nodeType=='node'){
                let obj={
                    type:'node',
                    node:n.getId()
                }
                nodes.push(obj)
            }
        });

        var data={
            id:group.getId(),
            nodes: nodes,
            topGroup:group.topGroup&&group.topGroup.getId()||'',
            headStyle: zrender.util.clone(group.groupHead.style),
            groupStyle: zrender.util.clone(group.groupRect.style),
            showHead: group.showHead,
            locked:group.locked
        }

        if(group.locked){
           data.box=zrender.util.clone(group.box);
        }

        return data;
        
    }

    setBox(box){
        this.box=box;
    }

    getData() {
    
        return this.getGroupData(this);
    }

    setOldPos(){

        function getItems(item){
            item.oldPos=item.position.slice();
            item.nodes.forEach(n=>{
                n.oldPos = n.position.slice();
                if(n.type=='group'){
                    getItems(n);
                }
            });
        }
        getItems(this);

    }

    getAllItems(){
        var ns=[this];
        function getItems(item){
            item.nodes.forEach(n=>{
                ns.push(n);
                if(n.type=='group'){
                    getItems(n);
                }
            });
        }
        getItems(this);
        return ns;
    }


    initEvent() {
        var drag = false, sx, sy, pos, dx, dy, isMove = false,that = this,allItems;
        
        //topGroupBox=null,groupBox=null;
        //let g=new zrender.Group();
        //var leaveTopGroup=false;
        
        this.on('mouseover', () => {
            this.create();
            this.createAnchors();
            this.anch.refresh();
            this.anch.show();
            this.lockImageItem.show();
        });

        this.on('mouseout', () => {
            this.anch.hide();
            this.lockImageItem.hide();
        });

      
       this.on('mousedown', (e) => {
        
            this.__zr.trigger('clearSelectItems');
            this.__zr.trigger('selectGroup', { group: this });

            sx = parseInt(e.offsetX);
            sy = parseInt(e.offsetY);

            drag = true;
            pos = this.position.slice();
            this.setOldPos();
            allItems=this.getAllItems();
         
            if (this.editor) {
                this.editor.multipleSelectEdges(allItems);
                var g=new zrender.Group();
                var box=g.getBoundingRect([this]);
                this.editor.cover.attr({
                    position:[pos[0],pos[1]],
                    shape:{
                        width:box.width,
                        height:box.height
                    }
                });
            }

            allItems.forEach(item => {
                   item.anch && item.anch.hide();
            });

            this.dragging=false;

             document.addEventListener('mousemove', mouseMove);
             document.addEventListener('mouseup', mouseUp);

            e.stopPropagation && e.stopPropagation();
        });

        var mouseMove=(e)=>{
            if (drag) {
                dx = parseInt(e.offsetX - sx);
                dy = parseInt(e.offsetY - sy);

                if (this.editor) {
                   this.editor.cover.show();
                   this.editor.cover.attr({
                       position: [pos[0] + dx, pos[1] + dy]
                   });
                }

                isMove = true;
                this.dragging=true;
                this.anch.hide();
            }
        }

       

        // this.on('mouseup', () => {
        //     this.dragging=false;
        //     drag = false;
          

        //     // if(this.topGroup){
        //     //     topGroupBox=null;
        //     //     leaveTopGroup=false;
        //     // }

        //     if (isMove) {
        //         this.attr({
        //              position: [pos[0] + dx, pos[1] + dy]
        //         });
        //         this.editor.moveNode(dx, dy, allItems);
        //         this.__zr.trigger('moveGroup', { group: this });
        //         isMove = false;
        //         // this.create();
        //         // this.refreshEdge();
        //         // this.anch.refresh();
        //          this.anch.show();
        //         // if(this.editor.cover.ignore){
        //         this.editor.cover.hide();
        //         // }
        //     }

        //     if(toString.call(allItems)=='[object Array]'){
        //         allItems.forEach(item => {
        //             if(item.create){
        //                 item.create();
        //             }
        //             item.createAnchors();
        //             item.anch && item.anch.refresh();
        //         });
        //         allItems=null;
        //     }

        // });

        this.on('dblclick', function () {
            if (this.showHead) {
                this.__zr.trigger('edit', {
                    status: 'editGroup',
                    group: this,
                    text:this.headStyle.text
                });
            }
        });

        this.groupRect.on('dragenter', function (e) {

            var node = e.topTarget;
            if (node && node.nodeType != 'node') {
                return;
            }
            if (that.nodes.indexOf(node) == -1) {
                this.setStyle('stroke', 'red');
                node.addToNodeGroup = true;
            } else {
                if (node.groupTime) {
                    node.groupTime = null;
                    node.leaveGroup = false;
                    if (node.groupTimeout) {
                        clearTimeout(node.groupTimeout);
                        node.groupTimeout = null;
                    }
                }
                node.addToNodeGroup = false;
            }

        }).on('dragleave', function (e) {

            var node = e.topTarget;
            if (node && node.nodeType != 'node') {
                return;
            }

            if (that.nodes.indexOf(node) > -1) {

                //锁定状态
                if(that.locked){
                    this.setStyle('stroke', 'red');
                    node.groupTime = +new Date();
                    node.leaveGroup = true;
                    node.groupTimeout = setTimeout(function () {
                        that.groupRect.setStyle('stroke', '#ccc');
                        clearTimeout(node.groupTimeout);
                        node.groupTimeout = null;
                        node.groupTime = null;
                        node.leaveGroup = true;
                        that.refresh();
                    }, 50);
                }else{   
                    this.setStyle('stroke', 'red');
                    node.groupTime = +new Date();
                    node.leaveGroup = true;
                    node.groupTimeout = setTimeout(function () {
                        that.viewTemGroup('down', node);
                        clearTimeout(node.groupTimeout);
                        node.groupTimeout = null;
                        node.groupTime = null;
                        node.leaveGroup = true;
                    }, 1500);
                }
            } else {
                this.setStyle('stroke', that.stroke);
                if (node) {
                    node.addToNodeGroup = false;
                    node.leaveGroup = false;
                }
            }
        }).on('drop', function (e) {
            var node = e.topTarget;
            if (node) {
                if (node.nodeType != 'node') {
                    return;
                }
                if (that.nodes.indexOf(node) == -1) {
                    node.addToNodeGroup = false;
                    this.__zr.trigger('addNodeToGroup', { node, group: that });
                    this.setStyle('stroke', that.stroke);
                    node.leaveGroup = false
                }
            }
        });

        var  mouseUp=()=>{
            if (drag) {
                this.dragging=false;
                drag = false;

                if (isMove) {
                    this.attr({
                        position: [pos[0] + dx, pos[1] + dy]
                    });
                    this.editor.moveNode(dx, dy, allItems);
                    this.__zr.trigger('moveGroup', { group: this });
                    isMove = false;
                    this.create();
                    this.createAnchors();
                    this.refreshEdge();
                    this.anch.refresh();
                    this.anch.show();
                    this.editor.cover.hide();
                }

                allItems.forEach(item => {
                    if(item.create){
                        item.create();
                    }
                    item.createAnchors();
                    item.anch && item.anch.refresh();
                });
            }

            document.removeEventListener('mousemove',mouseMove);
            document.removeEventListener('mouseup',mouseUp);
        }

        document.addEventListener('mouseup', mouseUp);

        this.lockImageItem.on('click',()=>{
            this.toggleLock();
        });
    }
}

export default NodeGroup;