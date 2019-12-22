<template>
  <div class="editor" @dragover="dragover" @dragstart="dragstart" @drop="drop">
        <div id="flowEditor"></div>
        <Edit class="text-editor" ref='edit' v-show="editModel" v-model="text" @blurFunc="updateText" :style="{left:left+'px',top:top+'px','min-width':width+'px','min-height':height+'px'}"></Edit>
        <div id="download-win" class="download-win">
             <div class="download-header">
                请右击下载
                <span @click.stop="closeDownLoadWin" class="iconfont icon-guanbi" style="float:right;color:red;margin-right:6px;"></span>
             </div>
            <div id="download-canvas"></div>
        </div>
  </div>
</template>

<script>
import flowEditor from '../flow/flowEditor';
import eventBus from '../eventbus';
import Edit from './plugin/edit';
import zrender from 'zrender';

import getPlainTxt from '../flow/ued/getPlainTxt';

export default {
  name: 'Editor',
  components:{
    Edit
  },
  data(){
     return{
        left:0,
        top:0,
        width:0,
        height:0,
        text:'',
        plainTxt:'',
        editModel:false,
        icon:[],
        colors:'#194d33',
        show:false,
        edge:null
     }
  },
  mounted(){
     var that=this;
     this.editor=new flowEditor('flowEditor');
     eventBus.$on('leftAlign',()=>{
       this.editor.leftAlign();
     });
     eventBus.$on('rightAlign',()=>{
       this.editor.rightAlign();
     });
     eventBus.$on('horizontalAlign',()=>{
       this.editor.horizontalAlign();
     });
     eventBus.$on('verticalAlign',()=>{
       this.editor.verticalAlign();
     });
      eventBus.$on('createGroup',()=>{
       this.editor.createGroup();
     });
     eventBus.$on('redo',()=>{
       this.editor.redo();
     });
     eventBus.$on('undo',()=>{
       this.editor.undo();
     });

     
     eventBus.$on('initFlow',(e)=>{
       try{
          this.editor.clearHistory();
          this.editor.refreshHistory();
          this.editor.init(e.data);
          eventBus.$emit('refreshMap',{editor:this.editor});
       }catch(e){
         window.console.log(e);
         alert('不支持的数据');
       }
     });

     eventBus.$on('copy',()=>{
        if(!this.editStatus){
            if(this.status=='selectNode'||this.status=='selectNodes'){
               this.editor.copy('node',this.editor.getSelectNodes());
            }else if(this.status=='selectGroup'){
               this.editor.copy('group',this.group);
            }
        }
     });

     eventBus.$on('delete',()=>{
        if(this.status=='selectNode'){
           this.editor.execute('deleteNode',{node:this.node});
        }else if(this.status=='selectNodes'){
           this.editor.execute('deleteNodes',{nodes:this.nodes});
        }else if(this.status=='selectGroup'){
           this.editor.execute('deleteGroup',{group:this.group});
        }else if(this.status=='selectEdge'){
           this.editor.execute('deleteEdge',{edge:this.edge});
        }
     });

     eventBus.$on('saveData',(e)=>{
         var box=null,editor=null;
         switch(e.type){
           case 'json':
             var str=JSON.stringify(this.editor.getData());
             downloadFile(str,'flowchart.json');
             break;
           case 'png':
                box=this.editor.getBoundingRect(this.editor.nodes.concat(this.editor.groups).concat(this.editor.edges));
                document.getElementById('download-canvas').style.width=box.width+'px';
                document.getElementById('download-canvas').style.height=box.height+'px';
                editor=new flowEditor('download-canvas');
                editor.init(JSON.parse(JSON.stringify(this.editor.getData())),true);
                editor.attr({
                  position:[-parseInt(box.x),-parseInt(box.y)]
                });

               try{
                  editor.zr.painter.getRenderedCanvas({
                     backgroundColor:"transparent"
                  }).toBlob((blob) => {
                    var url = window.URL.createObjectURL(blob);
                    window.console.log(url);
                    window.open(url);
                  }, 'image/png');
               }catch(e){
                   document.getElementById('download-win').style.display='block';
               }
             break;
           case 'jpg':
                box=this.editor.getBoundingRect(this.editor.nodes.concat(this.editor.groups).concat(this.editor.edges));
                document.getElementById('download-canvas').style.width=box.width+'px';
                document.getElementById('download-canvas').style.height=box.height+'px';
                editor=new flowEditor('download-canvas');
                editor.init(JSON.parse(JSON.stringify(this.editor.getData())),true);
                editor.attr({
                  position:[-box.x,-box.y]
                });

                try{
                    editor.zr.painter.getRenderedCanvas({
                        backgroundColor:"#fff"
                    }).toBlob((blob) => {
                        var url = window.URL.createObjectURL(blob);
                        window.open(url);
                    }, 'image/jpeg');
                 }catch(e){
                     document.getElementById('download-win').style.display='block';
                 }
             break;
         }
      });


      function downloadFile(content, filename) {
          var a = document.createElement('a')
          var blob = new Blob([content])
          var url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(url)
      }
     
      eventBus.$on('changeNode',(e)=>{
           var selectNodes=e.nodes||this.editor.getSelectNodes();
           this.editor.execute('changeNode',e,selectNodes);
      });

      eventBus.$on('align',(e)=>{
         this.editor[e.align]&&this.editor[e.align]();
      });

      eventBus.$on('changeGroup',(e)=>{
         this.editor.execute('changeGroup',e);
      });

      eventBus.$on('changeEdge',(e)=>{
         this.editor.execute('changeEdge',e);
      });

      eventBus.$on('ungroup',()=>{
        if(!this.editStatus){
           if(this.status=='selectGroup'){
             this.editor.execute('ungroup',{group:this.group});
           }
        }
     });

     eventBus.$on('selectFrame',()=>{
        this.editor.emit('selectFrame');
     });

     eventBus.$on('shadow',(e)=>{
         var shadow=e.shadow;
         if(shadow){
           this.editor.setShadow();
         }else{
           this.editor.cancelShadow();
         }
     });
      

     this.editor.listen('selectNode',(e)=>{
          that.status='selectNode';
          that.node=e.node;
          eventBus.$emit('selectNode',{node:e.node});
     });

     this.editor.listen('selectNodes',(e)=>{
            if(e&&e.nodes.length>1){
                that.status='selectNodes';
                that.nodes=e.nodes;
                eventBus.$emit('selectNodes',{nodes:e.nodes});
            }else{
                var selectNodes=this.editor.getSelectNodes();
                if(selectNodes.length==1){
                    that.status='selectNode';
                    that.node=selectNodes[0];
                    eventBus.$emit('selectNode',{node:selectNodes[0]});
                }else if(selectNodes.length>1){
                    that.status='selectNodes';
                    that.nodes=selectNodes;
                    eventBus.$emit('selectNodes',{nodes:selectNodes});
                }
            }
     });

     this.editor.listen('selectGroup',(e)=>{
          that.status='selectGroup';
          that.group=e.group;
          eventBus.$emit('selectGroup',e);
     });

     this.editor.listen('selectEdge',(e)=>{
        that.status='selectEdge';
        this.editor.status='selectEdge';
        that.edge=e.edge;
        eventBus.$emit('selectEdge',e);
     });


     this.editor.listen('undoredo',(e)=>{
       eventBus.$emit('undoredo',e);
       eventBus.$emit('refreshMap',{editor:this.editor});
     });

     this.editor.listen('clearSelectItems',()=>{
        eventBus.$emit('clearSelect');
     });

     function keepLastIndex(obj) {
        if (window.getSelection) {//ie11 10 9 ff safari
            obj.focus(); //解决ff不获取焦点无法定位问题
            let range = window.getSelection();//创建range
            range.selectAllChildren(obj);//range 选择obj下所有子内容
            range.collapseToEnd();//光标移至最后
        }
        else if (document.selection) {//ie10 9 8 7 6 5
            let range = document.selection.createRange();//创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(obj);//range定位到obj
            range.collapse(false);//光标移至最后
            range.select();
        }
    }

     this.editor.listen('edit',(e)=>{
        that.editStatus=e.status;
        var g=new zrender.Group();
        var box=null,text=e.text,box1=null;
        that.editModel=true;
       
        switch(e.status){
           case 'editNode':
            that.node=e.node;
            box=g.getBoundingRect([this.node]);
            that.left=box.x+this.editor.position[0];
            that.top=box.y+this.editor.position[1];
            that.width=box.width;
            that.height=box.height;
            that.text=that.domText(text);
            text='';
            break;
           case 'editGroup':
            that.editGroup=e.group;
            box=g.getBoundingRect([that.group.groupHead]);
            box1=g.getBoundingRect([that.group]);
            that.left=box1.x+this.editor.position[0];
            that.top=box1.y+this.editor.position[1];
            that.width=box.width;
            that.height=box.height;
           // text=that.group.groupHead.style.text;
            that.text=that.domText(text);
            text='';
            break;
           case 'editEdge':
             that.edge=e.edge;
             var d=e.edge.getData();
            if(d.text){
                box=g.getBoundingRect([e.edge.relateText]);
                that.left=box.x+this.editor.position[0];
                that.top=box.y+this.editor.position[1];
                that.width=box.width;
                that.height=box.height;
                that.text=that.domText(d.text);
             }else{
                var cpx=d.cpx;
                that.left=cpx.x1+this.editor.position[0];
                that.top=cpx.y1+this.editor.position[1];
                that.width=80;
                that.height=20;
             }
            break;
           
        }

        that.$nextTick(function () {
           //that.$refs['edit'].$el.focus();
           keepLastIndex( that.$refs['edit'].$el);
        });
     });
  },
  methods:{
     dragover(e){
       e.preventDefault();
     },
     dragstart(e){
       e.preventDefault();
     },
     drop(e){
        var text= e.dataTransfer.getData("addShape");
        var x=parseInt(e.offsetX)+0.5;
        var y=parseInt(e.offsetY)+0.5;
        try{
          var data=JSON.parse(text);
          data['x']=x;
          data['y']=y;
          this.editor.addShape(data);
        }catch(err){
           //window.console.log(err);
        }
     },
     trim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
     },
     updateText(){
       var txt=getPlainTxt(this.text);
       this.plainTxt=this.trim(txt);
       
       if(this.editStatus=='editNode'){
         eventBus.$emit('changeNode',{style:{text:this.trim(txt)},nodes:[this.node]});
       }

       if(this.editStatus=='editGroup'){
         eventBus.$emit('changeGroup',{mark:'head',style:{text:this.trim(txt)},group:this.editGroup});
       }

       if(this.editStatus=='editEdge'){
         eventBus.$emit('changeEdge',{mark:'text',style:{text:this.trim(txt)},edge:this.edge});
       }

       this.editModel=false;
       this.editStatus='';
       this.text='';
       this.plainTxt='';
     },
     domText(txt){
       var t=[];
       var txtArr=txt.split('\n');
       txtArr.forEach(tx=>{
          t.push('<div>'+tx+'</div>')
       });

     // window.console.log(t.join(''),+new Date());
       return t.join('');
     },
     closeDownLoadWin(){
        document.getElementById('download-win').style.display='none';
     }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.editor{
   position: absolute;
   left:140px;
   top:40px;
   right:260px;
   bottom:0px;
  /* background: url('../assets/image/wg.png') repeat; */
}
#flowEditor{
  width:100%;
  height:100%;
}
.text-editor{
  position: absolute;
  z-index: 300;
  background: #fff;
  border:1px solid #ccc;
  outline: none;
  min-width: 60px;
  font-size:14px;
  line-height: 20px;
}

.download-win{
  box-shadow: 0 0 3px #ccc;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  display: none;
  background: #fff;
}
.download-header{
  height:30px;
  background: #f5f5f5;
  line-height: 30px;
  text-indent: 6px;
  font-size: 12px;
}
.download-header span{
  cursor: pointer;
}


</style>
