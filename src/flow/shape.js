import Rect from './node/rect';
import Circle from './node/circle';
import Diamond from './node/diamond';
import Parallelogram from './node/parallelogram'
import Cloud from './node/cloud'
import ArrowRight from './node/arrowRight'
import RoundRect from './node/aroundRect'
import PreRect from './node/preRect'
import Document from './node/document'
import Delay from './node/delay'
import Card from './node/card'
import Cylinder from './node/cylinder'
import Prepare from './node/prepare'
import Loop from './node/loop'
import Perhaps from './node/perhaps'
import Contrast from './node/contrast'
import Sort from './node/sort'
import Display from './node/display'
import Store from './node/store'
import ManualInput from './node/manualInput'
import PaperBag from './node/paperBag'
import Ordinaldata from './node/ordinaldata'
import ManualOperation from './node/manualOperation'
import DirectData from './node/directData'
import StoreData from './node/storeData'
import ParallelModel from './node/parallelModel'
import Annotation from './node/annotation'
import Induce from './node/induce'
import Multidocument from './node/multiDocument'
import Text from './node/text'
import ProcessBar from './node/processBar'
import Image from './node/image'


import Anch from './anch'

import zrender from 'zrender';

var shapeConfig = {
    common:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
            opacity:1
           
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            r:[3]
        },
        z: 10,
        draggable: true
    },
    rectangle: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
            opacity:1
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            r:[3]
        },
        z: 200,
        draggable: true
    },
    cloud: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
            textAlign: 'left'
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 40,
        },
        z: 10,
        draggable: true
    },
    diamond: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 60,
        },
        z: 10,
        draggable: true
    },
    parallelogram: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 40
        },
        z: 10,
        draggable: true
    },
    circular: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            cx: 0,
            cy: 0,
            rx: 40,
            ry: 40
        },
        z: 10,
        draggable: true
    },
    arrowRight: {
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 50
        },
        z: 10,
        draggable: true
    },
    document:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
            textOffset:[0,-4]
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 60
        },
        z: 10,
        draggable: true
    },
    cylinder:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 40
        },
        z: 10,
        draggable: true
    },
    loop:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 50
        },
        z: 10,
        draggable: true
    },
    perhaps:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'bottom',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 30,
            height: 30
        },
        z: 10,
        draggable: true
    },
    contrast:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'bottom',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 40,
            height: 30
        },
        z: 10,
        draggable: true
    },
    sort:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'bottom',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 40,
            height: 40
        },
        z: 10,
        draggable: true
    },
    ordinaldata:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: 'title',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 60,
            height: 60
        },
        z: 10,
        draggable: true
    },
    parallelModel:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 30
        },
        z: 10,
        draggable: true
    },
    annotation:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
            lineDash:[6,4]
        },
        shape: {
            x: 0,
            y: 0,
            width: 60,
            height: 100
        },
        z: 10,
        draggable: true
    },
    induce:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12
           // lineDash:[6,4]
        },
        shape: {
            x: 0,
            y: 0,
            width: 60,
            height: 100,
            direct:'right'
        },
        z: 10,
        draggable: true
    },
    multidocument:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
           // lineDash:[6,4]
        },
        shape: {
            x: 0,
            y: 0,
            width: 100,
            height: 80
        },
        z: 10,
        draggable: true
    },
    store:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'inside',
            fontSize: 12,
           // lineDash:[6,4]
        },
        shape: {
            x: 0,
            y: 0,
            width: 60,
            height: 60
        },
        z: 10,
        draggable: true
    },
    image:{
        style: {
            fill: '#fff',
            stroke: '#333',
            lineWidth: 1,
            image:'',
            text: '',
            textFill: '#333',
            fontWeight: 'normal',
            fontStyle: '',
            textPosition: 'bottom',
            fontSize: 12,
            x:0,
            y:0,
            width:60,
            height:60
        },
        draggable: true
    }
}

