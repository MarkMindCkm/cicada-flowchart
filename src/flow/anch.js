import zrender from 'zrender';

class Anch {
    constructor(node) {
        this.node = node;
        this.bars = [];
        this.create();
    }
    create() {
        var points = this.node.getAnchors();
        points.forEach(p => {
            var circle = new zrender.Circle({
                style: {
                    fill: '#fff',
                    stroke: 'rgb(0,181,237)',
                    lineWidth: 1
                },
                shape: {
                    cx: p.x,
                    cy: p.y,
                    r: 3
                },
                cursor: 'crosshair',
                z: 30001
            });
            circle.point = p;
            circle.mark = 'anch';
            circle.node = this.node;
            p.anch=circle;
            circle.on('mouseover', () => {
                circle.oldfill = circle.style.fill;
                circle.setStyle('fill', 'rgb(0,181,237)');
                this.node.time && clearTimeout(this.node.time);
                this.show();
            });
            circle.on('mouseout', () => {
                circle.setStyle('fill', circle.oldfill);
                this.hide();
            });
            circle.on('mousedown', () => {
                circle.setStyle('fill', 'rgb(0,181,237)');
            });
            
            this.bars.push(circle);
        });
    }
    getBarByIndex(index){
        return this.bars.filter(bar=>{return bar.point.index==index})[0]
    }
    show() {
        this.bars.forEach(b => {
            b.show();
        });
    }
    hide() {
        this.bars.forEach(b => {
            b.hide()
        });
    }
    refresh() {
        this.bars.forEach(bar => {
            var p = this.node.getAnchorByIndex(bar.point.index);
            bar.attr({
                shape: {
                    cx: p.x,
                    cy: p.y
                }
            });
            bar.point = p;
        });

    }
}

export default Anch;