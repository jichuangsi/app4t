(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b82499c6"],{"0787":function(t,i,s){"use strict";var e=s("fc18"),n=s.n(e);n.a},3234:function(t,i,s){},"599d":function(t,i,s){"use strict";var e=s("3234"),n=s.n(e);n.a},9648:function(t,i,s){"use strict";s.r(i);var e=function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"Wrong"},[s("div",{staticClass:"top"},[s("div",{staticClass:"nav"},[s("i",{staticClass:"iconfont icon-icon-arrow-left2",on:{click:t.back}}),s("div",{staticClass:"text"},[t._v(t._s(t.msg))])])]),s("div",{staticClass:"center"},[s("div",{staticClass:"one"},[t._v("时间分类")]),s("div",{staticClass:"two",on:{click:function(i){t.timeshow=!t.timeshow}}},[t._v(t._s(t.time)+"\n        "),s("span"),s("ul",{class:{ulheight:t.timeshow}},t._l(t.timenav,function(i,e){return s("li",{key:e,on:{click:function(s){s.stopPropagation(),t.timeclick(i,e)}}},[t._v(t._s(i))])}))]),s("div",{staticClass:"one"},[t._v("错题详情")]),t._l(t.topicList,function(i,e){return s("div",{key:e,staticClass:"class_topic_warp"},["objective"===i.quesetionType?s("div",{staticClass:"objective_warp"},[s("div",{staticClass:"topic",domProps:{innerHTML:t._s(i.questionContent)}},[t._v("\n            "+t._s(i.questionContent)+"\n          ")]),t._l(i.options,function(e,n){return 1==i.answer.length?s("div",{key:n,staticClass:"select clearfix"},[s("div",{staticClass:"round"},[i.answerForStudent.answerForObjective===t.conversion(n)?s("span",{staticClass:"point"}):t._e()]),s("div",{staticClass:"option"},[t._v(t._s(t.conversion(n))+".")]),s("div",{staticClass:"text",domProps:{innerHTML:t._s(e)}},[t._v(t._s(e))])]):t._e()}),t._l(i.options,function(e,n){return i.answer.length>1?s("div",{key:n,staticClass:"select clearfix"},[s("div",{staticClass:"round"},t._l(i.answerForStudent.answerForObjective.split("|"),function(i,e){return i===t.conversion(n)?s("span",{key:e,staticClass:"point"}):t._e()})),s("div",{staticClass:"option"},[t._v(t._s(t.conversion(n))+".")]),s("div",{staticClass:"text",domProps:{innerHTML:t._s(e)}},[t._v(t._s(e))])]):t._e()}),s("PopupPic",{attrs:{questionPic:i.questionPic}}),s("div",{staticClass:"anwers"},[t._v("\n            正确答案:"),s("span",{domProps:{innerHTML:t._s(i.answer.split("|").join(","))}})]),s("div",{staticClass:"remindbtn clearfix"},[s("span",{on:{click:function(i){t.remindclick(e)}}},[t._v("答案解析")])]),i.parse&&t.remindshow&&t.remindid==e?s("div",{staticClass:"remind",domProps:{innerHTML:t._s(i.parse)}}):t._e(),!i.parse&&t.remindshow&&t.remindid==e?s("div",{staticClass:"remind"},[t._v("\n            此题没有解析\n          ")]):t._e(),s("div",{staticClass:"raising",on:{click:function(s){t.raising(i.questionId)}}},[t._v("智能推题")])],2):t._e()])})],2)])},n=[],a=(s("ac6a"),s("96cf"),s("1da1")),o=s("be94"),c=s("399a"),r=s("a07d"),u=s("2f62"),d={name:"Wrong",components:{PopupPic:r["a"]},data:function(){return{msg:"",remindshow:!1,remindid:"",time:"全部",timeshow:!1,timenav:["全部","一周前错题","一月前错题"],topicList:[],objectiveAnswer:[]}},computed:Object(o["a"])({},Object(u["b"])(["incKnowledgeId","incKnowledge","incQuestions"])),mounted:function(){this.msg=this.$route.query.msgtext,this.listQuestions()},methods:{listQuestions:function(){var t=Object(a["a"])(regeneratorRuntime.mark(function t(){var i,s,e,n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:console.log(this.incKnowledgeId),console.log(this.incKnowledge),console.log(this.incQuestions),i=this,i.topicList=this.incQuestions,s=0;case 6:if(!(s<i.topicList.length)){t.next=18;break}if(e=i.topicList[s],"FINISH"!==e.questionStatus){t.next=15;break}if("subjective"!==e.quesetionType){t.next=15;break}if(!e.answerForStudent&&!e.answerForTeacher){t.next=15;break}return t.next=13,Object(c["g"])(e.answerForTeacher?e.answerForTeacher.stubForSubjective:e.answerForStudent.stubForSubjective);case 13:n=t.sent,n.data.data&&i.objectiveAnswer.push({id:e.questionId,answer:n.data.data.content});case 15:s++,t.next=6;break;case 18:case"end":return t.stop()}},t,this)}));function i(){return t.apply(this,arguments)}return i}(),back:function(){this.$router.go(-1)},conversion:function(t){var i=65+t;return String.fromCharCode(i)},remindclick:function(t){this.remindid==t?this.remindshow=!this.remindshow:(this.remindid=t,this.remindshow=!0)},raising:function(t){this.$router.push({path:"@/pages/student/statistics/raising",name:"raising",query:{msg:this.msg,questionId:t}})},timeclick:function(t,i){var s=this;if(this.timeshow=!1,this.time!==t){this.time=t,this.topicList=[];var e=(new Date).getTime();if(1===i){var n=e-6048e5;this.incQuestions.forEach(function(t,i){t.answerForStudent.createTime>=n&&s.topicList.push(t)})}else if(2===i){var a=e-2592e6;this.incQuestions.forEach(function(t,i){t.answerForStudent.createTime>=a&&s.topicList.push(t)})}else this.topicList=this.incQuestions}}}},l=d,h=(s("599d"),s("2877")),m=Object(h["a"])(l,e,n,!1,null,"bb82e1f0",null);m.options.__file="Wrong.vue";i["default"]=m.exports},a07d:function(t,i,s){"use strict";var e=function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"popupPic"},[t.questionPic?s("div",{staticClass:"remind",on:{click:function(i){i.stopPropagation(),t.picimg(t.questionPic)}}},[t._v("\n    （点开查看图片）\n  ")]):t._e(),t.dsadsa?s("div",{staticClass:"bigimg"},[s("div",{staticClass:"btn",on:{click:function(i){return i.stopPropagation(),t.picimgshow(i)}}},[t._v("x")]),s("img",{class:{imgwidth:t.imgwidth,imgheight:t.imgheight},attrs:{src:t.bigimg,alt:""}})]):t._e()])},n=[],a=(s("a481"),s("399a")),o={name:"PopupPic",props:{questionPic:{type:String,default:null}},data:function(){return{bigimg:"",dsadsa:!1,imgwidth:!1,imgheight:!1}},mounted:function(){this.ifimg()},methods:{ifimg:function(){if(this.bigimg){var t=new Image;t.src=this.bigimg,t.width>t.height?(this.imgwidth=!0,this.imgheight=!1):(this.imgwidth=!1,this.imgheight=!0)}},picimgshow:function(){var t=this;t.dsadsa=!1},picimg:function(t){var i=this,s=this;console.log(123),s.dsadsa=!0,""===this.bigimg&&Object(a["f"])(t).then(function(t){s.bigimg="data:image/png;base64,"+t.data.data.content.replace(",",""),i.ifimg()})}}},c=o,r=(s("0787"),s("2877")),u=Object(r["a"])(c,e,n,!1,null,"4c1d121d",null);u.options.__file="PopupPic.vue";i["a"]=u.exports},ac6a:function(t,i,s){for(var e=s("cadf"),n=s("0d58"),a=s("2aba"),o=s("7726"),c=s("32e9"),r=s("84f2"),u=s("2b4c"),d=u("iterator"),l=u("toStringTag"),h=r.Array,m={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=n(m),g=0;g<p.length;g++){var v,f=p[g],w=m[f],_=o[f],b=_&&_.prototype;if(b&&(b[d]||c(b,d,h),b[l]||c(b,l,f),r[f]=h,w))for(v in e)b[v]||a(b,v,e[v],!0)}},fc18:function(t,i,s){}}]);