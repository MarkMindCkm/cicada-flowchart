<template>
  <div class="header">
        <span @click.stop="openFile" class="iconfont icon-open" style="float:left;margin-left:10px;font-size:18px"></span>
        <ul>
            <li @click="command(item)" v-for="(item ,index) in icon" v-bind:key="index" :title="item.cmd" v-bind:class="'iconfont '+item.icon+' '+item.class"></li>
            <li>
                <span class="iconfont icon-upload-demo" @click.stop="showUpload"></span>
                <ul v-show="upload">
                  <li class="iconfont icon-JSON" @click.stop="save('json')"><span>JSON</span></li>
                  <li class="iconfont icon-PNG" @click.stop="save('png')"><span>PNG</span></li>
                  <!-- <li class="iconfont icon-jpg" @click.stop="save('jpg')"><span>JPG</span></li> -->
                </ul>
            </li>
        </ul>
        <input type="file" id="file" style="display:none"/>
        
        <div class="language" @mouseenter="mouseenter" @mouseleave="mouseleave">
              <span>{{lang}}</span>
              <ul v-show="showLang">
                  <li @click.stop="changeLanguage('zh')">中文</li>
                  <li @click.stop="changeLanguage('en')">English</li>
             </ul>
        </div>
        
        
  </div>
</template>

<script>
import eventBus from '../eventbus';
export default {
  name: 'Header',
  data(){
     return{
        language:'zh',
        showLang:false,
        icon:[
               {
                icon:'icon-undo',
                name:'撤销',
                cmd:'undo',
                class:'disable'
              },
              {
               icon:'icon-redo',
               name:'恢复',
               cmd:'redo',
               class:'disable'
             },
             {
               icon:'icon-fengexian',
               name:'分割',
               cmd:'line',
               class:'disable'
             },
              {
                icon:'icon-copy',
               name:'复制',
               cmd:'copy',
               class:'disable'
            },
            {
              icon:'icon-shanchu',
              name:'删除',
              cmd:'delete',
              class:'disable'
            },
            // {
            //    icon:'icon-fengexian',
            //    name:'分割',
            //    cmd:'line',
            //    class:'disable'
            //  },
            //  {
            //    icon:'icon-to-front',
            //    name:'最上层',
            //    cmd:'tofront',
            //    class:'disable'
            //  },
            //  {
            //    icon:'icon-to-back',
            //    name:'最下层',
            //    cmd:'toback',
            //    class:'disable'
            //  },
             {
               icon:'icon-fengexian',
               name:'分割',
               cmd:'line',
               class:'disable'
             },
              {
               icon:'icon-kuangxuan',
               name:'框选',
               cmd:'selectFrame',
               class:'disable'
             },
             {
               icon:'icon-group',
               name:'成组',
               cmd:'createGroup',
               class:'disable'
             },
              {
               icon:'icon-ungroup',
               name:'取消成组',
               cmd:'ungroup',
               class:'disable'
             }
        ],
        disable:true,
        upload:false
        
     }
  },
  computed:{
    lang(){
         return this.language=='zh'?'中文':'English';
    }
  },
  mounted(){

    eventBus.$on('selectNode',()=>{
      this.status="selectNode";
      this.changeDisable(true);
    });

    eventBus.$on('selectNodes',()=>{
      this.status="selectNodes";
      this.changeDisable(true);
    });

    eventBus.$on('clearSelect',()=>{
      this.status="clearSelect";
      this.changeDisable(false);
    });

    eventBus.$on('selectGroup',()=>{
      this.status="selectGroup";
      this.changeDisable(true);
    });

    eventBus.$on('undoredo',(e)=>{
       this.enableUndo(e.undo);
       this.enableRedo(e.redo);
    });

    eventBus.$on('selectEdge',()=>{
       this.status="selectEdge";
       this.changeDisable(true);
    });

    var fileDom=document.getElementById('file');
   // fileDom.removeEventListener('change');
    fileDom.addEventListener('change',(e)=>{
         var file=e.target.files[0];
        if(file&&file.name.endsWith('json')){
          var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
          reader.readAsText(file);//读取文件的内容
          reader.onload = function(){
            try{
              eventBus.$emit('initFlow',{data:JSON.parse(this.result)});
            }catch(e){
              alert('数据出错')
            }
          }
        }
        fileDom.value='';
    },false);

    this.language=localStorage.getItem('localeLanguage')||'zh';
    
    this.changeLanguage(this.language);

  },
  methods:{

    openFile(){
       document.getElementById('file').click();
    },

    changeLanguage(lang){
         this.language=lang;
         eventBus.$emit('changeLanguage',{
           language:lang
         });
    },
    mouseenter(){
         this.showLang = true;
    },
    mouseleave(){
         this.showLang = false;
    },
    command(item){
      if(item.class!='disable'){
        eventBus.$emit(item.cmd);
      }
    },
    changeDisable(flag){
      if(flag){
        this.icon.forEach(item=>{
            if(['undo','redo'].indexOf(item.cmd)==-1){
                item.class='';
            }
        });
      }else{
        this.icon.forEach(item=>{
              if(['undo','redo'].indexOf(item.cmd)==-1){
                item.class='disable';
            }
         });
      }
      this.disable=flag;
    },
    enableUndo(flag){
      if(flag){
        this.icon[0].class='';
      }else{
        this.icon[0].class='disable';
      }
    },
    enableRedo(flag){
      if(flag){
        this.icon[1].class='';
      }else{
        this.icon[1].class='disable';
      }
    },
    showUpload(){
         this.upload=!this.upload;
    },
    save(type){
       this.upload=false;
       eventBus.$emit('saveData',{type});
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
  margin-top:0;
  margin-bottom: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}
a {
  color: #42b983;
}
.header{
   -webkit-user-select: none;
   user-select: none;
   line-height: 40px;
   height: 40px;
   border:1px solid #e6e9ed;
   box-sizing: border-box;
   -webkit-box-sizing: border-box;
   text-align: center;
}
ul li.disable{
    color:#ccc;
}
li ul{
  position: absolute;
  border:1px solid #f5f5f5;
  cursor: pointer;
  z-index: 200;
}
li ul li{
  display: block;
  text-align: left;
  font-size: 16px;
  line-height: 30px;
  background: #fff;
  padding:0 10px;
  margin:0;
}
li ul li span{
  font-size: 12px;
}
li ul li:hover{
  background: #f5f5f5;
}
.language{
  position: absolute;
  right: 10px;
  top:-2px;
  font-size: 12px;
  z-index: 20;
  background: #fff;
  width:60px;
}
.language ul{
  border:1px solid #e5e5e5;
}
.language li {
  display: block;
}
</style>
