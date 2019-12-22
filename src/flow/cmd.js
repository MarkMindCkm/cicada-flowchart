import Command from './command';

class AddNodes extends Command {
    constructor(nodes, editor) {
        super('addShape');
        this.nodes = nodes;
        this.editor = editor;
    }
    execute() {
        var that = this;
        this.nodes.forEach(item => {
            that.editor.addNode(item);
        });
    }
    undo() {
        var that = this;
        this.nodes.forEach(item => {
            that.editor.removeNode(item);
        });
    }
}

class RemoveNodes extends Command {
    constructor(nodes, editor) {
        super('RemoveShape');
        this.nodes = nodes;
        this.editor = editor;
        this.edges = this.getEdges();
    }
    getEdges() {
        var edges = [];
        this.nodes.forEach(item => {
            var edge = this.editor.getEdgesByNode(item);
            edge.forEach(e => {
                if (edges.indexOf(e) == -1) {
                    edges.push(e);
                }
            })
        });
        return edges;
    }
    execute() {
        this.edges.forEach(item => {
            this.editor.removeEdge(item);
        });
        this.nodes.forEach(item => {

            if (item.nodeGroup) {
                var g = item.nodeGroup;
                item.oldRemoveGroup = g;
                g.removeNode(item);
                g.refresh();
            }
            this.editor.removeNode(item);
        });
        this.editor.frame.hide();
    }

    undo() {
        this.edges.forEach(item => {
            this.editor.addEdge(item);
            this.editor.add(item);
        });
        this.nodes.forEach(item => {
            this.editor.addNode(item);
            if (item.oldRemoveGroup) {
                item.oldRemoveGroup.addNode(item);
                item.nodeGroup.refresh();
                item.oldRemoveGroup = null;
            }
        });
    }
}

class WaitRefreshEdge extends Command{
    constructor(edge){
        super();
        this.edge=edge;
    }
    execute(){
        this.edge.refresh();
    }
    undo(){
        this.edge.refresh();
    }
}

class MovePosCmd extends Command {
    constructor(item, oldPos, newPos) {
        super('movePos');
        this.item = item;
        this.oldPos = oldPos.slice();
        this.newPos = newPos.slice();
        this.isExec = true;
    }
    execute() {
        if (!this.isExec) {
            this.item.attr({
                position: this.newPos.slice()
            });
            this.isExec = true;
           // if(!this.item.nodeType=='edge'){
                this.item.refreshEdge();
            //}
        }
    }
    undo() {
        this.item.attr({
            position: this.oldPos.slice()
        });
        this.isExec = false;
       // if(!this.item.nodeType=='edge'){
            this.item.refreshEdge();
       // }
    }
    refreshGroup() {
        if(this.item.nodeType=='group'){
            this.item.refresh();
        }
        this.item.nodeGroup && this.item.nodeGroup.refresh();
    }
}

class ManyCmd extends Command {
    constructor(cmds) {
        super('manyCmd');
        this.cmds = cmds;
    }
    execute() {

        this.cmds.forEach(cmd => {
            cmd.execute();
            if(cmd.name=='movePos'){
                cmd.refreshEdge&&cmd.refreshEdge();
                cmd.refreshGroup();
            }
        });

        
    }
    undo() {
        this.cmds.forEach(cmd => {
            cmd.undo();
            if(cmd.name=='movePos'){
                cmd.refreshEdge&&cmd.refreshEdge();
                cmd.refreshGroup();
            }
        });
    }
}

class AddEdgeCmd extends Command {
    constructor(edge, editor) {
        super('addedge');
        this.edge = edge;
        this.editor = editor;
        //this.show = true;
    }
    execute() {
        //if (!this.show) {
            this.editor.addEdge(this.edge);
       // }
    }
    undo() {
        this.editor.removeEdge(this.edge);
     //   this.show = false;
    }
}

class RemoveEdgeCmd extends Command {
    constructor(edge, editor) {
        super('removeEdge');
        this.edge = edge;
        this.editor = editor;
    }
    execute() {
        this.editor.removeEdge(this.edge);
    }
    undo() {
        this.editor.addEdge(this.edge);
    }
}

class CreateGroup extends Command {

    constructor(group,topGroup,editor) {
        super('createGroup');
        this.group = group;
        this.topGroup = topGroup;
        this.editor = editor;
    }

    execute() {

        if(this.topGroup){
            this.topGroup.redoGroup();
            this.editor.addGroup(this.topGroup);
            this.topGroup.addNode(this.group);
            this.group.nodes.forEach(n=>{
                var ns=this.topGroup.nodes;
                var index=ns.indexOf(n);
                ns.splice(index,1);
            });
        }
        
      //  window.console.log(this.topGroup);

        this.editor.addGroup(this.group);
        this.group.redoGroup();
    }

    undo() {

        if(this.topGroup){
            this.topGroup.cancelGroup();
            this.editor.removeGroup(this.topGroup);
        }

        this.group.cancelGroup();
        this.editor.removeGroup(this.group);
    }

}

