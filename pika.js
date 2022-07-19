var Pika = function(posObj) {	
	// properties
	this.domObj = null;
	this.actionObj = null;
	this.points = null;
	this.dead = false;	
	
	// constructor create dom object in memory
	
	var _this = this,
			ctr = document.createElement('div'),
			pika = document.createElement('div'),
			div = document.createElement('div');
	// set classes
	ctr.className = 'ctr';
	pika.className = 'pika';
	div.className = '';
	// innermost element set events
	div.addEventListener('click',function() {
		if(!_this.dead) {			
			_this.dead = true;
			//console.log('clicked event points=',_this.points);		
			_this.actionObj.className += " dead";				
			document.dispatchEvent(new CustomEvent('whack', { 'detail': _this.points }));
		}
	});
	div.addEventListener("animationend",function() {
		//console.log('end animation');
		_this.actionObj.offsetWidth = _this.actionObj.offsetWidth;
		_this.actionObj.className = '';
		_this.dead = false;
	});
	// append elemnts to parents
	pika.appendChild(div);
	ctr.appendChild(pika);
	// set dom properies for later reference
	this.domObj = ctr;
	this.actionObj = div
	// set position
	this.setPikaPos(posObj);
}

Pika.prototype = {
	
	getDomObj: function() {
		return this.domObj;
	},	
	setPikaPos: function(posObj) {
		this.domObj.style.top = posObj.y + 'px';
		this.domObj.style.left = posObj.x + 'px';				
	},
	setPikaAction: function(o) {
		//console.log('setPikaAction',o,'\nclassName=',this.actionObj.className);
		if(this.actionObj.className=='') {
			//console.log(this.actionObj);
			this.actionObj.className = o.t; 
			this.points = o.p;
		}
	}	
}