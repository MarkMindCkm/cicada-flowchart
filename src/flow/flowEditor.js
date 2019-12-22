import zrender from 'zrender';
import Stack from './stack';
import shape from './shape';
import * as cmd from './cmd';
import Frame from './frame';
import RelateLink from './relateLink';
import NodeGroup from './nodeGroup';


class FlowEditor extends zrender.Group {

    constructor(el, data) {
        super();
        this.zr = zrender.init(document.getElementById(el),{
            renderer:'canvas'
        });
       
        this.id=this.uuid();
        this.data = data || {};
        this.stack = new Stack(this.data.stackStep || 50);

        //window.editor=this;

        this.nodes = [];
        this.edges = [];
        this.groups = [];

        this.status = '';

        
        this.frame = new Frame(this);
        this.frame.addTo(this);
        
        //框选
        this.selectFrame = new zrender.Rect({
            style: {
                fill: '#1890ff',
                opacity: 0.1
            },
            shape: {
                x: 0,
                y: 0,
                width: 0,
                heigt: 0
            },
            z: 10000
        });

      
        this.zr.add(this.selectFrame);
        this.selectFrame.hide();

        this.zr.add(this);


        //拖动group 或 多个节点的浮层

        this.cover=new zrender.Rect({
            style:{
                fill:'rgb(231, 247, 254)',
                stroke:'rgb(178, 222, 254)',
                opacity:0.6
            },
            shape:{
                width:0,
                height:0
            },
            z:100000
        });

        this.cover.hide();
        this.add(this.cover);

        this.commandChange();
        this.initEvent();
    }

    init(initData,isShow){
       this.nodes=[];
       this.edges=[];
       this.groups=[];
       this.removeAll();
       this.add(this.cover);
       this.frame.addTo(this);
       this.attr({
           position:[0,0]
       });
       
      if(initData&&initData.type&&initData.type=='cicadaFlow'){
            this.initData=initData;
            let {node,group,edge}=initData;
     
            node.forEach(data=>{
                 var s= shape.getShape(data.command,data,isShow);
                 s.setData(data);
                 if(!isShow){
                     s.createAnchors();
                     s.anch.refresh();
                 }
                 this.addNode(s);
            });
     
            group.forEach(item=>{
                //  data.forEach(item=>{
                     var nodes=[];
                     item.nodes.forEach(nodeData=>{
                         nodes.push(this.getNodeById(nodeData.node));
                     });
                     var g = new NodeGroup(nodes);
                     g.setHeadStyle(item.headStyle);
                     g.setGroupStyle(item.groupStyle);
                     g.setId(item.id);
                     g.changeHead(item.showHead);
                     if(item.locked){
                         g.setBox(item.box);
                         g.toggleLock();
                     }
                     this.addGroup(g);
                  //});
            });
     
            group.forEach(item=>{
               //  data.forEach(item=>{
                    if(item.topGroup){
                        var tg=this.getGroupById(item.topGroup);
                        var g=this.getGroupById(item.id);
                        g.topGroup=tg;
                        tg.nodes.push(g);
                        tg.refresh();
                    }
               //  });
            });
     
            edge.forEach(data=>{
                    var e=new RelateLink();
                    e.setData(data);
                    if(data.fromNode){
                       var fromNode=this.getItemById(data.fromNode);
                       let anch=fromNode.getAnchByIndex(data.fromAnch);
                       e.setFromNode(fromNode);
                       e.setFromAnch(anch);
                    }
                    if(data.endNode){
                        var toNode=this.getItemById(data.endNode);
                        let anch=toNode.getAnchByIndex(data.toAnch);
                        e.setToNode(toNode);
                        e.setToAnch(anch);
                    }
                   
                    this.addEdge(e);
            });
        }else{
            throw new Error('不支持的数据');
        }
    }

    clearHistory(){
        this.stack.clear();
    }

    getItemById(id){
        var items=this.nodes.concat(this.groups);
       return items.filter(n=>n.getId()==id)[0];
    }

    getNodeById(id){
        return this.nodes.filter(n=>n.getId()==id)[0];
    }

    getGroupById(id){
        return this.groups.filter(n=>n.getId()==id)[0];
    }

    getEdgeById(id){
        return this.edges.filter(n=>n.getId()==id)[0];
    }
   
    parseSvg(){

    }

    addShape(shape) {
        this.execute('addShape', shape);
    }

