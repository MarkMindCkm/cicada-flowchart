import zrender from 'zrender'

var PolyLine = zrender.Path.extend({
    type: 'polyLine',
    shape: {
        points:[]
    },
    style:{
        fill: null
    },
    buildPath: function (ctx, shape) {
        var points = shape.points;
        if (points && points.length >= 2) {
            ctx.moveTo(points[0][0], points[0][1]);
            for (var i = 1, l = points.length; i < l; i++) {
               ctx.lineTo(points[i][0], points[i][1]);
            }
        }
       return;
    }
});



export default PolyLine;