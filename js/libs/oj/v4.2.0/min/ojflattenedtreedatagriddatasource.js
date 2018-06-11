/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojdatasource-common","ojs/ojrowexpander"],function(a){a.Ej=function(g,c,b,d,e){a.C.GM(b);this.$d=g;this.Zh=c;this.xX=b;this.Zc=d;this.Da=e};o_("FlattenedTreeHeaderSet",a.Ej,a);a.Ej.prototype.getData=function(g,c){var b;a.C.assert(g<=this.Zh&&g>=this.$d,"index out of bounds");a.C.assert(null==c||0==c,"level out of bounds");return null!=this.Da&&null!=this.Zc?(b=this.Zc.getData(g-this.$d+this.Zc.getStart()),null!=b?b.get?b.get(this.Da):b[this.Da]:null):this.xX[g]};
a.f.j("FlattenedTreeHeaderSet.prototype.getData",{getData:a.Ej.prototype.getData});a.Ej.prototype.getMetadata=function(g,c){a.C.assert(g<=this.Zh&&g>=this.$d,"index out of bounds");a.C.assert(null==c||0==c,"level out of bounds");return null!=this.Da&&null!=this.Zc?this.Zc.getMetadata(g-this.$d+this.Zc.getStart()):{key:this.getData(g)}};a.f.j("FlattenedTreeHeaderSet.prototype.getMetadata",{getMetadata:a.Ej.prototype.getMetadata});a.Ej.prototype.getCount=function(){return null!=this.Da&&null!=this.Zc?
Math.min(this.Zc.getCount(),this.Zh-this.$d):Math.max(0,this.Zh-this.$d)};a.f.j("FlattenedTreeHeaderSet.prototype.getCount",{getCount:a.Ej.prototype.getCount});a.Ej.prototype.getLevelCount=function(){return 0<this.getCount()?1:0};a.f.j("FlattenedTreeHeaderSet.prototype.getLevelCount",{getLevelCount:a.Ej.prototype.getLevelCount});a.Ej.prototype.getExtent=function(g,c){a.C.assert(g<=this.Zh&&g>=this.$d,"index out of bounds");a.C.assert(null==c||0==c,"level out of bounds");return{extent:1,more:{before:!1,
after:!1}}};a.f.j("FlattenedTreeHeaderSet.prototype.getExtent",{getExtent:a.Ej.prototype.getExtent});a.Ej.prototype.getDepth=function(g,c){a.C.assert(g<=this.Zh&&g>=this.$d,"index out of bounds");a.C.assert(null==c||0==c,"level out of bounds");return 1};a.f.j("FlattenedTreeHeaderSet.prototype.getDepth",{getDepth:a.Ej.prototype.getDepth});a.Hl=function(g,c,b,d,e,f){a.C.GM(f);this.Za=g;this.Ra=c;this.Rs=b;this.aC=d;this.Zc=e;this.yh=f};o_("FlattenedTreeCellSet",a.Hl,a);a.Hl.prototype.getData=function(g){var c,
b,d,e;c=this.Uma(g);if(null==c)return null;g=c[0];c=c[1];a.C.assert(g<this.Zc.getStart()+this.Zc.getCount()&&c<this.yh.length);b=this.yh[c];d=this.Zc.getData(g);return null!=d?(g={},c=d.get?function(){return d.get(b)}:function(){return d[b]},e=d.set?function(a){return d.set(b,a)}:function(a){d[b]=a},Object.defineProperty(g,"data",{enumerable:!0,get:c,set:e}),g):null};a.f.j("FlattenedTreeCellSet.prototype.getData",{getData:a.Hl.prototype.getData});a.Hl.prototype.getMetadata=function(g){var c;c=this.Uma(g);
if(null==c)return null;g=c[0];c=c[1];a.C.assert(g<this.Zc.getStart()+this.Zc.getCount()&&c<this.yh.length);c=this.yh[c];g=this.Zc.getMetadata(g);g.keys={row:g.key,column:c};return g};a.f.j("FlattenedTreeCellSet.prototype.getMetadata",{getMetadata:a.Hl.prototype.getMetadata});a.Hl.prototype.Uma=function(g){var c;a.C.jk(g);if(null==this.Zc||0==this.Zc.length)return null;c=g.row-this.Za+this.Zc.getStart();g=g.column;a.C.Uu(c,null);a.C.Uu(g,null);a.C.assert(0<=c&&0<=g);return[c,g]};a.Hl.prototype.getStart=
function(a){return"row"===a?this.Za:"column"===a?this.Rs:0};a.f.j("FlattenedTreeCellSet.prototype.getStart",{getStart:a.Hl.prototype.getStart});a.Hl.prototype.getCount=function(a){return"row"===a?Math.min(this.Ra-this.Za,this.Zc.getCount()):"column"===a?this.aC-this.Rs:0};a.f.j("FlattenedTreeCellSet.prototype.getCount",{getCount:a.Hl.prototype.getCount});a.Hl.prototype.getExtent=function(){return{row:{extent:1,more:{before:!1,after:!1}},column:{extent:1,more:{before:!1,after:!1}}}};a.f.j("FlattenedTreeCellSet.prototype.getExtent",
{getExtent:a.Hl.prototype.getExtent});a.Zb=function(g,c){a.Zb.N.constructor.call(this,g,c)};o_("FlattenedTreeDataGridDataSource",a.Zb,a);a.f.ua(a.Zb,a.Fa,"oj.FlattenedTreeDataGridDataSource");a.Zb.prototype.Init=function(){a.Zb.N.Init.call(this);this.yh=a.Zb.N.dN.call(this,"columns");this.Da=a.Zb.N.dN.call(this,"rowHeader")};a.f.j("FlattenedTreeDataGridDataSource.prototype.Init",{Init:a.Zb.prototype.Init});a.Zb.prototype.getCountPrecision=function(a){return"row"===a?"estimate":"actual"};a.f.j("FlattenedTreeDataGridDataSource.prototype.getCountPrecision",
{getCountPrecision:a.Zb.prototype.getCountPrecision});a.Zb.prototype.getCount=function(a){return"row"===a?-1:"column"===a?this.yh.length:0};a.f.j("FlattenedTreeDataGridDataSource.prototype.getCount",{getCount:a.Zb.prototype.getCount});a.Zb.prototype.fetchHeaders=function(g,c,b){var d,e;d=g.axis;if("column"===d)d=g.start+g.count,d>this.getCount("column")&&(d=this.getCount("column")-g.start),e=new a.Ej(g.start,d,this.yh);else if("row"===d&&null!=this.Da){this.Os={range:g,callbacks:c,callbackObjects:b};
return}null!=c&&null!=c.success&&(null==b&&(b={}),c.success.call(b.success,e,g,null))};a.f.j("FlattenedTreeDataGridDataSource.prototype.fetchHeaders",{fetchHeaders:a.Zb.prototype.fetchHeaders});a.Zb.prototype.fetchCells=function(g,c,b){var d,e,f,h;for(d=0;d<g.length;d++)if(e=g[d],"row"==e.axis){f=e.start;h=e.count;break}a.Zb.N.fv.call(this,{start:f,count:h},{success:function(a){this.V4(a,g,c,b,0)}.bind(this),error:function(a){this.TQa(a,{start:f,count:h},c,b)}.bind(this)})};a.f.j("FlattenedTreeDataGridDataSource.prototype.fetchCells",
{fetchCells:a.Zb.prototype.fetchCells});a.Zb.prototype.keys=function(g){var c,b;c=g.row;b=g.column;return new Promise(function(d){c>a.Zb.N.I2a.call(this).end||b>this.yh.length?d(null):d({row:a.Zb.N.getKey.call(this,c),column:this.yh[b]})}.bind(this))};a.f.j("FlattenedTreeDataGridDataSource.prototype.keys",{keys:a.Zb.prototype.keys});a.Zb.prototype.indexes=function(g){var c,b,d,e,f;d=g.row;e=g.column;return new Promise(function(g){c=a.Zb.N.Kn.call(this,d);for(f=0;f<this.yh.length;f++)if(this.yh[f]===
e){b=f;break}0<=c||0<=b?g({row:c,column:b}):g(null)}.bind(this))};a.f.j("FlattenedTreeDataGridDataSource.prototype.indexes",{indexes:a.Zb.prototype.indexes});a.Zb.prototype.sort=function(g,c,b){return a.Zb.N.getWrappedDataSource.call(this).sort(g,{success:function(){this.k5(c,b)}.bind(this),error:c.error})};a.f.j("FlattenedTreeDataGridDataSource.prototype.sort",{sort:a.Zb.prototype.sort});a.Zb.prototype.k5=function(a,c){this.refresh();a.success&&(null==c&&(c={}),a.success.call(c.success))};a.Zb.prototype.move=
function(g,c,b,d){a.Zb.N.getWrappedDataSource.call(this).move(g,c,b,d)};a.f.j("FlattenedTreeDataGridDataSource.prototype.move",{move:a.Zb.prototype.move});a.Zb.prototype.getCapability=function(g){return"default"===a.Zb.N.getWrappedDataSource.call(this).getCapability(g)?"column":"none"};a.f.j("FlattenedTreeDataGridDataSource.prototype.getCapability",{getCapability:a.Zb.prototype.getCapability});a.Zb.prototype.UB=function(g,c){a.Zb.N.UB.call(this,g,c)};a.Zb.prototype.V4=function(g,c,b,d){var e,f,h,
k,l,m;for(e=0;e<c.length;e++)f=c[e],"row"==f.axis?(h=f.start,k=f.count):"column"==f.axis&&(l=f.start,m=f.count,l+m>this.getCount("column")&&(m=this.getCount("column")-l));this.Os&&(e=this.Os.range,e.start==h&&e.count==k&&(this.e5(g,e,this.Os.callbacks,this.Os.callbackObjects),this.Os=null));g=new a.Hl(h,h+k,l,l+m,g,this.yh);b.success&&(null==d&&(d={}),b.success.call(d.success,g,c))};a.Zb.prototype.TQa=function(a,c,b,d){var e;this.Os&&(e=this.Os.range,e.start==c.start&&e.count==c.count&&(c=this.Os.callbacks,
e=this.Os.callbackObjects,c.error&&(null==e&&(e={}),c.error.call(e.error,a))),this.Os=null);b.error&&(null==d&&(d={}),b.success.call(d.error,a))};a.Zb.prototype.e5=function(g,c,b,d){g=new a.Ej(c.start,c.start+c.count,this.yh,g,this.Da);b.success&&(null==d&&(d={}),b.success.call(d.success,g,c,null))};a.Zb.prototype.YW=function(g,c,b){var d,e,f,h;d=null;this.Da&&(d=new a.Ej(g,g+b.getCount(),this.yh,b,this.Da));c=new a.Hl(g,g+b.getCount(),0,this.yh.length,b,this.yh);f=[];h=[];for(e=0;e<b.getCount();e++)f.push({row:this.Zl(g+
e).key}),h.push({row:g+e,column:-1});g={source:this,operation:"insert"};g.result=c;d&&(g.header=d);g.keys=f;g.indexes=h;a.Zb.N.handleEvent.call(this,"change",g)};a.Zb.prototype.ZX=function(g){var c,b,d;c=[];d=[];for(b=0;b<g.length;b++)c.push({row:g[b].key}),d.push({row:g[b].index,column:-1});g={source:this,operation:"delete"};g.keys=c;g.indexes=d;a.Zb.N.handleEvent.call(this,"change",g)};a.Zb.prototype.W$=function(g,c){c.success.call(null,new a.Dj(null,g.start))}});