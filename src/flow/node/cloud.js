  import zrender from 'zrender';
  import mixin from '../help/mixin'
import common from './common'
//   function drawPoint(x,y,width,height,ctx,mark){
//         var r=20;
//         var nw=parseInt(width/r);
//         var nh=parseInt(height/r);
//         var x1;
//         var y1;

//         switch(mark){
//             case 'top':
//                 ctx.moveTo(x,y);
//                 for(let i=1;i<=nw;i++){
//                      x1=x+i*r;
//                      y1=y;
//                     let cpx=x1-r/2;
//                     let cpy=y1-r/2;
//                     ctx.quadraticCurveTo(cpx,cpy,x1,y1);
//                    // ctx.lineTo(x1,y1);
//                 }
//                 if(width%r!=0){
//                     let r1=width-nw*r;
//                     let cpx=x1+r1/2;
//                     let cpy=y-r/2;
//                     ctx.quadraticCurveTo(cpx,cpy,x+width,y);
//                 }
//                 break;
//             case 'right':
//                     //ctx.moveTo(x+width,y);
//                     for(let i=1;i<=nh;i++){
//                          x1=x+width;
//                          y1=y+i*r;
//                         let cpx=x1+r/2;
//                         let cpy=y1-r/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x1,y1);
//                        // ctx.lineTo(x1,y1);
//                     }
//                     if(height%r!=0){
//                         let r1=height-nh*r;
//                         let cpx=x1+r/2;
//                         let cpy=y1+r1/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x+width,y+height);
//                     }
//                 break;
//             case 'bottom':
//                  //   ctx.moveTo(x+width,y+height);
//                     for(let i=1;i<=nw;i++){
//                          x1=x+width-r*i;
//                          y1=y+height;
//                         let cpx=x1+r/2;
//                         let cpy=y1+r/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x1,y1);
//                         ctx.lineTo(x1,y1);
//                     }
//                     if(width%r!=0){
//                         let r1=width-nw*r;
//                         let cpx=x1-r1/2;
//                         let cpy=y1+r/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x,y+height);
//                     }
//                break;
//             case 'left':
//                     //ctx.moveTo(x,y+height);
//                     for(let i=1;i<=nh;i++){
//                          x1=x;
//                          y1=y+height-i*r;
//                         let cpx=x1-r/2;
//                         let cpy=y1+r/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x1,y1);
//                        // ctx.lineTo(x1,y1);
//                     }
//                     if(height%r!=0){
//                         let r1=height-nh*r;
//                         let cpx=x1-r/2;
//                         let cpy=y1-r1/2;
//                         ctx.quadraticCurveTo(cpx,cpy,x,y);
//                     }
//                break;
//         }
//   }
var cloud = zrender.Path.extend({
    type: 'cloud',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
        var x = shape.x;
        var y = shape.y;
        var height = shape.height;
        var width = shape.width;
        // drawPoint(x,y,width,height,ctx,'top');
        // drawPoint(x,y,width,height,ctx,'right');
        // drawPoint(x,y,width,height,ctx,'bottom');
        // drawPoint(x,y,width,height,ctx,'left');
        var r=20;
        var nw=parseInt(width/r);
        var nh=parseInt(height/r);
        var x1;
        var y1;

       // switch(mark){
           // case 'top':
                ctx.moveTo(x,y);
                for(let i=1;i<=nw;i++){
                     x1=x+i*r;
                     y1=y;
                    let cpx=x1-r/2;
                    let cpy=y1-r/2;
                    ctx.quadraticCurveTo(cpx,cpy,x1,y1);
                   // ctx.lineTo(x1,y1);
                }
                if(width%r!=0){
                    let r1=width-nw*r;
                    let cpx=x1+r1/2;
                    let cpy=y-r/2;
                    ctx.quadraticCurveTo(cpx,cpy,x+width,y);
                }
              //  break;
         //   case 'right':
                    //ctx.moveTo(x+width,y);
                    for(let i=1;i<=nh;i++){
                         x1=x+width;
                         y1=y+i*r;
                        let cpx=x1+r/2;
                        let cpy=y1-r/2;
                        ctx.quadraticCurveTo(cpx,cpy,x1,y1);
                       // ctx.lineTo(x1,y1);
                    }
                    if(height%r!=0){
                        let r1=height-nh*r;
                        let cpx=x1+r/2;
                        let cpy=y1+r1/2;
                        ctx.quadraticCurveTo(cpx,cpy,x+width,y+height);
                    }
             //   break;
            //case 'bottom':
                 //   ctx.moveTo(x+width,y+height);
                    for(let i=1;i<=nw;i++){
                         x1=x+width-r*i;
                         y1=y+height;
                        let cpx=x1+r/2;
                        let cpy=y1+r/2;
                        ctx.quadraticCurveTo(cpx,cpy,x1,y1);
                        ctx.lineTo(x1,y1);
                    }
                    if(width%r!=0){
                        let r1=width-nw*r;
                        let cpx=x1-r1/2;
                        let cpy=y1+r/2;
                        ctx.quadraticCurveTo(cpx,cpy,x,y+height);
                    }
              // break;
           // case 'left':
                    //ctx.moveTo(x,y+height);
                    for(let i=1;i<=nh;i++){
                         x1=x;
                         y1=y+height-i*r;
                        let cpx=x1-r/2;
                        let cpy=y1+r/2;
                        ctx.quadraticCurveTo(cpx,cpy,x1,y1);
                       // ctx.lineTo(x1,y1);
                    }
                    if(height%r!=0){
                        let r1=height-nh*r;
                        let cpx=x1-r/2;
                        let cpy=y1-r1/2;
                        ctx.quadraticCurveTo(cpx,cpy,x,y);
                    }
             //  break;
       // }
        ctx.closePath();
    }
});

 class Cloud extends cloud{
        constructor(data){
            super(data);
            this.data=data;
            this.oldfill=this.data.style.fill;
            this.antchrs=[];
            this.nodeType="node";
            this.createAntchrs();
        }
       
        createAntchrs(){
            this.antchrs=[];
            var g=new zrender.Group();
            var box=g.getBoundingRect([this]);
            // let {x,y,width,height}=this.shape;
            // let p=this.position.slice();
            // var t={x:x+p[0]+width/2,y:y+p[1],index:1,node:this,direct:'top'};
            // var r={x:x+p[0]+width,y:y+p[1]+height/2,index:2,node:this,direct:'right'};
            // var b={x:x+p[0]+width/2,y:y+p[1]+height,index:3,node:this,direct:'bottom'};
            // var l={x:x+p[0],y:y+p[1]+height/2,index:4,node:this,direct:'left'};
            var t={x:box.x+box.width/2,y:box.y,index:1,node:this,direct:'top'};
            var r={x:box.x+box.width,y:box.y+box.height/2,index:2,node:this,direct:'right'};
            var b={x:box.x+box.width/2,y:box.y+box.height,index:3,node:this,direct:'bottom'};
            var l={x:box.x,y:box.y+box.height/2,index:4,node:this,direct:'left'};
            this.antchrs.push(t,r,b,l);
        }
}

mixin(common,Cloud.prototype)

export default Cloud;
 

