export default {
    getAnchors() {
        return this.anchors.slice();
    },
    getAnchorByIndex(index) {
        return this.anchors.filter(item => item.index == index)[0];
    },
    active() {
        this.selected = true;
        this.attr({
            style:{
                shadowColor:'yellow',
                shadowBlur:3
            }
        })
    },
    unactive() {
        this.selected = false;
        this.attr({
            style:{
                shadowColor:'',
                shadowBlur:0
            }
        })
    },

    refreshEdge() {
        this.createAnchors();
        this.anch && this.anch.refresh();
        this.__zr&&this.__zr.trigger('refreshEdge', { node: this });
    }
}