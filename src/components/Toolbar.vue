<template>
  <div class="toolbar">
    <div class="shape clearfix" v-for="s in shape" v-bind:key="s.id">
        <div class="shape-header">{{s.header}}</div>
        <ul>
            <li draggable="true"  @dragstart="dragstart($event,item)" v-for="item in s.icon" v-bind:key="item.command" :class="'iconfont '+item.iconName">
              <div v-html="item.path" :title="item.text"></div>
            </li>
        </ul>
    </div>
    
    <div class="shape clearfix shape-image" v-if="customize.length">
          <div class="shape-header clearfix">
            My Images
          </div>

          <ul class="clearfix">
             <li draggable="true" v-for="(item,index) in precustomize" v-bind:key="index"  @dragstart="dragstart($event,item)"><img draggable="false" :src="item.image" alt=""></li>
          </ul>

          <div class="shape-header clearfix" v-if="customize.length>=15" @click.stop="showAllImage=!showAllImage" style="text-align:center;font-size:12px;">
              More Images
          </div>

          <ul class="all-image clearfix"  v-if="showAllImage">
              <li draggable="true" v-for="(item,index) in customize" v-bind:key="index"  @dragstart="dragstart($event,item)"><img draggable="false" :src="item.image" alt=""></li>
          </ul>
    </div>
    

    <div @click.stop="showCustomize=!showCustomize" class="toolbar-btn">
       Add Images
    </div>

    <div class="customize-win" v-if="showCustomize">
        <div class="customize-win-header">
           <span>添加自定义图片</span>
           <div @click.stop="showCustomize=false" class="close iconfont icon-guanbi"></div>
        </div>

        <div class="customize-image">
            <ul>
             <li draggable="true" v-for="(item,index) in customize" v-bind:key="index">
               <span @click.stop="removeImage(item)" class="iconfont icon-guanbi"></span>
               <img draggable="false" :src="item.image" alt="">
            </li>

             <li @click.stop="showUpload=!showUpload"><span class="iconfont icon-add" style="color:#666;font-size:48px;line-height:44px;text-align:center;cursor:pointer"></span></li>
           </ul>
        </div>
    </div>

    <div class="upload-win" v-if="showUpload">
         <div class="customize-win-header">
           <div @click.stop="showUpload=false" class="close iconfont icon-guanbi"></div>
         </div>
         <div class="upload-win-content">
           <span>图片链接</span>
            <!-- <input type="file" @change.stop="uploadImage"/>  -->
            <input class="image-url" placeholder="请输入图片链接" type="text" v-model="imageUrl"/>
            <ul>
               <li>图床选择
                   <ul>
                     <li><a href="https://postimages.org/"  target="_blank">postimages</a></li>
                     <li><a href="https://sm.ms/" target="_blank">sm.ms</a></li>
                   </ul>
               </li>
               
            </ul>
         </div>
         <div class="upload-win-footer">
            <button @click="addImage">确定</button>
         </div>
    </div> 

  </div>
