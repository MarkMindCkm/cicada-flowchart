<template>
    <div class="edge" @click="hideWin">
        <div class="node-header">Relate Link</div>
        <div class="section-group">
             <h3>{{$t("edge.head")}}</h3>
             <p>
               <span>{{$t("edge.stroke")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('stroke')" :style="{'background':edgeData.stroke}"></span>
               <Sketch-picker v-show="edgeData.strokeshow" v-model="edgeData.stroke" @input="updateStroke" ></Sketch-picker>
             </p>
              <p>
               <span>{{$t("edge.lineDash")}}</span>
               <span v-for="(item,index) in lineDash" v-bind:key="index" @click.stop="changeLineDash(item.name)"  :class="'iconfont right lineType lineDash'+' '+item.icon+(edgeData.lineDashType==item.name?' active':'')"></span>
             </p>
             <p>
               <span>{{$t("edge.lineStyle")}}</span>
               <span @click.stop="changeLineType('bs')"  :class="'iconfont icon-quxianjiantou right lineType'+(edgeData.type=='bs'?' active':'')"></span>
               <span @click.stop="changeLineType('polyline')" :class="'iconfont icon-zhexianjiantou right lineType'+(edgeData.type=='polyline'?' active':'')"></span>
               <span @click.stop="changeLineType('line')" :class="'iconfont icon-zhixianjiantou right lineType'+(edgeData.type=='line'?' active':'')"></span>
             </p>
             <p v-show="edgeData.type=='polyline'">
               <span>{{$t("edge.turningDistance")}}</span>
                <span @click.stop="showColorPicker('ext')" class="font-size right color-picker">{{edgeData.ext}}</span>
               <ul class="ext-select" v-show="edgeData.extshow">
                 <li v-for="item in exts" v-bind:key="item" @click="pickExt(item)">{{item}}</li>
               </ul>
             </p>
        </div>

        <div class="section-group">
             <h3>{{$t("edge.font")}}</h3>
             <p>
               <span>{{$t("edge.fontSize")}}</span>
               <span @click.stop="showColorPicker('fontsize')" class="font-size right color-picker">{{edgeData.fontSize}}</span>
               <ul class="font-size-select" v-show="edgeData.fontsizeshow">
                 <li v-for="item in fontsize" v-bind:key="item" @click="pickFontSize(item)">{{item}}</li>
               </ul>
             </p>
             <p>
               <span>{{$t("edge.textFill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('textFill')" :style="{'background':edgeData.textFill}"></span>
               <Sketch-picker v-show="edgeData.textfillshow" v-model="edgeData.textFill" @input="updateTextFill"></Sketch-picker>
             </p>
             <p>
                <span class="left">{{$t("edge.fontStyle")}}</span>
                <span @click="setStyle($event)" :class="'textPos right iconfont icon-qingxie'+(edgeData.fontStyle=='italic'?' active':'')"></span>
                <span @click="setBold($event)" :class="'textPos right iconfont icon-jiacu'+(edgeData.fontWeight=='bold'?' active':'')"></span>
             </p>
              <p>
               <span>{{$t("edge.fill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('fill')" :style="{'background':edgeData.fill}"></span>
               <Sketch-picker v-show="edgeData.fillshow" v-model="edgeData.fill" @input="updateFill"></Sketch-picker>
             </p>

        </div>

    </div>
</template>
<script>
import eventBus from '../../eventbus';
import { Sketch } from 'vue-color';
import { setup } from "../../locales/index.js";
export default {
    name:'Edge',
    components:{
      'Sketch-picker': Sketch
    },
    data(){
        return {
             fontsize:[12,14,16,18,20,24,28,32,36,40],
             exts:[20,30,40,50,60,70,80,90,100,120,140,160,180,200,240,280,320,400,460,520,600,700,800,900,1000],
             lineDash:[
               {
                 dash:[6,2,2,2],
                 name:'dashed',
                 icon:'icon-line1'
               },
               {
                 dash:[4,2],
                 name:'dash',
                 icon:'icon-line-dashed'
               },
               {
                 dash:[1,1],
                 name:'dott',
                 icon:'icon-linedotted'
               },
               {
                  dash:[0],
                  name:'solid',
                  icon:'icon-line'
               }
             ],
             edgeData:{
               strokeshow:false,
               fillshow:false,
               textfillshow:false,
               fontsizeshow:false,
               extshow:false,
               stroke:'',
               fontSize:12,
               fontStyle:'',
               fontWeight:'',
               fill:'',
               textFill:'',
               ext:30,
               lineDashType:'solid'
             },
             edge:null
        }
    },
    mounted(){
      eventBus.$on('selectEdge',(e)=>{
         var data=e.edge.getData();
         this.edge=e.edge;
         this.edgeData={...this.edgeData,...data};
      });
       eventBus.$on('changeLanguage',(e)=>{
          setup(e.language);
       });
           
       this.language=localStorage.getItem('localeLanguage')||'zh';
       setup(this.language);

    },
    methods:{
      showColorPicker(mark){
       switch(mark){
           case 'stroke':
                this.edgeData.fillshow=false;
                this.edgeData.textfillshow=false;
                this.edgeData.fontsizeshow=false;
                this.edgeData.extshow=false;
                if(this.edgeData.strokeshow){
                   this.edgeData.strokeshow=false;
                }else{
                   this.edgeData.strokeshow=true;
                }
           break;
           case 'textFill':
                this.edgeData.fillshow=false;
                this.edgeData.strokeshow=false;
                this.edgeData.fontsizeshow=false;
                this.edgeData.extshow=false;
                 if(this.edgeData.textfillshow){
                   this.edgeData.textfillshow=false;
                }else{
                   this.edgeData.textfillshow=true;
                }
           break;
           case 'fontsize':
                this.edgeData.fillshow=false;
                this.edgeData.strokeshow=false;
                this.edgeData.textfillshow=false;
                this.edgeData.extshow=false;
                 if(this.edgeData.fontsizeshow){
                   this.edgeData.fontsizeshow=false;
                }else{
                   this.edgeData.fontsizeshow=true;
                }
           break;
           case 'fill':
                this.edgeData.fontsizeshow=false;
                this.edgeData.strokeshow=false;
                this.edgeData.textfillshow=false;
                this.edgeData.extshow=false;
                 if(this.edgeData.fillshow){
                   this.edgeData.fillshow=false;
                }else{
                   this.edgeData.fillshow=true;
                }
           break;
           case 'ext':
                this.edgeData.fontsizeshow=false;
                this.edgeData.strokeshow=false;
                this.edgeData.textfillshow=false;
                this.edgeData.fillshow=false;
                  if(this.edgeData.extshow){
                   this.edgeData.extshow=false;
                }else{
                   this.edgeData.extshow=true;
                }
             break;
       }
      },
      getRgba(value){
          var rgba=value.rgba;
          var rgb=`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
          return rgb;
      },
      updateStroke(value){
          var rgb=this.getRgba(value);
          this.edgeData.stroke=rgb;
          eventBus.$emit('changeEdge',{style:{stroke:rgb},mark:'line',edge:this.edge});
      },
      updateTextFill(value){
        var rgb=this.getRgba(value);
        this.edgeData.textFill=rgb;
        eventBus.$emit('changeEdge',{style:{textFill:rgb},mark:'text',edge:this.edge});
      },
      updateFill(value){
        var rgb=this.getRgba(value);
        this.edgeData.fill=rgb;
        eventBus.$emit('changeEdge',{style:{fill:rgb},mark:'text',edge:this.edge});
      },
       pickFontSize(fontsize){
         if(this.edgeData.fontSize!=fontsize){
           this.edgeData.fontSize=fontsize;
           eventBus.$emit('changeEdge',{mark:'text',style:{fontSize:fontsize},edge:this.edge});
         }
    },
    pickExt(ext){
          if(this.edgeData.ext!=ext){
           this.edgeData.ext=ext;
           eventBus.$emit('changeEdge',{mark:'line',style:{ext:ext},edge:this.edge});
         } 
    },
     setStyle(){
      if(this.edgeData.fontStyle=='italic'){
        this.edgeData.fontStyle='';
        eventBus.$emit('changeEdge',{style:{fontStyle:''},edge:this.edge,mark:'text'});
      }else{
        this.edgeData.fontStyle='italic';
        eventBus.$emit('changeEdge',{style:{fontStyle:'italic'},edge:this.edge,mark:'text'});
      }
    },
    setBold(){
       if(this.edgeData.fontWeight=='bold'){
         this.edgeData.fontWeight='';
         eventBus.$emit('changeEdge',{style:{fontWeight:''},edge:this.edge,mark:'text'});
       }else{
         this.edgeData.fontWeight='bold';
         eventBus.$emit('changeEdge',{style:{fontWeight:'bold'},edge:this.edge,mark:'text'});
       }
     },
     changeLineType(type){
        this.edgeData.type=type;
        eventBus.$emit('changeEdge',{mark:'type',style:{type:type},edge:this.edge});
     },
     changeLineDash(type){
         this.edgeData.lineDashType=type;
         eventBus.$emit('changeEdge',{mark:'type',style:{lineDashType:type},edge:this.edge});
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
    },
     hideColorPicker(){
       this.edgeData.fillshow=false;
       this.edgeData.strokeshow=false;
       this.edgeData.textfillshow=false;
       this.edgeData.fontsizeshow=false;
       this.edgeData.extshow=false;
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
.ext-select,
.font-size-select{
  position: absolute;
  width:240px;
  border:1px solid #f5f5f5;
  z-index: 20;
  background: #fff;
  right:0;
  line-height: 20px;
  padding:6px;
}
.lineType{
     width:24px;
     height:24px;
     border:1px solid #f5f5f5;
     text-align: center;
     line-height: 24px;
     margin-left:2px;
}
.lineType.active{
    background: #409eff;
    color: #fff;
}
.lineDash.active{
    background: #409eff;
    color: #fff;
}
</style>