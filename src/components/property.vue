<template>
  <div class="property">
     <v-canvas v-show="showCanvas"/>
     <Node v-show="showNode"/>
     <Group v-show="showGroup"/>
     <Edge v-show="showEdge"/>
     <!-- <Node v-if="showNode"/>  -->
  </div>
</template>
<script>
import Node from './plugin/node'
import Group from './plugin/group'
import Canvas from './plugin/canvas'
import Edge from './plugin/link'

import eventBus from '../eventbus'
export default {
  name: 'Property',
  components:{
     Node,
     Group,
     'v-canvas':Canvas,
     Edge
  },
  data(){
     return{
         showCanvas:true,
         showGroup:false,
         showNode:false,
         showLink:false,
         showEdge:false,
         node:null,
         group:null,
         nodes:null,
         edge:null
     }
  },
  mounted(){
    eventBus.$on('clearSelect',()=>{
         this.showGroup=false;
         this.showNode=false;
         this.showLink=false;
         this.showCanvas=true;
         this.showEdge=false;
    });
     eventBus.$on('selectNode',()=>{
         this.showGroup=false;
         this.showNode=true;
         this.showLink=false;
         this.showCanvas=false;
         this.showEdge=false;
    });
    eventBus.$on('selectNodes',()=>{
         this.showGroup=false;
         this.showNode=true;
         this.showLink=false;
         this.showCanvas=false;
         this.showEdge=false;
    });
    eventBus.$on('selectLink',()=>{
         this.showGroup=false;
         this.showNode=false;
         this.showLink=true;
         this.showCanvas=false;
         this.showEdge=false;
    });

    eventBus.$on('selectGroup',()=>{
         this.showGroup=true;
         this.showNode=false;
         this.showLink=false;
         this.showCanvas=false;
          this.showEdge=false;
    });
     eventBus.$on('selectEdge',()=>{
         this.showGroup=false;
         this.showNode=false;
         this.showLink=false;
         this.showCanvas=false;
         this.showEdge=true;
    });

  },
  methods:{
    
  }
}
</script>

<style scoped>
.property{
    width: 260px;
    position: absolute;
    right: 0;
    top:40px;
    bottom:0;
    border-left:1px solid #e6e9ed;
    background: #fff;
    font-size:14px;
    line-height: 26px;
    user-select: none;
    -webkit-user-select: none;
}

</style>