class CancelGroup extends Command {

    constructor(group, editor) {
        super('cancelGroup');
        this.group = group;
        this.editor = editor;
        this.topGroup = group.topGroup;
        this.edges=editor.getEdgesByGroup(group);
       // this.nodes=this.group.nodes.slice();
    }

    execute() {
        this.editor.removeGroup(this.group);

        if(this.topGroup){
            this.topGroup.removeNode(this.group);
        }

        this.group.nodes.forEach(n => {
            if(this.topGroup){
                if(n.nodeType=='group'){
                    n.topGroup = this.topGroup;
                }else{
                    n.nodeGroup = this.topGroup;
                }
                this.topGroup.addNode(n);
            }else{
                if(n.nodeType=='group'){
                    n.topGroup = null;
                }else{
                    n.nodeGroup = null;
                }
            }
        });

        this.edges.forEach(edge=>{
            this.editor.removeEdge(edge);
        });

        
    }

    undo() {
        this.editor.addGroup(this.group);
        this.group.topGroup=this.topGroup;
        this.group.nodes.forEach(n => {
            if(this.topGroup){
                this.topGroup.removeNode(n); 
            }
            if(n.nodeType=='group'){
                n.topGroup = this.group;
            }else{
                n.nodeGroup = this.group;
            }
        });

        if(this.topGroup){
            this.topGroup.addNode(this.group);
        }

        this.edges.forEach(edge=>{
            this.editor.addEdge(edge);
        });
    }

}

class RemoveNodeFromGroup extends Command {
    constructor(node) {
        super('removeNodeFromGroup');
        this.node = node;
        this.group = this.node.nodeGroup;
        this.oldPos = this.node.oldPos.slice();
        this.newPos = this.node.position.slice();
    }
    execute() {
        this.node.attr({
            position: [this.newPos[0], this.newPos[1]]
        });
        this.group.removeNode(this.node);
        this.node.refreshEdge();
    }
    undo() {
        this.node.attr({
            position: [this.oldPos[0], this.oldPos[1]]
        });
        this.group.addNode(this.node);
        this.node.refreshEdge();
    }
}
class AddNodeToGroup extends Command {
    constructor(node, group) {
        super('addNodeToGroup');
        this.node = node;
        this.oldGroup = node.nodeGroup;
        this.newGroup = group;
        this.oldPos = node.oldPos.slice();
        this.newPos = node.position.slice();
    }
    execute() {
        if (this.oldGroup) {
            this.oldGroup.removeNode(this.node);
            if (this.node.groupTimeout) {
                clearTimeout(this.node.groupTimeout);
                this.node.groupTimeout = null;
            }
        }

        this.node.attr({
            position: this.newPos.slice()
        });

        this.newGroup.addNode(this.node);
        this.node.refreshEdge();

    }

    undo() {
        this.newGroup.removeNode(this.node);
        if (this.oldGroup) {
            this.node.attr({
                position: this.oldPos.slice()
            });
            this.oldGroup.addNode(this.node);
        }
        this.node.attr({
            position: this.oldPos.slice()
        });
        this.node.refreshEdge();
    }
}
class ChangeNode extends Command {
    constructor(node, oldData, newData) {
        super('changeNode')
        this.node = node;
        this.oldData = oldData;
        this.newData = newData;
    }
    execute() {
        this.node.setData(this.newData);
        this.node.refresh();
    }
    undo() {
        this.node.setData(this.oldData);
        this.node.refresh();
    }
}

class ChangeGroup extends Command {
    constructor(group, oldData, newData, mark) {
        super('changeGroup');
        this.group = group;
        this.oldData = oldData;
        this.newData = newData;
        this.mark = mark;
    }
    execute() {
        if (this.mark == 'head') {
            this.group.setHeadStyle(this.newData);
        } else {
            this.group.setGroupStyle(this.newData);
        }
    }
    undo() {
        if (this.mark == 'head') {
            this.group.setHeadStyle(this.oldData);
        } else {
            this.group.setGroupStyle(this.oldData);
        }
    }
}

class RemoveGroup extends Command {
    constructor(group) {
        super('removeGroup');
        this.group = group;
        this.topGroup=this.group.topGroup;
        this.allItems=this.group.getAllItems();
        this.editor = this.group.editor;
        this.edges = this.getAllEdges();
       // this.zr = this.editor.zr;
    }

