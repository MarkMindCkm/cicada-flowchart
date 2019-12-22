function mixin(fatherObj, childObj) {
    for (var key in fatherObj) {
        if (!(key in childObj)) {
            childObj[key] = fatherObj[key]
        }
    }
    return childObj
} 

export default mixin;
