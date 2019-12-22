<template>
  <div id="app">
     <MainPage/>
  </div>
</template>

<script>
import MainPage from './components/MainPage'

export default {
  name: 'app',
  components: {
    MainPage
  }
}
</script>

<style>
html,body{
  margin:0;
  padding:0;
  height: 100%;
   color: #2c3e50;
   overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
  height:100%;
}
.clearfix:after {  
  content: "."; 
  display: block; 
  height: 0; 
  clear: both; 
  visibility: hidden; 
}   
.clearfix {
  *zoom:1
}



/*--相关的单选复选按钮--*/  
@keyframes hover-color {  
  from {  
    border-color: #c0c0c0; }  
  to {  
    border-color: #3e97eb; } 
}  
  
.magic-radio,  
.magic-checkbox {  
  position: absolute;  
  display: none; }  
  
.magic-radio[disabled],  
.magic-checkbox[disabled] {  
  cursor: not-allowed; }  
  
.magic-radio + label,  
.magic-checkbox + label {  
  position: relative;  
  display: block;  
  padding-left: 30px;  
  cursor: pointer;  
}  
  .magic-radio + label:hover:before,  
  .magic-checkbox + label:hover:before {  
    animation-duration: 0.4s;  
    animation-fill-mode: both;  
    animation-name: hover-color;
 }  
  .magic-radio + label:before,  
  .magic-checkbox + label:before {  
    position: absolute;  
    top: 0;  
    left: 0;  
    display: inline-block;  
    width: 18px;  
    height: 18px;  
    content: '';  
    border: 1px solid #c0c0c0; 
  }  
  .magic-radio + label:after,  
  .magic-checkbox + label:after {  
    position: absolute;  
    display: none;  
    content: ''; }  
  
.magic-radio[disabled] + label,  
.magic-checkbox[disabled] + label {  
  cursor: not-allowed;  
  color: #e4e4e4; 
}  
  .magic-radio[disabled] + label:hover, .magic-radio[disabled] + label:before, .magic-radio[disabled] + label:after,  
  .magic-checkbox[disabled] + label:hover,  
  .magic-checkbox[disabled] + label:before,  
  .magic-checkbox[disabled] + label:after {  
    cursor: not-allowed; 
  }  
  .magic-radio[disabled] + label:hover:before,  
  .magic-checkbox[disabled] + label:hover:before {  
    border: 1px solid #e4e4e4;  
    animation-name: none; 
  }  
  .magic-radio[disabled] + label:before,  
  .magic-checkbox[disabled] + label:before {  
    border-color: #e4e4e4; 
   }  
  
.magic-radio:checked + label:before,  
.magic-checkbox:checked + label:before {  
  animation-name: none; 
}  
  
.magic-radio:checked + label:after,  
.magic-checkbox:checked + label:after {  
  display: block; 
}  
  
.magic-radio + label:before {  
  border-radius: 50%; 
}  
  
.magic-radio + label:after {  
  top: 6px;  
  left: 6px;  
  width: 8px;  
  height: 8px;  
  border-radius: 50%;  
  background: #3e97eb; 
}  
  
.magic-radio:checked + label:before {  
  border: 1px solid #3e97eb; 
}  
  
.magic-radio:checked[disabled] + label:before {  
  border: 1px solid #c9e2f9; 
}  
  
.magic-radio:checked[disabled] + label:after {  
  background: #c9e2f9; 
}  
  
.magic-checkbox + label:before {  
  border-radius: 3px; 
 }  
  
.magic-checkbox + label:after {  
  top: 2px;  
  left: 6px;  
  box-sizing: border-box;  
  width: 6px;  
  height: 12px;  
  transform: rotate(45deg);  
  border-width: 2px;  
  border-style: solid;  
  border-color: #fff;  
  border-top: 0;  
  border-left: 0; 
}  
  
.magic-checkbox:checked + label:before {  
  border: #3e97eb;  
  background: #3e97eb; 
}  
  
.magic-checkbox:checked[disabled] + label:before {  
  border: #c9e2f9;  
  background: #c9e2f9;
}  


</style>
