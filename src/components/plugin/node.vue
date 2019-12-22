<template>
   <div class="node"  @click="hideWin($event)">
          <div class="node-header">
            {{text}}
          </div>
          <div class="section-group clearfix">
             <h3>{{$t("node.head")}}</h3>
             <p>
               <span >{{$t("node.fill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('fill')" :style="{'background':nodeData.style.fill}"></span>
               <Sketch-picker v-show="nodeData.fillshow" v-model="nodeData.style.fill" @input="updateFill" ></Sketch-picker>
             </p>
             <p>
               <span>{{$t("node.stroke")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('stroke')" :style="{'background':nodeData.style.stroke}"></span>
               <Sketch-picker v-show="nodeData.strokeshow" v-model="nodeData.style.stroke" @input="updateStroke" ></Sketch-picker>
             </p>
          </div>
          <div class="section-group clearfix">
             <h3>{{$t("node.font")}}</h3>
             <p>
               <span>{{$t("node.fontSize")}}</span>
               <span @click.stop="showColorPicker('fontsize')" class="font-size right color-picker">{{nodeData.style.fontSize}}</span>
               <ul class="font-size-select" v-show="nodeData.fontsizeshow">
                 <li v-for="item in fontsize" v-bind:key="item" @click="pickFontSize(item)">{{item}}</li>
               </ul>
             </p>
             <p>
               <span>{{$t("node.textFill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('textFill')" :style="{'background':nodeData.style.textFill}"></span>
               <Sketch-picker v-show="nodeData.textfillshow" v-model="nodeData.style.textFill" @input="updateTextFill"></Sketch-picker>
             </p>
             <p>
                <span class="left">{{$t("node.fontStyle")}}</span>
                <span @click="setStyle($event)" :class="'textPos right iconfont icon-qingxie'+(nodeData.style.fontStyle=='italic'?' active':'')"></span>
                <span @click="setBold($event)" :class="'textPos right iconfont icon-jiacu'+(nodeData.style.fontWeight=='bold'?' active':'')"></span>
             </p>
             <p>
                <span class="left">{{$t("node.position")}}</span>
                <span @click="setTextPos($event,'left')" :class="'textPos right iconfont icon-you'+(nodeData.style.textPosition=='left'?' active':'')" style="transform: rotate(180deg)"></span>
                <span @click="setTextPos($event,'bottom')" :class="'textPos right iconfont icon-arrow-down-last'+(nodeData.style.textPosition=='bottom'?' active':'')" ></span>
                <span @click="setTextPos($event,'right')" :class="'textPos right iconfont icon-you'+(nodeData.style.textPosition=='right'?' active':'')"></span>
                <span @click="setTextPos($event,'top')" :class="'textPos right iconfont icon-arrow-down-last'+(nodeData.style.textPosition=='top'?' active':'')" style="transform: rotate(180deg)"></span>
                <span @click="setTextPos($event,'inside')" :class="'textPos right iconfont icon-juzhong'+(nodeData.style.textPosition=='inside'?' active':'')"></span>
             </p>
          </div>

          <div class="section-group clearfix" v-if="multipleSelect">
                <h3>{{$t("node.nodeAlign")}}</h3>
                <ul>
                  <li @click="align('horizontalAlign')" class="iconfont icon-halign"></li>
                  <li @click="align('verticalAlign')" class="iconfont icon-juzhongduiqi"></li>
                  <li @click="align('leftAlign')" class="iconfont icon-align-left"></li>
                  <li @click="align('rightAlign')" class="iconfont icon-youduiqi"></li>
                </ul>
          </div>

           <div class="section-group clearfix">
                <h3>{{$t("node.prefabrication")}}</h3>
                <ul class="theme">
                  <li class="theme-item" @click="changeNodeStyle(item)" v-for="(item,index) in preStyle" v-bind:key="index" :style="{background:item.fill,'border-color':item.stroke}"></li>
                </ul>
            </div>
      </div>
</template>
<script>

import { Sketch } from 'vue-color';
import eventBus from '../../eventbus';
import { setup } from "../../locales/index.js";

import preStyle from '../preStyle';

export default {
  name: 'Node',
  components:{
   'Sketch-picker': Sketch
  },
  data(){
     return{
         text:'Single Node',
         multipleSelect:false,
         fontsize:[8,10,12,14,16,18,20,24,28,32,36,40],
         nodeData:{
              fillshow:false,
              strokeshow:false,
              textfillshow:false,
              fontsizeshow:false,
              style:{
                 fill:'#fff',
                 stroke:'transparent',
                 textFill:'transparent',
                 text:'',
                 lineWidth:1,
                 opacity:1,
                 fontSize:12,
                 fontWeight:'normal',
                 fontStyle:'italic',
                 textPosition:'inside'
              },
              shape:{

              },
              z:10
         },
         preStyle:preStyle.node
         
     }
  },
  mounted(){
    //  eventBus.$on('clearSelect',()=>{
    //      this.multipleSelect=false;
    //  });
     eventBus.$on('selectNode',(e)=>{
         this.text="Single Node";
         this.multipleSelect=false;
         this.node=e.node;
         var data=this.node.getData();
         this.nodeData={...this.nodeData,...data};
    });

    eventBus.$on('selectNodes',(e)=>{
         this.text="Multiple Node";
         this.multipleSelect=true;
         this.nodes=e.nodes;
    });

    eventBus.$on('changeLanguage',(e)=>{
        setup(e.language);
    });

    this.language=localStorage.getItem('localeLanguage')||'zh';
    setup(this.language);
  },
  methods:{
   align(align){
       eventBus.$emit('align',{align})
   },
   showColorPicker(mark){
      // this.hideColorPicker();
       switch(mark){
           case 'fill':
                this.nodeData.strokeshow=false;
                this.nodeData.textfillshow=false;
                this.nodeData.fontsizeshow=false;
                if(this.nodeData.fillshow){
                  this.nodeData.fillshow=false;
                }else{
                  this.nodeData.fillshow=true;
                }
           break;
           case 'stroke':
                this.nodeData.fillshow=false;
                this.nodeData.textfillshow=false;
                this.nodeData.fontsizeshow=false;
                if(this.nodeData.strokeshow){
                   this.nodeData.strokeshow=false;
                }else{
                   this.nodeData.strokeshow=true;
                }
           break;
           case 'textFill':
                this.nodeData.fillshow=false;
                this.nodeData.strokeshow=false;
                this.nodeData.fontsizeshow=false;
                 if(this.nodeData.textfillshow){
                   this.nodeData.textfillshow=false;
                }else{
                   this.nodeData.textfillshow=true;
                }
           break;
           case 'fontsize':
                this.nodeData.fillshow=false;
                this.nodeData.strokeshow=false;
                this.nodeData.textfillshow=false;
                 if(this.nodeData.fontsizeshow){
                   this.nodeData.fontsizeshow=false;
                }else{
                   this.nodeData.fontsizeshow=true;
                }
           break;
       }
   },
   updateFill (value){
      var rgba=value.rgba;
      var rgb=`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
      this.nodeData.style.fill = rgb;
     // this.nodeData.style.opacity=rgba.a;
      eventBus.$emit('changeNode',{style:{fill:rgb}});
    },
    updateStroke(value){
      var rgba=value.rgba;
      var rgb=`rgb(${rgba.r},${rgba.g},${rgba.b})`;
      this.nodeData.style.stroke = rgb;
      eventBus.$emit('changeNode',{style:{stroke:rgb}});
    },
    updateTextFill(value){
      var rgba=value.rgba;
      var rgb=`rgb(${rgba.r},${rgba.g},${rgba.b})`;
      this.nodeData.style.textFill = rgb;
      eventBus.$emit('changeNode',{style:{textFill:rgb}});
    },
    setStyle(){
      if(this.nodeData.style.fontStyle=='italic'){
        this.nodeData.style.fontStyle='';
        eventBus.$emit('changeNode',{style:{fontStyle:''}});
      }else{
        this.nodeData.style.fontStyle='italic';
        eventBus.$emit('changeNode',{style:{fontStyle:'italic'}});
      }
    },
    setBold(){
       if(this.nodeData.style.fontWeight=='bold'){
         this.nodeData.style.fontWeight='';
         eventBus.$emit('changeNode',{style:{fontWeight:''}});
       }else{
         this.nodeData.style.fontWeight='bold';
         eventBus.$emit('changeNode',{style:{fontWeight:'bold'}});
       }
    },
    pickFontSize(fontsize){
         if(this.nodeData.style.fontSize!=fontsize){
           this.nodeData.style.fontSize=fontsize;
           eventBus.$emit('changeNode',{style:{fontSize:fontsize}});
         }
    },
    setTextPos(e,pos){
       if(this.nodeData.style.textPosition==pos){
         return;
       }
       this.nodeData.style.textPosition=pos;
       eventBus.$emit('changeNode',{style:{textPosition:pos}});
    },
    changeNodeStyle(item){
             this.nodeData.style.fill=item.fill;
             this.nodeData.style.stroke=item.stroke;
             this.nodeData.style.fontSize=item.fontSize;
             var s={...{},...item};
           //  window.console.log(s,this.nodeData.z);
             eventBus.$emit('changeNode',{style:s,z:this.nodeData.z});
    },
    hideColorPicker(){
       this.nodeData.fillshow=false;
       this.nodeData.strokeshow=false;
       this.nodeData.textfillshow=false;
       this.nodeData.fontsizeshow=false;
    },
    hideWin(e){
        var p=e.target,flag=false;
        while(p){
          if(p.nodeType==1){
             if(p&&p.className&&p.className.indexOf('vc-sketch')>-1){
               flag=true;
               break;
             }
          }
          p=p.parentElement;
        }      
        if(!flag){
          this.hideColorPicker();
        }
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 8px 0 0 0;
  border-bottom:1px solid #e6e9ed;
  font-size: 14px;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  display: inline-block;
  margin: 0 4px;
}
p{
  margin:0;
  padding: 0;
}

.left{
  float: left;
}
.right{
  float: right;
}
a {
  color: #42b983;
}

.node-header{
  height:40px;
  line-height: 40px;
  text-indent: 6px;
  border-bottom:1px solid #e6e9ed;
  background: #f5f5f5;
  margin-bottom:20px;
}
.color-picker{
  float: right;
  display: block;
  width:24px;
  height:24px;
  margin-top:6px;
  border:1px solid #f5f5f5;
  line-height: 24px;
}
.color-picker .vc-sketch{
  right:200px;
  top:24px;
}
.vc-sketch{
  position: absolute;
  z-index: 20;
}
.section-group{
  padding: 0 10px;
  font-size: 12px;
  clear:both;
}
span.left{
   clear: both;
}
span.right{
  cursor: pointer;
}
p{
  clear: both;
  position: relative;
}
.section-group:last-child{
  padding-top:10px;
}
.textPos{
  display: inline-block;
  width:24px;
  height:24px;
  border:1px solid #f5f5f5;
  text-align: center;
  line-height: 24px;
  margin-left:1px;
  border-radius:3px;
  margin-top:5px;
}
span.textPos.active{
  background: #409eff;
  color:#fff;
}
.font-size{
  line-height: 24px;
  text-align:center;
}
.font-size-select{
  position: absolute;
  width:240px;
  border:1px solid #f5f5f5;
  z-index: 20;
  background: #fff;
  right:0;
  line-height: 20px;
  padding: 6px;
}

.theme-item{
    border-width: 1px;
    border-style: solid;
    width:50px;
    height:20px;
    margin-top:3px;
    margin-left:3px;
    float: left;
}


</style>
