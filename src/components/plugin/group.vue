<template>
  <div class="group" @click="hideWin">
        <div class="node-header">
            {{text}}
          </div>
          <div class="section-group clearfix">
             <h3>{{$t("group.head")}}</h3>
             <p>
               <span>{{$t("group.fill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('groupfill')" :style="{'background':groupData.groupFill}"></span>
               <Sketch-picker v-show="groupData.groupfillshow" v-model="groupData.groupFill" @input="updateFill" ></Sketch-picker>
             </p>
             <p>
               <span>{{$t("group.stroke")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('stroke')" :style="{'background':groupData.stroke}"></span>
               <Sketch-picker v-show="groupData.strokeshow" v-model="groupData.stroke" @input="updateStroke" ></Sketch-picker>
             </p>
             <p style="line-height:20px;margin-top:6px">
                 <input class="magic-checkbox" type="checkbox"  v-model="groupData.showHead" id="showhead" name="checkbox">  
                 <label for="showhead">{{$t("group.showHead")}}</label>
              </p>
          </div>
          <div class="section-group clearfix">
             <h3>{{$t("group.font")}}</h3>
             <p>
               <span>{{$t("group.fontSize")}}</span>
               <span @click.stop="showColorPicker('fontsize')" class="font-size right color-picker">{{groupData.fontSize}}</span>
               <ul class="font-size-select" v-show="groupData.fontsizeshow">
                 <li v-for="item in fontsize" v-bind:key="item" @click="pickFontSize(item)">{{item}}</li>
               </ul>
             </p>
             <p>
               <span>{{$t("group.textFill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('textfill')" :style="{'background':groupData.textFill}"></span>
               <Sketch-picker v-show="groupData.textfillshow" v-model="groupData.textFill" @input="updateTextFill"></Sketch-picker>
             </p>
             <p>
                <span class="left">{{$t("group.fontStyle")}}</span>
                <span @click="setStyle($event)" :class="'textPos right iconfont icon-qingxie'+(groupData.fontStyle=='italic'?' active':'')"></span>
                <span @click="setBold($event)" :class="'textPos right iconfont icon-jiacu'+(groupData.fontWeight=='bold'?' active':'')"></span>
             </p>

             <p>
               <span>{{$t("group.fill")}}</span>
               <span class="color-picker" @click.stop="showColorPicker('fill')" :style="{'background':groupData.fill}"></span>
               <Sketch-picker v-show="groupData.fillshow" v-model="groupData.fill" @input="updateHeadFill"></Sketch-picker>
             </p>

             <p>
                <span class="left">{{$t("group.align")}}</span>
                <span @click="setTextPos($event,'insideRight')" :class="'textPos right iconfont icon-juyou'+(groupData.textPosition=='insideRight'?' active':'')" ></span>
                <span @click="setTextPos($event,'inside')" :class="'textPos right iconfont icon-juzhong1'+(groupData.textPosition=='inside'?' active':'')" ></span>
                <span @click="setTextPos($event,'insideLeft')" :class="'textPos right iconfont icon-juzuo'+(groupData.textPosition=='insideLeft'?' active':'')"></span>
             </p>
          </div>

           <!-- <div class="section-group clearfix">
                <h3>{{$t("group.prefabrication")}}</h3>
                <ul class="theme">
                   <li class="theme-item" v-for="(item,index) in theme" v-bind:key="index" >
                        <div class="theme-item-style">
                             <div class="theme-item-head" :style='{"background-color":item.headStyle.fill}'></div>
                             <div class="theme-item-group" :style='{"background-color":item.groupStyle.fill}'></div>
                        </div>
                   </li>
                </ul>
            </div> -->
  </div>
</template>

<script>
import eventBus from '../../eventbus';
import { setup } from "../../locales/index.js";
import { Sketch } from 'vue-color';
import style from '../preStyle';

export default {
  name: 'Group',
   components:{
   'Sketch-picker': Sketch
  },
  data(){
     return{
         text:'Group',
         fontsize:[12,14,16,18,20,24,28,32,36,40],
         groupData:{
             fillshow:false,
             strokeshow:false,
             textfillshow:false,
             fontsizeshow:false,
             groupfillshow:false,

             showHead:true,
             groupFill:'',       //整体背景     
             stroke:'',          //描边
             fill:'',            //头部背景
             textAlign:'left',
             fontSize:14,
             fontStyle:'',
             fontWeight:'',
             textFill:''
         },
         theme:style.group
     }
  },
  watch:{
    'groupData.showHead':{
         handler(newValue){
           eventBus.$emit('changeGroup',{mark:'showHead',showHead:newValue,group:this.group});
         }
    }
  },
  mounted(){
    //eventBus.$off('selectGroup');
    eventBus.$on('selectGroup',(e)=>{
          var group=e&&e.group;
          if(group){
              var data=group.getStyle();
              this.groupData={...this.groupData,...data};
              this.group=group;
          }
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
           case 'groupfill':
                this.groupData.strokeshow=false;
                this.groupData.textfillshow=false;
                this.groupData.fontsizeshow=false;
                this.groupData.fillshow=false;
                if(this.groupData.groupfillshow){
                  this.groupData.groupfillshow=false;
                }else{
                  this.groupData.groupfillshow=true;
                }
                break;
           case 'stroke':
                this.groupData.fillshow=false;
                this.groupData.textfillshow=false;
                this.groupData.fontsizeshow=false;
                this.groupData.groupfillshow=false;
                if(this.groupData.strokeshow){
                   this.groupData.strokeshow=false;
                }else{
                   this.groupData.strokeshow=true;
                }
                break;
           case 'textfill':
                this.groupData.fillshow=false;
                this.groupData.strokeshow=false;
                this.groupData.fontsizeshow=false;
                this.groupData.groupfillshow=false;
                 if(this.groupData.textfillshow){
                   this.groupData.textfillshow=false;
                }else{
                   this.groupData.textfillshow=true;
                }
                break;
           case 'fontsize':
                this.groupData.fillshow=false;
                this.groupData.strokeshow=false;
                this.groupData.textfillshow=false;
                this.groupData.groupfillshow=false;
                 if(this.groupData.fontsizeshow){
                   this.groupData.fontsizeshow=false;
                }else{
                   this.groupData.fontsizeshow=true;
                }
                break;
            case 'fill':
                this.groupData.groupfillshow=false;
                this.groupData.strokeshow=false;
                this.groupData.textfillshow=false;
                this.groupData.fontsizeshow=false;
                 if(this.groupData.fillshow){
                   this.groupData.fillshow=false;
                }else{
                   this.groupData.fillshow=true;
                }
                break;
       }
   },

   getRgba(value){
      var rgba=value.rgba;
      var rgb=`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
      return rgb;
   },

   updateFill (value){
      var rgb=this.getRgba(value);
      this.groupData.groupFill = rgb;
     // this.groupData.opacity=rgba.a;
      eventBus.$emit('changeGroup',{mark:'group',style:{fill:rgb},group:this.group});
    },

    updateStroke(value){
      var rgb=this.getRgba(value);
      this.groupData.stroke = rgb;
      eventBus.$emit('changeGroup',{mark:'group',style:{stroke:rgb},group:this.group});
    },

    updateTextFill(value){
      var rgb=this.getRgba(value);
      this.groupData.textFill = rgb;
      eventBus.$emit('changeGroup',{mark:'head',style:{textFill:rgb},group:this.group});
    },

    updateHeadFill(value){
      var rgb=this.getRgba(value);
      this.groupData.fill = rgb;
      eventBus.$emit('changeGroup',{mark:'head',style:{fill:rgb},group:this.group});
    },

    setStyle(){
      if(this.groupData.fontStyle=='italic'){
        this.groupData.fontStyle='';
        eventBus.$emit('changeGroup',{mark:'head',style:{fontStyle:''},group:this.group});
      }else{
        this.groupData.fontStyle='italic';
        eventBus.$emit('changeGroup',{mark:'head',style:{fontStyle:'italic'},group:this.group});
      }
    },

    setBold(){
       if(this.groupData.fontWeight=='bold'){
         this.groupData.fontWeight='';
         eventBus.$emit('changeGroup',{mark:'head',style:{fontWeight:''},group:this.group});
       }else{
         this.groupData.fontWeight='bold';
         eventBus.$emit('changeGroup',{mark:'head',style:{fontWeight:'bold'},group:this.group});
       }
    },

    pickFontSize(fontsize){
         if(this.groupData.fontSize!=fontsize){
           this.groupData.fontSize=fontsize;
           eventBus.$emit('changeGroup',{mark:'head',style:{fontSize:fontsize},group:this.group});
         }
    },

    setTextPos(e,pos){
       if(this.groupData.textPosition==pos){
         return;
       }
       this.groupData.textPosition=pos;
       eventBus.$emit('changeGroup',{mark:'head',style:{textPosition:pos},group:this.group});
    },
   
    hideColorPicker(){
       this.groupData.fillshow=false;
       this.groupData.strokeshow=false;
       this.groupData.textfillshow=false;
       this.groupData.fontsizeshow=false;
       this.groupData.groupfillshow=false;
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
  display: block;
  width:60px;
  height:80px;
  float: left;
  margin-top:6px;
}
.theme-item-head{
  height:20px;
  background-color:yellow;
  line-height: 20px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.theme-item-group{
   height:60px;
   background-color:red;
   line-height: 20px;
   border-bottom-left-radius: 3px;
   border-bottom-right-radius: 3px;
}

</style>
