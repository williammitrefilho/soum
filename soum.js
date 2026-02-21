const parser = new DOMParser()
Object.defineProperty(HTMLSpanElement.prototype, "innerText", {
	set:function(newValue){
		this.innerHTML = newValue
		this.hasChanged(newValue)
	},
})

Element.prototype.hasChanged = function(){
}

class Soum{
	static documentChanged(element){
		console.log(element, "has changed")
	}
	static removeAllFrom(element){
		while(element.childNodes.length > 0)
			element.removeChild(element.childNodes[0])
	}
	static newId(){
		return `o${++Soum.counter}`
	}
	constructor(value, soumId = Soum.newId()){
		this.value = value
		this.soumId = soumId
	}
}

Soum.counter = 0

class SoumElement{

	constructor(name, soumId = Soum.newId()){
		this._element = document.createElement(name)
		this._element.setAttribute("id", soumId)
		this.soumId = soumId
	}

	redraw(){
		if(this.element.parentNode)
			this.outerHTML = this.outerHTML
	}
	append(element){
		this.element.appendChild(element)
		element.outerHTML += ""
	}
	appendTo(element){
		element.appendChild(this.element)
		this.element.outerHTML += ""
		return this
	}
	get element(){
		let element = document.getElementById(this._soumId)
		if(element)
			return element

		return this._element
	}
	set soumId(soumId){
		this._soumId = soumId
		this.element.setAttribute("id", soumId)
	}
}


class SoumSVG extends SoumElement{
	constructor(w = "400", h = "400", soumId = Soum.newId()){
		super("svg", soumId)
		this.x = 0
		this.y = 0
		this.h = h
		this.w = w
	}
	set x(x){
		this._x = x
		this.element.setAttribute("viewBox", this.viewBox)
	}
	set y(y){
		this._y = y
		this.element.setAttribute("viewBox", this.viewBox)
	}
	set w(w){
		this._w = w
		this.element.setAttribute("viewBox", this.viewBox)
	}
	set h(h){
		this._h = h
		this.element.setAttribute("viewBox", this.viewBox)
	}
	get viewBox(){
		return `${this._x} ${this._y} ${this._w} ${this._h}`
	}
}
		
class SoumGraphic extends SoumElement{

	set(name, value){
		this.element.style.setProperty(name, value)
	}
	unset(name){
		this.element.style.removeProperty(name)
	}
	set stroke(stroke){
		this.set("stroke", stroke)
	}
	set fill(fill){
		this.set("fill", fill)
	}
	set x(x){
		this.set("x", x)
	}
	set y(y){
		this.set("y", y)
	}
}


class SoumCircle extends SoumGraphic{

	constructor(x = 50, y = 50, r = 7, soumId = Soum.newId()){
		super("circle", soumId)
		this.x = x
		this.y = y
		this.r = r
		this.text = Soum.text("C", x, y)
	}
	set x(x){
		this.set("cx", x)
	}
	set y(y){
		this.set("cy", y)
	}
	set r(r){
		this.set("r", r)
	}
	set value(value){
		this.text.value = value
	}
}

class SoumText extends SoumGraphic{

	constructor(text, x = 50, y = 50, soumId = soumId.newId()){
		super("text", soumId)
		this.x = x
		this.y = y
		this.value = text
	}
	set value(text){
		this.element.innerText = text
	}
	get value(){
		return this.element.innerText
	}
}

Soum.el = (name, soumId = Soum.newId)=>{
	return new SoumElement(name, soumId)
}
Soum.svg = (w = "400", h = "400", soumId = Soum.newId()) => {
	return new SoumSVG(w, h, soumId)
}
Soum.circle = (x = 50, y = 50, r = 7, soumId = Soum.newId())=>{
	return new SoumCircle(x, y, r, soumId)
}
Soum.text = (text, x = 50, y = 50, soumId = Soum.newId())=>{
	return new SoumText(text, x, y, soumId)
}
Soum.a = (name, ...rest)=>{
	let soum = Soum[name](rest[0], rest[1], rest[2], rest[3])
	soum.in = soum.appendTo
	return soum
}
