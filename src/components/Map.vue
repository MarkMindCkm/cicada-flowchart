<template>
  <div class="flow-map">
     <div @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" class="flowmap-container">
         <div id="canvas-map"></div>
     </div>
  </div>
</template>
<script>
import eventBus from '../eventbus'
import flowEditor from '../flow/flowEditor';
  export default {
    name: 'Map',
    data() {
      return {
         width:0,
         height:0,
         sx:0,
         sy:0,
         dx:0,
         dy:0,
         pos:[],
         drag:false
      }
    },
    mounted(){
       var canvasEle=document.getElementById('canvas-map');
       this.width=canvasEle.offsetWidth;
       this.height=canvasEle.offsetHeight;
       var scale1=this.width/this.height;
       
       this.mapeditor=new flowEditor('canvas-map');
       this.mapeditor.offEvent();

       eventBus.$on('refreshMap',(e)=>{
           var editor=e.editor;
           this.edit=e.editor;
           var data=JSON.stringify(editor.getData());
           var box=editor.getBoundingRect(editor.nodes.concat(editor.groups).concat(editor.edges));
           var w=box.width;
           var h=box.height;
           var scale2=w/h;
           var scale=1;
           if(scale2>scale1){
             scale=this.width/box.width;
           }
           else {
             scale=this.height/box.height;
           }

           this.mapeditor.init(JSON.parse(data),true);
           this.mapeditor.attr({
             position:[-box.x*scale,-box.y*scale],
             scale:[scale,scale],
            // origin:[0,0]
           })
          
       });
    },
    methods: {
         mousedown(e){
              this.pos=this.edit.position.slice();
              this.sx=e.offsetX;
              this.sy=e.offsetY;
              this.drag=true;
         },
         mousemove(e){
           if(this.drag){
             this.dx=e.offsetX-this.sx;
             this.dy=e.offsetY-this.sy;
              this.edit.attr({
                 position:[this.pos[0]-this.dx*2,this.pos[1]-this.dy*2]
             });
           }
         },
         mouseup(){
             this.drag=false;
             this.dx=0;
             this.dy=0;
             this.pos=[0,0];
         }
    }
  }
</script>
<style>
 .flow-map{
     width:260px;
     height:160px;
     position: absolute;
     right:0;
     bottom:0;
     background: #fff;
     z-index: 300;
     border-top:1px solid #e6e9ed;
   
 }
 .flowmap-container{
     width:100%;
     height:100%;
     box-sizing: border-box;
     padding: 6px;
 }
 #canvas-map{
   width:100%;
   height:100%;
 }
 #canvas-map *{
     cursor: move;
 }
  
</style>