    execute(name, data, nodes) {
        var cmds = [], manycmds;
        switch (name) {
            case 'addShape':
                data.x=data.x-this.position[0];
                data.y=data.y-this.position[1];
                try{
                    if(data.image){
                        data.command="image";
                       // data.style=data;
                    //    window.console.log(data);
                    }
                    var node = shape.getShape(data.command, data);
                    this.stack.execute(new cmd.AddNodes([node], this));
                }catch(e){
                    window.console.log(e);
                }
                break;
            case 'moveNode':
                if (nodes.length) {

                    nodes.forEach(item => {
                        if(item.nodeType=='node'){
                            var oldPos = item.oldPos.slice();
                            var newPos = item.position.slice();
                            var movePosCmd = new cmd.MovePosCmd(item, oldPos, newPos);
                            cmds.push(movePosCmd);
                        }
                    });

                 //  this.refreshFullEdge();

                   if(cmds.length){ 
                        manycmds = new cmd.ManyCmd(cmds);
                        this.stack.execute(manycmds);
                   }

                }
                break;
            case 'addEdge':
                var edge = data.edge;
                this.stack.execute(new cmd.AddEdgeCmd(edge, this));
                break;
            case 'createGroup':
                this.stack.execute(new cmd.CreateGroup(data.group,data.topGroup, this));
                break;
            case 'cancelGroup':
                this.stack.execute(new cmd.CancelGroup(data.group, this.zr));
                break;
            case 'removeNodeFromGroup':
                this.stack.execute(new cmd.RemoveNodeFromGroup(data.node));
                break;
            case 'addNodeToGroup':
                this.stack.execute(new cmd.AddNodeToGroup(data.node, data.group));
                break;
            case 'changeNode':
                if (nodes.length) {
                    nodes.forEach(item => {
                        var oldData = item.getData();
                        var d = zrender.util.clone(oldData);
                        if (data.style) {
                            d.style = { ...d.style, ...data.style };
                        }
                        if (data.shape) {
                            d.shape = { ...d.shape, ...data.shape };
                        }
                        if (data.hasOwnProperty('z')) {
                            d.z = parseInt(data.z);
                        }

                        var c = new cmd.ChangeNode(item, oldData, d);
                        cmds.push(c);

                    });
                    manycmds = new cmd.ManyCmd(cmds);
                    this.stack.execute(manycmds);
                }
                break;
            case 'resizeNode':
                var n = this.getSelectNodes()[0];
                var d = n.getData();
                var c = new cmd.ChangeNode(n, data.oldData, d);
                this.stack.execute(c);
                break;
            case 'changeGroup':
                var oldData, newData;
                var mark = data.mark;
                var group = data.group;
                var style = data.style;
                if (mark == 'head') {
                    oldData = { ...group.getHeadStyle() };
                    newData = { ...oldData, ...style };
                    this.stack.execute(new cmd.ChangeGroup(group, oldData, newData, mark));
                } else if (mark == 'group') {
                    oldData = { ...group.getGroupStyle() };
                    newData = { ...oldData, ...style };
                    this.stack.execute(new cmd.ChangeGroup(group, oldData, newData, mark));
                } else {
                    this.stack.execute(new cmd.ChangeGroupHead(group, data.showHead));
                }
                break;
            case 'deleteNode':
                this.stack.execute(new cmd.RemoveNodes([data.node], this));
                break;
            case 'deleteNodes':
                this.stack.execute(new cmd.RemoveNodes(data.nodes, this));
                break;
            case 'deleteGroup':
                this.stack.execute(new cmd.RemoveGroup(data.group, this));
                break;
            case 'deleteEdge':
               // window.console.log(data.edge);
                this.stack.execute(new cmd.RemoveEdgeCmd(data.edge, this));
                break;
            case 'changeEdge':
                var type=data.type;
                if(type=='changeAnch'){
                    if(data.mark=='anch'){
                        this.stack.execute(new cmd.ChangeEdgeAnch(data.edge,data));
                    }
                    else if(data.mark=='point'){
                        this.stack.execute(new cmd.ChangeEdgeAnch(data.edge,data));
                    }
                }else{
                    if(data.mark=='text'){
                        var oldText=data.edge.getText();
                        var newText=data.style.text;
                        this.stack.execute(new cmd.ChangeEdgeText(data.edge,oldText,newText))
                    }else{
                        var od, nd;
                        od = data.edge.getData();
                        nd = { ...od, ...data.style };
                        this.stack.execute(new cmd.ChangeEdge(data.edge, od, nd));
                    }
                }

                break;
            case 'ungroup':
                var g = data.group;
                if (g) {
                    this.stack.execute(new cmd.CancelGroup(g, this));
                }
                break;
        }
    }

    undo() {
        this.stack.undo();
    }

    redo() {
        this.stack.redo();
    }

    commandChange() {
        this.stack.change = () => {
           this.refreshHistory();
        }
    }


    refreshFullEdge(){
        if(this.fullSelectEdges.length){
            this.fullSelectEdges.forEach(e=>{
                var oldPos =  e.oldPos?e.oldPos.slice():e.position.slice();
                var newPos = e.position.slice();
                var dx=newPos[0]-oldPos[0];
                var dy=newPos[1]-oldPos[1];
                var cpx = zrender.util.clone(e.oldCpx);

                cpx.x1 = cpx.x1 + dx;
                cpx.x2 = cpx.x2 + dx;
                cpx.y1 = cpx.y1 + dy;
                cpx.y2 = cpx.y2 + dy;

                cpx.cpx1 = parseFloat(cpx.cpx1) + dx;
                cpx.cpy1 = parseFloat(cpx.cpy1) + dy;
                cpx.cpx2 = parseFloat(cpx.cpx2) + dx;
                cpx.cpy2 = parseFloat(cpx.cpy2) + dy;

                if(e.type=='polyline'){
                    var points=cpx.points;
                    points.forEach(p=>{
                        p[0]=p[0]+dx;
                        p[1]=p[1]+dy;
                    });
                    cpx.points=points;
                    var c=cpx.lineCenter.slice();
                    cpx.lineCenter[0]=c[0]+dx;
                    cpx.lineCenter[1]=c[1]+dy;
                }

                e.setCpx(cpx);
                e.refresh();
                e.setPosition(0,0);

            });
        }
    }

