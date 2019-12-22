<template>
  <div class="MainPage">
    <Header />
    <Toolbar />
    <Editor />
    <Property />
    <Map />
  </div>
</template>
<script>

import Header from './Header'
import Toolbar from './Toolbar'
import Editor from './Editor'
import Property from './property'
import Map from './Map'

export default {
  name: 'MainPage',
  components:{
     Header,
     Toolbar,
     Editor,
     Property,
     Map
  },
  data(){
     return{

     }
  },
  mounted(){
     
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
.MainPage{
  width:100%;
  height:100%;
}
</style>
