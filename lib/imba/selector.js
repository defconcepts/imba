(function(){
function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; }
ImbaSelector = imba$class(function ImbaSelector(sel,scope,nodes){
	this._query = (sel instanceof ImbaSelector) ? (sel.query()) : (sel);
	this._context = scope;
	
	if(nodes) {
		for(var i=0, ary=iter$(nodes), len=ary.length, res=[]; i < len; i++){
			res.push(tag$wrap(ary[i]));
		};
		this._nodes = res;
	};
	this._lazy = !nodes;
	return this;
});

ImbaSelector.prototype.__query = {};
ImbaSelector.prototype.query = function(v){ return this._query; }
ImbaSelector.prototype.setQuery = function(v){ this._query = v; return this; }
;

ImbaSelector.prototype.reload = function (){
	this._nodes = null;
	return this;
};
ImbaSelector.prototype.scope = function (){
	var ctx;
	if(this._scope) {
		return this._scope;
	};
	if(!(ctx = this._context)) {
		return global.document;
	};
	return this._scope = (ctx.toScope) ? (ctx.toScope()) : (ctx);
};
ImbaSelector.prototype.first = function (){
	return (this._lazy) ? (tag$wrap((this._first || (this._first = this.scope().querySelector(this.query()))))) : (this.nodes()[0]);
};
ImbaSelector.prototype.last = function (){
	return this.nodes()[this._nodes.length - 1];
};
ImbaSelector.prototype.nodes = function (){
	if(this._nodes) {
		return this._nodes;
	};
	var items = this.scope().querySelectorAll(this.query());
	for(var i=0, ary=iter$(items), len=ary.length, res=[]; i < len; i++){
		res.push(tag$wrap(ary[i]));
	};
	this._nodes = res;
	this._lazy = false;
	return this._nodes;
};
ImbaSelector.prototype.count = function (){
	return this.nodes().length;
};
ImbaSelector.prototype.len = function (){
	return this.nodes().length;
};
ImbaSelector.prototype.any = function (){
	return this.count();
};

ImbaSelector.prototype.at = function (idx){
	return this.nodes()[idx];
};
ImbaSelector.prototype.forEach = function (block){
	this.nodes().forEach(block);
	return this;
};
ImbaSelector.prototype.map = function (block){
	return this.nodes().map(block);
};
ImbaSelector.prototype.toArray = function (){
	return this.nodes();
};
ImbaSelector.prototype.closest = function (sel){
	this._nodes = this.map(function (node){
		return node.closest(sel);
	});
	return this;
};
ImbaSelector.prototype.siblings = function (sel){
	this._nodes = this.map(function (node){
		return node.siblings(sel);
	});
	return this;
};
ImbaSelector.prototype.find = function (sel){
	this._nodes = this.__query__(sel.query(),this.nodes());
	return this;
};
ImbaSelector.prototype.children = function (sel){
	return true;
};
ImbaSelector.prototype.has = function (){
	return true;
};
ImbaSelector.prototype.__union = function (){
	this.p("called ImbaSelector.__union");
	return this;
};
ImbaSelector.prototype.__intersect = function (){
	this.p("called ImbaSelector.__union");
	return this;
};
ImbaSelector.prototype.reject = function (blk){
	return this.filter(blk,false);
};
ImbaSelector.prototype.filter = function (blk,bool){
	if(bool === undefined) bool = true;
	var fn = (blk instanceof Function) && blk || (function (n){
		return n.matches(blk);
	});
	var ary = this.nodes().filter(function (n){
		return fn(n) == bool;
	});
	return new ImbaSelector("",this._scope,ary);
};
ImbaSelector.prototype.__query__ = function (query,contexts){
	var nodes, i, l;
	var nodes = [], i = 0, l = contexts.length;
	
	while(i < l){
		nodes.push.apply(nodes,contexts[i++].querySelectorAll(query));
	};
	return nodes;
};
ImbaSelector.prototype.__matches__ = function (){
	return true;
};
ImbaSelector.prototype.flag = function (flag){
	return this.forEach(function (n){
		return n.flag(flag);
	});
};
ImbaSelector.prototype.unflag = function (flag){
	return this.forEach(function (n){
		return n.unflag(flag);
	});
};
ImbaSelector.prototype.call = function (meth,args){
	var self=this;
	if(args === undefined) args = [];
	return self.forEach(function (n){
		var $1;
		return ((self.setFn(n[($1=meth)]), n[$1])) && (self.fn().apply(n,args));
	});
};
q$ = function (sel,scope){
	return new ImbaSelector(sel,scope);
};

q$$ = function (sel,scope){
	var el = (scope || global.document).querySelector(sel);
	return el && tag$wrap(el) || null;
};
IMBA_TAGS.element.prototype.querySelectorAll = function (q){
	return this._dom.querySelectorAll(q);
};
IMBA_TAGS.element.prototype.querySelector = function (q){
	return this._dom.querySelector(q);
};
IMBA_TAGS.element.prototype.find = function (sel){
	return new ImbaSelector(sel,this);
};
}())