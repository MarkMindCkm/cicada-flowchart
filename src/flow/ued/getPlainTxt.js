/**
* 得到编辑器的纯文本内容，但会保留段落格式
* @name getPlainTxt
* @grammar editor.getPlainTxt()  => String
*/
import browser from './browser';
import dtd from './dtd';


function htmlStr(str) {
    return str ? str.replace(/&((g|l|quo)t|amp|#39);/g, function (m) {
        return {
            '&lt;':'<',
            '&amp;':'&',
            '&quot;':'"',
            '&gt;':'>',
            '&#39;':"'"
        }[m]
    }) : '';
}

var fillChar = browser().ie && browser().version == '6' ? '\ufeff' : '\u200B';

var getPlainTxt = function (innerHTML) {
        var reg = new RegExp(fillChar, 'g'),
        html = innerHTML.replace(/[\n\r]/g, '');//ie要先去了\n在处理
        html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
                .replace(/<br\/?>/gi, '\n')
                .replace(/<[^>/]+>/g, '')
                .replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
                    return dtd().$block[c] ? '\n' : b ? b : '';
                });
    //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
    return htmlStr(html.replace(reg, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' '));
}

export default getPlainTxt;