var shape = {
    'rectangle': Rect,
    'circular': Circle,
    'diamond': Diamond,
    'parallelogram': Parallelogram,
    'cloud': Cloud,
    'arrowRight': ArrowRight,
    'roundRect':RoundRect,
    'preRect':PreRect,
    'document':Document,
    'delay':Delay,
    'card':Card,
    'cylinder':Cylinder,
    'prepare':Prepare,
    'loop':Loop,
    'perhaps':Perhaps,
    'contrast':Contrast,
    'sort':Sort,
    'display':Display,
    'store':Store,
    'manualInput':ManualInput,
    'paperBag':PaperBag,
    'ordinaldata':Ordinaldata,
    'manualOperation':ManualOperation,
    'directData':DirectData,
    'storeData':StoreData,
    'parallelModel':ParallelModel,
    'annotation':Annotation,
    'induce':Induce,
    'multidocument':Multidocument,
    'text':Text,
    'processBar':ProcessBar,
    'image':Image
}

export default {
    addShape(name, className) {
        shape[name] = className;
    },
    removeShape(name) {
        delete shape[name]
    },
    getShape(name,data,isShow) {
       
        var config = zrender.util.clone(shapeConfig[name]||shapeConfig.common);
        config.z = 200;
        config.position = [data.x, data.y];
        config.command = name;
        if(data.image){
            config.style.image=data.image;
        }

        if (data.style) {
            config.style = { ...config.style, ...zrender.util.clone(data.style),...{transformText:true}};
        }

        if(data.shape){
            config.shape={...config.shape, ...zrender.util.clone(data.shape)}
        }

        var sh = new shape[name](config);

        sh.getData = function () {
            var d={
                type: this.type,
                style: zrender.util.clone(this.style),
                z: this.oldz,
                command: this.data.command,
                id:this.data.id||this.id,
                position:this.position.slice(),
                draggable:true
            };
            if(this.type!='image'){
                d.shape=zrender.util.clone(this.shape);
            }

            return d;
        }

        sh.setData = function (data) {
            this.data = { ...this.data, ...zrender.util.clone(data) };
            this.attr(this.data);
            this.oldz=this.data.z;
        }


        sh.getId = function () {
            return this.data.id||this.id;
        }

        sh.getAnchByIndex=function(index){
            if(this.anch){
                return this.anch.getBarByIndex(index)
            }
        }
      
        if(!isShow){
            var an = new Anch(sh);
            sh.anch = an;
      
            sh.refresh = function () {
                this.refreshEdge();
            }
    
            sh.setShadow=function(){
                this.attr({
                    style:{
                        shadowBlur: 6,
                        shadowColor: '#ccc'
                    }
                });
            }
    
            sh.cancelShadow=function(){
                this.attr({
                    style:{
                        shadowBlur: 0,
                        shadowOffsetX:0,
                        shadowOffsetY:0
                    }
                });
            }
    
            sh.on('mouseover', function () {
                if(!this.dragging){
                    this.anch.show();
                }
                this.oldz = this.z;
                this.attr({
                    z: 20000
                });
            });
    
            sh.on('mouseout', function () {
                this.attr({
                    z: this.oldz
                });
            });
    
            sh.on('click', function () {
                this.__zr&&this.__zr.trigger('selectNode', { node: this });
            });
    
            sh.on('dragstart', function () {
                this.oldPos = this.position.slice();
            });
    
            sh.on('drag', function () {
                this.refreshEdge();
                this.anch.hide();
                this.__zr&&this.__zr.trigger('hideFrame');
            });
    
            sh.on('dragend', function () {
                this.createAnchors();
                this.anch.refresh();
                this.__zr&&this.__zr.trigger('refreshSelectGroup');
                if (this.nodeGroup) {
                    if (this.groupTimeout) {
                        clearTimeout(this.groupTimeout);
                    } else {
                        if (this.leaveGroup) {
                            this.__zr.trigger('removeNodeFromGroup', { node: this });
                            this.leaveGroup = false;
                            return;
                        }
                    }
                }
                if (!this.addToNodeGroup) {
                    this.__zr&&this.__zr.trigger('moveNode', { node: this });
                }
            });
    
            sh.on('dblclick', function () {
                this.__zr&&this.__zr.trigger('edit', {
                    status: 'editNode',
                    node: this,
                    text:this.style.text
                });
            });
        }
        
        return sh;

    },
    hasShape(name) {
        return !!shape[name];
    }
}