    refreshHistory(){
        this.zr.trigger('undoredo', { undo: !!this.stack.canUndo(), redo: !!this.stack.canRedo() });
    }

    uuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        function guid() {
            return S4() + S4() + S4() + S4();
        }
        return guid();
    }

    getData(){
        var node=this.nodes.map(n=>n.getData());
        var group=this.groups.map(n=>n.getData());
        var edge=this.edges.map(n=>n.getData());
        return {
            id:this.id,
            type:'cicadaFlow',
            node,
            group,
            edge
        }
    }

    copy(mark, item) {
        var nodes = [], cmds = [];
        if (mark == 'node') {
            item.forEach(n => {
                let pos = n.position.slice();
                let data = zrender.util.clone(n.getData());
                data.id = this.uuid();
                let node = shape.getShape(data.command, data,false);
                nodes.push(node);
                // node.setData(data);
                node.attr({
                    position: [pos[0] + 20, pos[1] + 20]
                });
                node.createAnchors();
                node.anch.refresh();
            });
            if (nodes.length) {
                let c = new cmd.AddNodes(nodes, this);
                this.stack.execute(c);
            }
        } else if (mark == 'group') {
            //let gpos=item.position.slice();
            let gdata = zrender.util.clone(item.getData());
            item.nodes.forEach(n => {
                if(n.nodeType=='node'){
                    let pos = n.position.slice();
                    let data = zrender.util.clone(n.getData());
                    data.id = this.uuid();
                    let node = shape.getShape(data.command, data,false);
                    nodes.push(node);
                    //node.setData(data);
                    node.attr({
                        position: [pos[0] + 20, pos[1] + 20]
                    });
                    node.createAnchors();
                     node.anch.refresh();
                }
            });

            let group = new NodeGroup(nodes);

            group.editor = this;
            group.setGroupStyle(gdata.groupStyle);
            group.setHeadStyle(gdata.headStyle);
            group.changeHead(gdata.showHead);

            var cg = new cmd.CreateGroup(group, null,this);
            let c = new cmd.AddNodes(nodes, this);
            cmds.push(cg);
            cmds.push(c);

            this.stack.execute(new cmd.ManyCmd(cmds));
        }
    }

    selectItem(n) {
        this.clearSelectItems();
        n.active();
        //window.console.log(111);
        var group = new zrender.Group();
        var box = group.getBoundingRect([n]);
        this.frame.boxSelect(box, n);
        this.frame.refreshBar();
        this.frame.show();
    }

    selectItems(items) {
        this.clearSelectItems();
        var group = new zrender.Group();
        items.forEach(item => {
            item.selected = true;
            group.add(item);
        });
        var box = group.getBoundingRect(items);
        this.frame.boxSelect(box, items);
    }

    getSelectItems() {
        return this.nodes.filter(item => item.selected).concat(this.edges.filter(item => item.selected));
    }

    getSelectNodes() {
        return this.nodes.filter(item => item.selected||item.dragging);
    }

    getSelectEdges() {
        return this.edges.filter(item => item.selected);
    }

    getEdgesByNode(node) {
        var e = [];
        this.edges.forEach(edge => { 
            if (edge.fromNode == node || edge.toNode == node) {
                if(e.indexOf(edge)==-1){
                    e.push(edge);
                }
            }
        });
        return e;
    }

    clearSelectItems() {
       // this.status='';
        this.nodes.forEach(n => {
            n.unactive();
        });
        this.edges.forEach(n => {
            n.unactive()
        });
        this.groups.forEach(g => g.selected = false);
        this.frame.hide();
    }

    addNode(node) {
        this.nodes.push(node);
        this.add(node);
        node.anch && node.anch.bars.forEach(bar => {
            this.add(bar);
        });
    }

    addEdge(edge) {
        if(this.edges.indexOf(edge)==-1){
            this.edges.push(edge);
            this.add(edge);
            edge.editor=this;
        }
    }

    removeEdge(edge) {
        var i = this.edges.indexOf(edge);
        if (i > -1) {
            this.remove(edge);
            this.edges.splice(i, 1);
        }
    }

    removeNode(node) {
        var i = this.nodes.indexOf(node);
        if (i > -1) {
            this.nodes.splice(i, 1);
            node.anch && node.anch.bars.forEach(bar => {
                this.remove(bar);
            });
            this.remove(node);
        }
    }

    getAllEdgesByGroup(group) {
        if (group) {
            var edges = this.getEdgesByGroup(group);
            var nodes = group.nodes;
            nodes.forEach(n => {
                var es = this.getEdgesByNode(n);
                es.forEach(e => {
                    if (edges.indexOf(e) == -1) {
                        edges.push(e);
                    }
                })
            });
            return edges;
        } else {
            return [];
        }

    }

    showAllAnch() {
        if (!this.hasShowAllAnch) {
            this.nodes.forEach(n => {
                n.time && clearTimeout(n.time);
                n.anch.show();
            });
            this.groups.forEach(n => {
                n.time && clearTimeout(n.time);
                n.anch.show();
            });
            this.hasShowAllAnch = true;
        }
    }

    hideAllAnch() {
        this.nodes.forEach(n => {
            n.anch.hide();
        });
        this.hasShowAllAnch = false;
    }

    getEdgesByGroup(group) {
        var e = [];
        this.edges.forEach(edge => {
            if (edge.fromNode == group || edge.toNode == group) {
                if(e.indexOf(edge)==-1){
                    e.push(edge)
                }
            }
        });
        return e;
    }

    multipleSelect() {

        var box = this.selectFrame.getBoundingRect();
        var group = new zrender.Group();
        var pos=this.position.slice();
        this.nodes.forEach(n => {
            var b = group.getBoundingRect([n]);
            b.x=b.x+pos[0];
            b.y=b.y+pos[1];
            if (box.intersect(b)) {
                n.active();
            } else {
                n.unactive();
            }
        });

    }

    multipleSelectEdges(nodes) {

        this.selectGroups = [];
        this.fullSelectEdges = [];
        this.notFullSelectEdges = [];

        var activeItem = nodes || this.getSelectNodes();

        var edges = [];
        var fulledges = [];

        activeItem.forEach(n => {

            if (n.nodeType == 'node') {

                if (n.nodeGroup) {
                    if (this.selectGroups.indexOf(n.nodeGroup) == -1) {
                        this.selectGroups.push(n.nodeGroup);
                    }
                }

                let es = this.getEdgesByNode(n);

                es.forEach(e => {
                    if (activeItem.indexOf(e.fromNode) > -1 && activeItem.indexOf(e.toNode) > -1) {
                        if (fulledges.indexOf(e) == -1) {
                            fulledges.push(e);
                            e.oldCpx = { ...{}, ...e.getCpx() };
                            e.oldPos=e.position.slice();
                        }
                    } else {

                        if (edges.indexOf(e) == -1) {
                            edges.push(e);
                            e.oldCpx = { ...{}, ...e.getCpx() };
                            e.oldPos=e.position.slice();
                        }
                        
                    }
                });

            } else if (n.nodeType == 'group') {

                let es = this.getEdgesByGroup(n);
                es.forEach(e => {
                    if (activeItem.indexOf(e.fromNode) > -1 && activeItem.indexOf(e.toNode) > -1) {
                        if (fulledges.indexOf(e) == -1) {
                            fulledges.push(e);
                            e.oldCpx = { ...{}, ...e.getCpx() };
                            e.oldPos=e.position.slice();
                        }
                    } else {
                        if (edges.indexOf(e) == -1) {
                            edges.push(e);
                            e.oldCpx = { ...{}, ...e.getCpx() };
                            e.oldPos=e.position.slice();
                        }
                    }
                });
            }
        });

        this.fullSelectEdges = fulledges;
        this.notFullSelectEdges = edges;

    }

    moveNode(dx, dy, nodes) {

        var activeItem = nodes || this.getSelectNodes();

        activeItem.forEach(n => {
                var p = n.oldPos;
                n.attr({
                    position: [p[0] + dx, p[1] + dy]
                });
                this.moveEdge(dx, dy, n);
        });

    }

    moveRefreshEdge(){
        this.fullSelectEdges.forEach(edge=>{
            edge.refresh();
        });
        this.notFullSelectEdges.forEach(edge=>{
            edge.refresh();
        })
    }

    viewProGroup() {

        //判断悬停时间
        var activeItem = this.getSelectNodes();
        activeItem.forEach(node => {
            if (node.nodeGroup) {
                if (node.groupTime && node.groupEndTime) {
                    if (node.groupEndTime - node.groupTime > 1000) {
                        node.nodeGroup.viewTemGroup('down', node);
                    }
                }
            } else {
                if (node.groupTime && node.groupEndTime && node.temporaryGroup) {
                    if (node.groupEndTime - node.groupTime > 1000) {
                        node.temporaryGroup.viewTemGroup('up', node);
                    }
                }
            }
        });

    }

    dropProGroup() {

        //判断悬停时间
        var activeItem = this.getSelectNodes();
        activeItem.forEach(node => {
            if (node.nodeGroup) {
                if (node.groupTime && node.groupEndTime) {
                    if (node.groupEndTime - node.groupTime > 1000) {
                        node.nodeGroup.removeNode(node);
                    }
                }
            } else {
                if (node.groupTime && node.groupEndTime && node.temporaryGroup) {
                    if (node.groupEndTime - node.groupTime > 1000) {
                        node.temporaryGroup.addNode(node);
                    }
                }
            }
        });

    }

    moveEdge(dx, dy, n) {
     
        this.fullSelectEdges.forEach(e => {
            var cpx = zrender.util.clone(e.oldCpx);
            cpx.x1 = cpx.x1 + dx;
            cpx.x2 = cpx.x2 + dx;
            cpx.y1 = cpx.y1 + dy;
            cpx.y2 = cpx.y2 + dy;
            cpx.cpx1 = cpx.cpx1 + dx;
            cpx.cpy1 = cpx.cpy1 + dy;
            cpx.cpx2 = cpx.cpx2 + dx;
            cpx.cpy2 = cpx.cpy2 + dy;
            if(e.type=='polyline'){
                var points=cpx.points;
                points.forEach(p=>{
                    p[0]=p[0]+dx;
                    p[1]=p[1]+dy;
                });
                cpx.points=points;
                var c=cpx.lineCenter.slice();
                cpx.lineCenter[0]=c[0]+dx;
                cpx.lineCenter[1]=c[1]+dy;
            }
            e.setCpx(cpx);
            e.refresh();
            
        });

        this.notFullSelectEdges.forEach(e => {
            if(n.nodeType=='group'){
               n.create(); 
            }
            n.createAnchors();
            if(e.fromNode == n) {
               e.setFromPoint(n.getAnchorByIndex(e.fromAnch.point.index));
               e.refresh();
            } else if(e.toNode==n){
                e.setToPoint(n.getAnchorByIndex(e.toAnch.point.index));
                e.refresh();
            }
            
        });


    }

    updateNodeAnch() {
        var activeItem = this.getSelectNodes();
        activeItem.forEach(n => {
            n.createAnchors();
            n.anch && n.anch.refresh();
        });
    }

    setShadow(){
        this.nodes.forEach(n=>n.setShadow());
        this.groups.forEach(n=>n.setShadow());
        this.edges.forEach(n=>n.setShadow());
    }
    cancelShadow(){
        this.nodes.forEach(n=>n.cancelShadow());
        this.groups.forEach(n=>n.cancelShadow());
        this.edges.forEach(n=>n.cancelShadow());
    }

    //左对齐
    leftAlign() {
        var groups = [];
        var activeItem = this.getSelectNodes();
        if (activeItem.length > 1) {
            var g = new zrender.Group();
            var box = g.getBoundingRect(activeItem);
            activeItem.forEach(item => {
                item.oldPos = item.position.slice();
                var itemBox = g.getBoundingRect([item]);
                var dx = box.x - itemBox.x;
                var p = item.position.slice();
                p[0] = p[0] + parseInt(dx);
                item.attr({
                    position: p.slice()
                });
                item.refreshEdge();
                if (item.nodeGroup) {
                    if (groups.indexOf(item.nodeGroup) == -1) {
                        groups.push(item.nodeGroup);
                    }
                }
            });

            //记录命令
            this.execute('moveNode', {}, activeItem);
            groups.forEach(g => {
                g.refresh();
            });
        }
    }

    rightAlign() {
        var groups = [];
        var activeItem = this.getSelectNodes();
        if (activeItem.length > 1) {
            var g = new zrender.Group();
            var box = g.getBoundingRect(activeItem);

            activeItem.forEach(item => {
                item.oldPos = item.position.slice();
                var itemBox = g.getBoundingRect([item]);
                var dx = box.x + box.width - itemBox.x - itemBox.width;
                var p = item.position.slice();
                p[0] = p[0] + parseInt(dx);
                item.attr({
                    position: p.slice()
                });
                item.refreshEdge();
                if (item.nodeGroup) {
                    if (groups.indexOf(item.nodeGroup) == -1) {
                        groups.push(item.nodeGroup);
                    }
                }
            });
            //记录命令
            this.execute('moveNode', {}, activeItem);
            groups.forEach(g => {
                g.refresh();
            });
        }
    }

    verticalAlign() {
        var groups = [];
        var activeItem = this.getSelectNodes();
        if (activeItem.length > 1) {
            var g = new zrender.Group();
            var box = g.getBoundingRect([activeItem[0]]);
            var centerX = box.x + box.width / 2;

            activeItem.forEach(item => {
                item.oldPos = item.position.slice();
                if (item != activeItem[0]) {
                    var itemBox = g.getBoundingRect([item]);
                    var cx = itemBox.x + itemBox.width / 2;
                    var dx = centerX - cx;
                    
                    var p = item.position.slice();
                    p[0] = p[0] + parseInt(dx);
                    item.attr({
                        position: p.slice()
                    });
                }
                item.refreshEdge();
                if (item.nodeGroup) {
                    if (groups.indexOf(item.nodeGroup) == -1) {
                        groups.push(item.nodeGroup);
                    }
                }
            });

            //记录命令
            this.execute('moveNode', {}, activeItem);
            groups.forEach(g => {
                g.refresh();
            });
        }
    }

    horizontalAlign() {
        var groups = [];
        var activeItem = this.getSelectNodes();
        if (activeItem.length > 1) {
            var g = new zrender.Group();
            var box = g.getBoundingRect([activeItem[0]]);
            var centerY = box.y + box.height / 2;

            activeItem.forEach(item => {
                item.oldPos = item.position.slice();
                if (item != activeItem[0]) {
                    var itemBox = g.getBoundingRect([item]);
                    var cy = itemBox.y + itemBox.height / 2;
                    var dy = centerY - cy;
                    var p = item.position.slice();
                    p[1] = p[1] + parseInt(dy);
                    item.attr({
                        position: p.slice()
                    });
                }
                item.refreshEdge();
                if (item.nodeGroup) {
                    if (groups.indexOf(item.nodeGroup) == -1) {
                        groups.push(item.nodeGroup);
                    }
                }
            });

            //记录命令
            this.execute('moveNode', {}, activeItem);
            groups.forEach(g => {
                g.refresh();
            });
        }
    }

    createGroup() {

        var activeItem = this.getSelectNodes();
        var nodeGroup;
        if (activeItem.length > 1) {
            var flag = activeItem.every(item => !item.nodeGroup);
            if (flag) {
                nodeGroup = new NodeGroup(activeItem);
                nodeGroup.editor = this;
                this.execute('createGroup', { group: nodeGroup });
            }else{
                var isFlag=activeItem.every(item=>item.nodeGroup);
                if(isFlag){

                    var group=activeItem[0].nodeGroup;
                    var sameFlagGroup=activeItem.every(n=>n.nodeGroup==group);

                    if(sameFlagGroup){
                        var z=group.getLevel();
                        nodeGroup = new NodeGroup(activeItem,'新建分组', '#fafafa','#ccc','#333','dash',(z+1));
                        nodeGroup.editor = this;
                        nodeGroup.topGroup=group;
                        this.execute('createGroup', { group: nodeGroup,topGroup:group });
                    }

                }
            }
        }
    }

    listen(name, fn) {
        this.zr.on(name, fn);
    }

    removeListen(name, fn) {
        this.zr.off(name, fn);
    }

    emit(name, data) {
        this.zr.trigger(name, data);
    }

    addGroup(group) {
        if(this.groups.indexOf(group)==-1){
            this.add(group);
            group.anch.bars.forEach(bar => {
                this.add(bar);
            });
            this.groups.push(group);
            group.editor = this;
        }
    }

    removeGroup(group) {
        var index = this.groups.indexOf(group);
        if (index > -1) {
            this.groups.splice(index, 1);
            this.remove(group);
            group.anch.bars.forEach(bar => {
                this.remove(bar);
            });
        }
    }

    refreshGroup() {
        this.groups.forEach(group => {
            group.refresh();
        })
    }

    showAnch(x,y){
        if(this.status=='selectEdge'||this.status=='selectFrame'){
            return;
        }
        var g=new zrender.Group();
        var pos=this.position.slice();
        var num=0;
        if(this.status=='isCreateLink'||this.status=='changeEdge'){
            num=30;
        }
        var items=this.nodes.concat(this.groups);
        items.forEach(n=>{
            if(n.dragging){
                n.anch&&n.anch.hide();
                return;
            }
            var box=g.getBoundingRect([n]);
            box.x=box.x+pos[0]-num;
            box.y=box.y+pos[1]-num;
            box.width=box.width+num*2;
            box.height=box.height+num*2;
            if(box.contain(x,y)){
                n.anch&&n.anch.show();
            }else{
                n.anch&&n.anch.hide();
            }
        });

    }
    offEvent(){
        this.zr.off();
    }
    initEvent() {
      //  var that=this;

        function throttle(method,context){
            clearTimeout(method.tId);
            method.tId=setTimeout(function(){
                method.call(context)
            },300);
        }

        window.onresize=()=>{
            throttle(()=>{
               var width=document.getElementById('flowEditor').offsetWidth;
               var height=document.getElementById('flowEditor').offsetHeight;
                this.zr.resize({
                    width,
                    height
                });
                window.console.log(width,height);
             });
        }

        // window.onresize=function(){
        //     //throttle(()=>{
        //         //var width=document.getElementById('flowEditor').offsetWidth;
        //        // var height=document.getElementById('flowEditor').offsetHeight;
        //         that.zr.resize({
        //             width:'auto',
        //             height:'auto'
        //         });
        //    //  });
        // };

        // document.addEventListener('keydown',(e)=>{
        //     //window.console.log(e);
        //     if(e.ctrlKey||e.metaKey){
        //         this.status='selectFrame';
        //     }
        // });

        this.zr.on('selectNode', (e) => {
            this.selectItem(e.node);
        });

        this.zr.on('clearSelectItems', () => {
            this.clearSelectItems();
        });

        this.zr.on('judgeWidthGroup', () => {
            this.judgeWidthGroup();
        });

        this.zr.on('viewProGroup', () => {
            this.viewProGroup();
        });

        this.zr.on('hideFrame', () => {
            this.frame.hide();
        });

        this.zr.on('selectFrame',()=>{
            this.status='selectFrame';
        });

        this.zr.on('moveGroup', (e) => {
            var group = e.group;
            this.execute('moveNode', { dx, dy }, group.getAllItems());
        });

        this.zr.on('refreshEdge', (e) => {
            var node = e.node,edges;
            if(node.nodeType=='node'){
               edges = this.getEdgesByNode(node);
            }else{
               edges = this.getEdgesByGroup(node);
            }
           
            edges.forEach(link => {
                if (link.fromNode == node) {
                    link.setFromPoint(node.getAnchorByIndex(link.fromAnch.point.index));
                    link.refresh();
                } else if(link.toNode==node) {
                    link.setToPoint(node.getAnchorByIndex(link.toAnch.point.index));
                    link.refresh();
                }
            });

        });


        this.zr.on('moveNode', (e) => {
            var n = e.node;
            var selectItem = this.getSelectNodes();
            if (n) {
                if (selectItem.indexOf(n) == -1) {
                    selectItem = selectItem.concat([n])
                }
            }
            this.execute('moveNode', { dx, dy }, selectItem);
        });

        this.zr.on('removeNodeFromGroup', (e) => {
            this.execute('removeNodeFromGroup', { node: e.node });
        });

        this.zr.on('addNodeToGroup', (e) => {
            this.execute('addNodeToGroup', e);
        });

        this.zr.on('resizeNode', (e) => {
            this.execute('resizeNode', e);
        });

        this.zr.on('refreshSelectGroup', () => {
            this.selectGroups.forEach(g => g.refresh());
        });

        var drag = false, startX = 0, startY = 0, isCreateLink = false, edge,changeEdge,circle,anch, dx = 0, dy = 0,pos=null;

        // var mouseDown=()=>{
        //     if(this.status=='selectFrame'){
        //         this.zr.trigger('clearSelectItems');
        //         this.selectFrame.attr({
        //             shape: {
        //                 x: startX,
        //                 y: startY
        //             }
        //         });
        //         this.selectFrame.show();
        //     }
        // };

        var mouseMove=()=>{
            
            if(this.status=='selectFrame'){
                this.selectFrame.attr({
                    shape: {
                        width: dx,
                        height: dy
                    }
                });
                this.multipleSelect();
            }
            else{
                this.attr({
                    position:[pos[0]+dx,pos[1]+dy]
                });
            }
        };

        var mouseUp=()=>{
            this.selectFrame.attr({
                shape: {
                    x: 0,
                    y: 0,
                    width: 0,
                    heigt: 0
                }
            });
            this.status='';
            this.selectFrame.hide();
            //document.removeEventListener('mousedown',mouseDown);
            document.removeEventListener('mousemove',mouseMove);
            document.removeEventListener('mouseup',mouseUp);
        };
        
        this.zr.on('mousedown', (e) => {
            startX = e.offsetX;
            startY = e.offsetY;
            drag = true;
            pos=this.position.slice();
            //框选
            if (!e.target) { 
               //document.addEventListener('mousedown',mouseDown);

               this.zr.trigger('clearSelectItems');
               
               if(this.status=='selectFrame'){
                 this.selectFrame.attr({
                    shape: {
                        x: startX,
                        y: startY
                    }
                 });
                 this.selectFrame.show();
               }

               document.addEventListener('mousemove',mouseMove);
               document.addEventListener('mouseup',mouseUp);
            }

            if (e.target) {
                //创建连线
                if (e.target.mark && e.target.mark == 'anch') {
                    if(isCreateLink){
                        if(edge){
                            this.remove(edge);
                            this.status='';
                            isCreateLink=false;
                            return;
                        }
                    }
                    anch = e.target;
                    this.status = 'isCreateLink';
                    isCreateLink = true;
                    edge = new RelateLink(anch.node);
                    edge.setFromPoint({ ...anch.point });
                    edge.fromAnch = anch;
                    this.add(edge);
                }

                var activeItem = this.getSelectNodes();
                activeItem.forEach(n => {
                    n.oldPos = n.position.slice();
                });

                if (e.target.nodeType == 'node') {
                    this.multipleSelectEdges();
                }

                if(e.target.edge){
                    this.status='changeEdge';
                    changeEdge=e.target.edge;
                    circle=e.target;
                }
            }
        });

        this.zr.on('mousemove', (e) => {
            dx = e.offsetX - startX;
            dy = e.offsetY - startY;
            this.showAnch(e.offsetX,e.offsetY);
               if (drag) {
                   if(isCreateLink||this.status=='changeEdge'){
                    if (isCreateLink) {
                        edge.move(e.offsetX-pos[0], e.offsetY-pos[1]);
                    }
                }

                if(this.status=='selectFrame'){
                      return;
                }
                
                if (!isCreateLink && e.target && e.target.nodeType == 'node') {
                        if(this.status=='resizeNode'||this.status=='changeEdge'){
                           return;
                        }
                        this.moveNode(dx, dy);
                        this.viewProGroup();
                    }

                    if(this.status=='changeEdge'&&changeEdge&&circle){
                        var oldcx=circle.oldCenter.x;
                        var oldcy=circle.oldCenter.y;
                        circle.attr({
                            shape:{
                                cx:oldcx+dx,
                                cy:oldcy+dy
                            }
                        });
                       
                        if(circle.edgeType=='from'){
                            changeEdge.setFromPoint({x:oldcx+dx,y:oldcy+dy},true);
                        }else{
                            changeEdge.setToPoint({x:oldcx+dx,y:oldcy+dy});
                        }
                  }
            }
        });

        this.zr.on('mouseup', (e) => {
            if (e.target && e.target.mark && e.target.mark == 'anch') {
                if (isCreateLink) {
                    if (e.target == anch) {
                        this.removeEdge(edge);
                        this.status = '';
                        return;
                    } else {
                        try{
                            edge.setToNode(e.target.node);
                            edge.setToPoint({ ...e.target.point });
                            edge.toAnch = e.target;
                            this.execute('addEdge', { edge });
                        }catch(e){
                            this.removeEdge(edge);
                            edge = null;
                            this.status = '';
                        }finally{
                            edge = null;
                            this.status = '';
                        }   
                    }
                }

                if(this.status=='changeEdge'){
                    //调整关联线段顶点 分为 无——>有，有——>无，无——>无,有——>有;
                    if(circle.edgeType=='from'){
                        if(changeEdge.fromNode){
                            if(changeEdge.fromAnch!=e.target){
                               let oldNode=changeEdge.fromNode;
                               let oldAnch=changeEdge.fromAnch;
                               this.execute('changeEdge',{
                                    edge:changeEdge,
                                    type:'changeAnch',
                                    position:'from',
                                    oldNode,
                                    oldAnch,
                                    newNode:e.target.node,
                                    newAnch:e.target,
                                    mark:'anch'
                              });
                            }
                        }else{
                            this.execute('changeEdge',{
                                 edge:changeEdge,
                                 type:'changeAnch',
                                 position:'from',
                                 oldCenter:{...circle.oldCenter},
                                 newCenter:{
                                     x:circle.shape.cx,
                                     y:circle.shape.cy
                                 },
                                 newNode:e.target.node,
                                 newAnch:e.target,
                                 mark:'point'
                           });
                        }
                    }else{
                        if(changeEdge.toNode){
                            if(changeEdge.toAnch!=e.target){
                                let oldNode=changeEdge.toNode;
                                let oldAnch=changeEdge.toAnch;
                               
                                this.execute('changeEdge',{
                                    edge:changeEdge,
                                    type:'changeAnch',
                                    position:'to',
                                    oldNode,
                                    oldAnch,
                                    newNode:e.target.node,
                                    newAnch:e.target,
                                    mark:'anch'
                                });
                             }
                        }else{
                            this.execute('changeEdge',{
                                edge:changeEdge,
                                type:'changeAnch',
                                position:'to',
                                oldCenter:{...circle.oldCenter},
                                newCenter:{
                                    x:circle.shape.cx,
                                    y:circle.shape.cy
                                },
                                newNode:e.target.node,
                                newAnch:e.target,
                                mark:'point'
                            });
                        }
                    }

                    changeEdge.refresh();
                    this.status='';
                    circle=null;
                    changeEdge=null;
                }
            }


            if(this.status=='changeEdge'){
                  if(circle.edgeType=='from'){
                      if(changeEdge.fromNode){
                          let oldNode=changeEdge.fromNode;
                          let oldAnch=changeEdge.fromAnch;
                          changeEdge.removeFromNode();
                          this.execute('changeEdge',{
                              edge:changeEdge,
                              type:'changeAnch',
                              position:'from',
                              oldNode,
                              oldAnch,
                              oldCenter:{...circle.oldCenter},
                              newCenter:{
                                x:circle.shape.cx,
                                y:circle.shape.cy
                              },
                              mark:'anch'
                          });
                      }else{
                        this.execute('changeEdge',{
                            edge:changeEdge,
                            type:'changeAnch',
                            position:'from',
                            oldCenter:{...circle.oldCenter},
                            newCenter:{
                                x:circle.shape.cx,
                                y:circle.shape.cy
                            },
                            mark:'point'
                        });
                      }
                  }else{
                    if(changeEdge.toNode){
                        if(changeEdge.toNode){
                            let oldNode=changeEdge.toNode;
                            let oldAnch=changeEdge.toAnch;
                            changeEdge.removeToNode();
                            this.execute('changeEdge',{
                                edge:changeEdge,
                                type:'changeAnch',
                                position:'to',
                                oldNode,
                                oldAnch,
                                oldCenter:{...circle.oldCenter},
                                newCenter:{
                                    x:circle.shape.cx,
                                    y:circle.shape.cy
                                },
                                mark:'anch'
                            });
                        }else{
                          this.execute('changeEdge',{
                              edge:changeEdge,
                              type:'changeAnch',
                              position:'to',
                              oldCenter:{...circle.oldCenter},
                              newCenter:{
                                  x:circle.shape.cx,
                                  y:circle.shape.cy
                              },
                              mark:'point'
                          });
                        }
                     }
                  }

                  this.status='';
                  circle=null;
                  changeEdge=null;

            }


            if (edge) {
                this.remove(edge);
            }

            if (this.selectFrame.ignore) {
                this.updateNodeAnch();
            } else {
                this.zr.trigger('selectNodes')
            }
         
            isCreateLink = false;
            drag = false;
            startX = 0;
            startY = 0;
        });

    }

}

export default FlowEditor;