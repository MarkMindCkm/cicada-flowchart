<template>
  <div
    class="div-editable"
    contenteditable="true"
    v-html="innerText"
    @input="changeText"
    @focus="isChange = false"
    @blur="blurFunc"></div>
</template>

<script>
  export default {
    name: 'Edit',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        innerText: this.value,
        isChange: true
      }
    },
    watch: {
      value(newvalue){
        // window.console.log(this.isChange,newvalue,+new Date());
         if(this.isChange) {
          this.innerText = newvalue
         }
      }
    },
    methods: {
      changeText() {
        this.$emit('input', this.$el.innerHTML)
      },
      blurFunc() {
        this.isChange = true;
        this.$emit('blurFunc')
      }
    }
  }
</script>

<style >
  
</style>