</template>
<script>
export default {
  name: 'Toolbar',
  data(){
     return{
        showCustomize:false,
        showUpload:false,
        showAllImage:false,
        imageUrl:'',
        shape:[
          {
            id:'flowChart',
            header:'FlowChart',
            icon:[
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><rect x="1.44" y="7.68" width="28.8" height="14.4" rx="2.16" ry="2.16" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></rect></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'rounded rectangle',
                command:'rectangle'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><ellipse cx="15.98" cy="14.96" rx="13.600000000000001" ry="13.600000000000001" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></ellipse></g></g><g></g><g></g></g></svg>',
                iconName:'circle',
                text:'圆形',
                command:'circular'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><rect x="0.73" y="7.3" width="29.2" height="14.6" fill="none" stroke="white" pointer-events="stroke" visibility="hidden" stroke-width="9"></rect><rect x="0.73" y="7.3" width="29.2" height="14.6" fill="none" stroke="none" pointer-events="all"></rect></g><g style=""><g transform="translate(7,10)scale(0.73)"><foreignObject style="overflow:visible;" pointer-events="all" width="22" height="12"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 24px; white-space: normal; overflow-wrap: normal; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;white-space:normal;">Text</div></div></foreignObject></g></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'text',
                command:'text'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 15.98 1.36 L 29.58 14.96 L 15.98 28.56 L 2.38 14.96 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'diamond',
                command:'diamond'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.44 22.08 L 7.2 7.68 L 30.24 7.68 L 24.48 22.08 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'parallelogram',
                command:'parallelogram'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 10.5 L 18.81 10.5 L 18.81 4.5 L 30.3 15 L 18.81 25.5 L 18.81 19.5 L 1.2 19.5 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'right arrow',
                command:'arrowRight'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 10.2 6 L 21.6 6 C 26.57 6 30.6 10.03 30.6 15 C 30.6 19.97 26.57 24 21.6 24 L 10.2 24 C 5.23 24 1.2 19.97 1.2 15 C 1.2 10.03 5.23 6 10.2 6 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'terminator',
                command:'roundRect'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><rect x="1.44" y="7.68" width="28.8" height="14.4" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></rect><path d="M 4.32 7.68 L 4.32 22.08 M 27.36 7.68 L 27.36 22.08" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 4.32 7.68 L 4.32 22.08 M 27.36 7.68 L 27.36 22.08" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'process',
                command:'preRect'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 7.48 C 1.2 6.66 1.87 6 2.7 6 L 29.1 6 C 29.93 6 30.6 6.66 30.6 7.48 L 30.6 22.26 C 25.86 20.51 20.64 20.51 15.9 22.26 C 11.16 24 5.94 24 1.2 22.26 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'document',
                command:'document'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 4.62 6.59 C 4.62 5.69 5.36 4.95 6.27 4.95 L 28.71 4.95 C 29.15 4.95 29.57 5.12 29.88 5.43 C 30.19 5.74 30.36 6.16 30.36 6.59 L 30.36 19.73 C 26.25 18 21.6 18 17.49 19.73 C 13.38 21.47 8.73 21.47 4.62 19.73 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 2.97 8.23 C 2.97 7.33 3.71 6.59 4.62 6.59 L 27.06 6.59 C 27.97 6.59 28.71 7.33 28.71 8.23 L 28.71 21.37 C 24.6 19.64 19.95 19.64 15.84 21.37 C 11.73 23.11 7.08 23.11 2.97 21.37 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 1.32 9.88 C 1.32 8.97 2.06 8.23 2.97 8.23 L 25.41 8.23 C 26.32 8.23 27.06 8.97 27.06 9.88 L 27.06 23.02 C 22.95 21.28 18.3 21.28 14.19 23.02 C 10.08 24.75 5.43 24.75 1.32 23.02 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'multi-document',
                command:'multidocument'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.44 5.28 L 25.44 5.28 L 30.24 14.88 L 25.44 24.48 L 1.44 24.48 L 6.24 14.88 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'processBar',
                command:'processBar'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 7.5 C 1.2 6.67 1.87 6 2.7 6 L 24.84 6 C 28.35 7.61 30.6 11.13 30.6 15 C 30.6 18.87 28.35 22.39 24.84 24 L 2.7 24 C 1.87 24 1.2 23.33 1.2 22.5 L 1.2 7.5 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'delay',
                command:'delay'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 6.9 6 L 29.1 6 C 29.93 6 30.6 6.67 30.6 7.5 L 30.6 22.5 C 30.6 23.33 29.93 24 29.1 24 L 2.7 24 C 1.87 24 1.2 23.33 1.2 22.5 L 1.2 12 L 6.9 6 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'card',
                command:'card'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 5.78 6.8 C 5.78 -0.45 26.18 -0.45 26.18 6.8 L 26.18 23.12 C 26.18 30.37 5.78 30.37 5.78 23.12 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 5.78 6.8 C 5.78 12.24 26.18 12.24 26.18 6.8" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'cylinder',
                command:'cylinder'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 8.64 5.28 L 23.04 5.28 L 30.24 14.88 L 23.04 24.48 L 8.64 24.48 L 1.44 14.88 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'preparation',
                command:'prepare'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 6.9 6 L 24.9 6 L 30.6 12 L 30.6 22.5 C 30.6 23.33 29.93 24 29.1 24 L 2.7 24 C 1.87 24 1.2 23.33 1.2 22.5 L 1.2 12 L 6.9 6 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'loop limit',
                command:'loop'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><ellipse cx="15.96" cy="14.82" rx="13.3" ry="13.3" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></ellipse><path d="M 2.66 14.82 L 29.26 14.82" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 2.66 14.82 L 29.26 14.82" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 15.96 1.52 L 15.96 28.12" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 15.96 1.52 L 15.96 28.12" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'summing function',
                command:'perhaps'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 28.18 1.12 C 28.67 1.13 29.07 1.3 29.23 1.58 C 29.4 1.86 29.31 2.21 29.01 2.52 L 2.91 27.16 C 2.61 27.47 2.52 27.82 2.69 28.1 C 2.85 28.38 3.25 28.55 3.74 28.56 L 28.18 28.56 C 28.67 28.55 29.07 28.38 29.23 28.1 C 29.4 27.82 29.31 27.47 29.01 27.16 L 2.91 2.52 C 2.61 2.21 2.52 1.86 2.69 1.58 C 2.85 1.3 3.25 1.13 3.74 1.12 L 28.18 1.12 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'collate',
                command:'contrast'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 16.52 1.4 L 29.4 14.28 C 29.58 14.41 29.68 14.62 29.68 14.84 C 29.68 15.06 29.58 15.27 29.4 15.4 L 16.52 28.28 C 16.39 28.46 16.18 28.56 15.96 28.56 C 15.74 28.56 15.53 28.46 15.4 28.28 L 2.52 15.4 C 2.34 15.27 2.24 15.06 2.24 14.84 C 2.24 14.62 2.34 14.41 2.52 14.28 L 15.4 1.4 C 15.53 1.22 15.74 1.12 15.96 1.12 C 16.18 1.12 16.39 1.22 16.52 1.4 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 2.24 14.84 L 29.68 14.84" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 2.24 14.84 L 29.68 14.84" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'sort',
                command:'sort'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 15 C 3.63 10.47 7.88 7.19 12.87 6 L 24.84 6 C 28.35 7.61 30.6 11.13 30.6 15 C 30.6 18.87 28.35 22.39 24.84 24 L 12.87 24 C 7.88 22.81 3.63 19.53 1.2 15 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'display',
                command:'display'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><rect x="2.66" y="1.52" width="26.6" height="26.6" rx="1.9" ry="1.9" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></rect><path d="M 2.66 7.22 L 29.26 7.22" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 2.66 7.22 L 29.26 7.22" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 8.36 1.52 L 8.36 28.12" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 8.36 1.52 L 8.36 28.12" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'internal storage',
                command:'store'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 13.5 L 29.09 6 C 29.48 6 29.86 6.16 30.15 6.44 C 30.43 6.72 30.59 7.1 30.59 7.5 L 30.59 22.5 C 30.6 23.22 30.09 23.86 29.39 24 L 2.7 24 C 2.3 24 1.92 23.84 1.64 23.56 C 1.36 23.28 1.2 22.9 1.2 22.5 L 1.2 13.5 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'manual Input',
                command:'manualInput'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.2 7.45 C 5.94 9.19 11.16 9.19 15.9 7.45 C 20.64 5.7 25.86 5.7 30.6 7.45 L 30.6 22.25 C 25.86 20.5 20.64 20.5 15.9 22.25 C 11.16 24 5.94 24 1.2 22.25 L 1.2 7.45 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'paper tape',
                command:'paperBag'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><ellipse cx="15.8" cy="14.99" rx="13.365" ry="13.365" fill="#ffffff" stroke="#000000" stroke-width="1.3" pointer-events="all"></ellipse><path d="M 15.8 28.35 L 29.16 28.35" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 15.8 28.35 L 29.16 28.35" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'sequential data',
                command:'ordinaldata'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 1.32 7.51 C 1.2 7.15 1.3 6.76 1.59 6.46 C 1.89 6.17 2.34 6 2.8 6.01 L 28.99 6.01 C 29.46 6 29.91 6.17 30.2 6.46 C 30.5 6.76 30.6 7.15 30.48 7.51 L 24.83 22.5 C 24.67 23.25 24.08 23.84 23.34 24 L 8.46 24 C 7.71 23.84 7.13 23.25 6.97 22.5 L 1.32 7.51 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'manual operation',
                command:'manualOperation'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 3.9 6 L 27.9 6 C 29.39 6 30.6 10.03 30.6 15 C 30.6 19.97 29.39 24 27.9 24 L 3.9 24 C 2.41 24 1.2 19.97 1.2 15 C 1.2 10.03 2.41 6 3.9 6 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 27.9 6 C 26.41 6 25.2 10.03 25.2 15 C 25.2 19.97 26.41 24 27.9 24" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 27.9 6 C 26.41 6 25.2 10.03 25.2 15 C 25.2 19.97 26.41 24 27.9 24" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'direct data',
                command:'directData'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 4.48 6 L 30.15 6 C 30.3 6.17 30.3 6.43 30.15 6.6 C 29 7.94 28.24 11.28 28.24 15 C 28.24 18.72 29 22.06 30.15 23.4 C 30.3 23.57 30.3 23.83 30.15 24 L 4.48 24 C 2.84 24 1.5 19.97 1.5 15 C 1.5 10.03 2.84 6 4.48 6 Z" fill="#ffffff" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'stored data',
                command:'storeData'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 15.81 13.33 L 17.36 14.88 L 15.81 16.43 L 14.26 14.88 L 15.81 13.33 Z M 9.61 13.33 L 11.16 14.88 L 9.61 16.43 L 8.06 14.88 L 9.61 13.33 Z M 22.01 13.33 L 23.56 14.88 L 22.01 16.43 L 20.46 14.88 L 22.01 13.33 Z" fill="#ffff00" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 1.24 8.68 L 30.38 8.68" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 1.24 8.68 L 30.38 8.68" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 1.24 21.08 L 30.38 21.08" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 1.24 21.08 L 30.38 21.08" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'parallel mode',
                command:'parallelModel'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 22.96 1.12 L 8.96 1.12 L 8.96 28.56 L 22.96 28.56" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 22.96 1.12 L 8.96 1.12 L 8.96 28.56 L 22.96 28.56" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'annotation',
                command:'annotation'
              },
              {
                path:'<svg style="left: 1px; top: 1px; width: 32px; height: 30px; display: block; position: relative; overflow: hidden;"><g><g></g><g><g transform="translate(0.5,0.5)" style="visibility: visible;"><path d="M 29.96 1.12 L 15.96 1.12 L 15.96 28.56 L 29.96 28.56" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 29.96 1.12 L 15.96 1.12 L 15.96 28.56 L 29.96 28.56" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path><path d="M 1.96 14.84 L 15.96 14.84" fill="none" stroke="white" stroke-width="9.3" stroke-miterlimit="10" pointer-events="stroke" visibility="hidden"></path><path d="M 1.96 14.84 L 15.96 14.84" fill="none" stroke="#000000" stroke-width="1.3" stroke-miterlimit="10" pointer-events="all"></path></g></g><g></g><g></g></g></svg>',
                iconName:'',
                text:'annotation 2',
                command:'induce'
              }
            ]
          }
        ],
        customize:[]
     }
  },
  computed:{
     precustomize(){
        return this.customize.slice().splice(0,15);
     }
  },
  mounted(){
    var str=localStorage.getItem('customize-icon');
    try{
      if(str){
         var data=JSON.parse(str);
         this.customize=data;
      }
    }catch(e){
       window.console.log(e);
    }
  },
  methods:{
    addImage(){
      if(this.imageUrl&&this.imageUrl.startsWith('http')){
         var obj={
           image:this.imageUrl
         };
         this.customize.push(obj);
         this.store();
         this.showUpload=false;
         this.imageUrl='';
      }
    },
    store(){
      localStorage.setItem('customize-icon',JSON.stringify(this.customize));
    },
    removeImage(item){
      var index=this.customize.indexOf(item);
      if(index>-1){
         this.customize.splice(index,1);
         this.store();
      }
    },
    dragstart(e,item){
       e.dataTransfer.setData("addShape",JSON.stringify(item));
    },
    uploadImage(e){
      var file=e.target.files[0];
      if(file){
       var type=file.type;
       var formData=new FormData();
       formData.append('smfile',file);
       if(['image/jpeg','image/png'].indexOf(type)>-1){
           this.ajax({
             method:'POST',
             url:'https://sm.ms//api/v2/upload',
             body:formData,
             succseeFn(res){
               window.console.log(res);
             },
             failFn(xhr){
               window.console.log(xhr);
             }

           })
       }
      }
    },
    ajax :function(options){
          //给参数一个选项
          let method = options.method
          let url = options.url
          let body = options.body
          let succseeFn = options.succseeFn
          let failFn = options.failFn

          let request = new XMLHttpRequest();
          //初始化请求
          request.open(method, url,true);
          request.setRequestHeader("Content-type","multipart/form-data");
          request.setRequestHeader('Authorization','');
          request.onreadystatechange = () => {
              if (request.readyState === 4) {
                  if (request.status >= 200 && request.status < 300) {
                      succseeFn.call(undefined, request.responseText)
                  } else if (request.status >= 400) {
                      failFn.call(undefined, request)
                  }
              }
          }
          request.send(body);
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
  margin: 0;
}
li {
  display: inline-block;
  margin: 0 4px;
}
a {
  color: #42b983;
}
.toolbar{
  width:140px;
  position: absolute;
  left:0;
  bottom:0;
  top:40px;
  border-right:1px solid #e5e5e5;
  padding-top:10px;
  background: #fafafa;
  user-select: none;
}
.toolbar ul{
  text-align: center;
}
.toolbar ul li{
  width:38px;
  height:38px;
  font-size:30px;
  line-height: 38px;
  cursor: pointer;
  float: left;
  box-sizing: border-box;
  padding-left: 1px;
  padding-top: 2px;
  border-radius: 3px;
}
.toolbar ul li:hover{
  background: #e5e5e5;
}
li{
  display: inline-block;
  width:40px;
  height:auto;
}
li img{
  width:100%;
}
.shape-header{
  height:30px;
  line-height: 30px;
  font-size: 12px;
  border-top:1px solid #e6e9ed;
  border-bottom:1px solid #e6e9ed;
  cursor: pointer;
  text-indent: 4px;
}
.shape-image{
  margin-top:10px;
}
.shape-image ul li{
  padding:4px;
  margin-top:2px;
}
.toolbar-btn{
   height:30px;
   border-top:1px solid #f5f5f5;
   line-height: 30px;
   text-align: center;
   font-size: 12px;
   position: absolute;
   bottom:0;
   left:0;
   right:0;
   cursor: pointer;
}
.customize-win{
  width:600px;
  height:400px;
  border-radius:3px;
  position: fixed;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  z-index: 300;
  border:1px solid #f5f5f5;
  background: #fff;
}
.close{
  position: absolute;
  right:0;
  top:0;
  width:30px;
  height:30px;
  color:red;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  font-size: 18px;
}
.customize-image{
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y:auto;
}
.customize-win-header{
  height:30px;
  line-height: 30px;
  text-indent: 6px;
  font-size: 12px;
  background: #f9f9f9;
  margin-bottom:10px;
}

.customize-image ul li{
  width:60px;
  height:60px;
  padding: 6px;
  border:1px solid #f5f5f5;
  position: relative;
}
.customize-image ul li span.icon-guanbi{
  position: absolute;
  left:0px;
  top:-10px;
}
.customize-image ul li img{
  vertical-align: middle;
}

.upload-win{
    width:600px;
    height:400px;
    border-radius:3px;
    position: fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index: 300;
    border:1px solid #f5f5f5;
    background: #fff;
}

.upload-win-content{
  height: calc(100% - 30px);
  overflow-x:hidden;
  overflow-y:auto;
  padding: 0 10px;
  font-size: 12px;
}
.upload-win-footer{
   position: absolute;
   left:0;
   height:40px;
   right:0;
   bottom:0;
   text-align: right;
}
.upload-win-footer button{
  width:80px;
  height:30px;
  border-radius:3px;
  text-align: center;
  color:#fff;
  background: #42b983;
  border:1px solid #42b983;
  margin-right:10px;
}

.image-url{
  width:400px;
  height:30px;
  line-height: 30px;
  border-radius:2px;
  font-size: 12px;
  border:1px solid #ccc;
  margin-left:6px;
  text-indent: 6px;
  margin-right:6px;
}

.upload-win-content>ul{
  float: right;
}

.upload-win-content ul li{
  width:auto;
  font-size: 12px;
  width:100px;
  line-height: 24px;
  height:24px;
  padding: 0;
  margin: 0;
  text-indent: 2px;
}

.upload-win-content ul li:first-child{
  line-height: 32px;
  height:32px;
  text-indent:0;
}

.upload-win-content>ul:hover ul{
  display: block;
}

.upload-win-content>ul ul{
  display: none;
}

.all-image{
  position: absolute;
  left:141px;
  top:0px;
  width:200px;
  background: #f5f5f5;
  bottom:0;
  overflow-y:auto;
  z-index:200;
  border-right:1px solid #e6e9ed;
  border-bottom:1px solid #e6e9ed;
}

</style>