    getAllEdges(){
        var es=this.editor.getAllEdgesByGroup(this.group);
        this.allItems.forEach(n=>{
            if(n.nodeType=='node'){
                var edges=this.editor.getEdgesByNode(n);
                edges.forEach(e=>{
                    if(es.indexOf(e)==-1){
                       es.push(e);
                    }
                });
            }
        });
      
        return es;
    }
    execute() {
        this.group.editor.removeGroup(this.group);
        this.allItems.forEach(n => {
            if(n.nodeType=='node'){
                this.editor.removeNode(n);
            }else if(n.nodeType=='group'){
                this.editor.removeGroup(n);
            }
        });
        this.edges.forEach(edge => {
            this.editor.removeEdge(edge);
        });
        if(this.topGroup){
            this.topGroup.removeNode(this.group);
          //  this.group.topGroup=null;
        }
    }
    undo() {
        this.editor.addGroup(this.group);
        this.allItems.forEach(n => {
            if(n.nodeType=='node'){
                this.editor.addNode(n);
            }else if(n.nodeType=='group'){
                this.editor.addGroup(n);
            }
        });
        this.edges.forEach(edge => {
            this.editor.addEdge(edge);
            this.editor.add(edge);
        });
        this.group.refresh();
        if(this.topGroup){
            this.topGroup.addNode(this.group);
            this.group.topGroup=this.topGroup;
        }
    }
}
class ChangeGroupHead extends Command {
    constructor(group, showHead) {
        super('changeGroupHead');
        this.group = group;
        this.showHead = showHead;
    }
    execute() {
        this.group.changeHead(this.showHead);
    }
    undo() {
        this.group.changeHead(!this.showHead);
    }
}


class ChangeEdge extends Command {
    constructor(edge, oldData, newData) {
        super('changeEdge');
        this.edge = edge;
        this.oldData = oldData;
        this.newData = newData;
        this.edge.unactive();
    }
    execute() {
        this.edge.setData(this.newData);
    }
    undo() {
        this.edge.setData(this.oldData);
    }
}

class ChangeEdgeText extends Command{
    constructor(edge,oldText,newText){
        super('changeEdgeText');
        this.edge=edge;
        this.oldText=oldText;
        this.newText=newText;
    }
    execute(){
        this.edge.setText(this.newText);
    }
    undo(){
        this.edge.setText(this.oldText);
    }
}

class ChangeEdgeAnch extends Command {
    constructor(edge, data) {
        super('changeEdge');
        this.edge = edge;
        this.data=data;
        //this.exec=true;
        this.edge.unactive();
    }
    execute() {
        if(this.data.mark=='anch'){
           if(this.data.position=='from'){
               if(this.data.newCenter){
                   this.edge.setFromPoint({...this.data.newCenter},true);
               }
               if(this.data.newNode){
                   this.edge.setFromNode(this.data.newNode);
                   this.edge.setFromAnch(this.data.newAnch);
               }
           }else{
               if(this.data.newCenter){
                  this.edge.setToPoint({...this.data.newCenter},true);
               }
               if(this.data.newNode){
                   this.edge.setToNode(this.data.newNode);
                   this.edge.setToAnch(this.data.newAnch);
               }
           }
        }
        else if(this.data.mark=='point'){
            if(this.data.position=='from'){
              this.edge.setFromPoint({x:this.data.newCenter.x,y:this.data.newCenter.y},true);
              if(this.data.newNode){
                this.edge.setFromNode(this.data.newNode);
                this.edge.setFromAnch(this.data.newAnch);
              }
            }else{
              this.edge.setToPoint({x:this.data.newCenter.x,y:this.data.newCenter.y});
              if(this.data.newNode){
                this.edge.setToNode(this.data.newNode);
                this.edge.setToAnch(this.data.newAnch);
              }
            }
        }
        
    }
    undo() {
      //  window.console.log(this.data);
        if(this.data.mark=='anch'){
            if(this.data.position=='from'){
                if(this.data.oldCenter){
                    this.edge.setFromPoint({...this.data.oldCenter},true);
                }
                if(this.data.oldNode){
                    this.edge.setFromNode(this.data.oldNode);
                    this.edge.setFromAnch(this.data.oldAnch);
                }
               
            }else{
                if(this.data.oldCenter){
                    this.edge.setToPoint({...this.data.oldCenter},true);
                }
                if(this.data.oldNode){
                    this.edge.setToNode(this.data.oldNode);
                    this.edge.setToAnch(this.data.oldAnch);
                }
            }
         }
         else if(this.data.mark=='point'){
             if(this.data.position=='from'){
                 this.edge.setFromPoint({x:this.data.oldCenter.x,y:this.data.oldCenter.y},true);
                 if(this.data.newNode){
                     this.edge.removeFromNode();
                 }
             }else{
                 this.edge.setToPoint({x:this.data.oldCenter.x,y:this.data.oldCenter.y});
                 if(this.data.newNode){
                    this.edge.removeToNode();
                }
             }
         }
    }
}


export {
    AddNodes,
    RemoveNodes,
    MovePosCmd,
    ManyCmd,
    AddEdgeCmd,
    RemoveEdgeCmd,
    CreateGroup,
    CancelGroup,
    RemoveNodeFromGroup,
    AddNodeToGroup,
    ChangeNode,
    ChangeGroup,
    RemoveGroup,
    ChangeEdge,
    ChangeEdgeAnch,
    ChangeEdgeText,
    ChangeGroupHead,
    WaitRefreshEdge
}