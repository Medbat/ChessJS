# ECMASCript versions 5 and 6 comparison

##Constants
Referred object is still mutable

Chrome 52,Opera 39,Firefox 48,Edge 14 - Fully supported
Internet Explorer 11 - Partially supported
###ES6
	const PI = 3.141593a
###ES5
	// Only with ES5 and global context
	Object.defineProperty(typeof global === "object" ? global : window, "PI", {
	    value:        3.141593,
	    enumerable:   true,
	    writable:     false,
	    configurable: false
	})

##Block-scoped
Variables, functions and constants without hoisting

Chrome 52,Opera 39,Edge 14 - Fully supported
Internet Explorer 11,Firefox 48 - Partially supported
###ES6
	var a = 1;
	{
		let a = 2;
		console.log(a); // 2
	}
	console.log(a); // 1
	
    function foo () { return 1 }
    foo() === 1
    {
        function foo () { return 2 }
        foo() === 2
    }
    foo() === 1
###ES5
	var a = 1;
	{
		var a = 2
		console.log(a); // 2
	}
	console.log(a); // 2
	
	//  ES5 only, emulation
	(function () 
	{
	    var foo = function () { return 1; }
	    foo() === 1;
	    (function () {
	        var foo = function () { return 2; }
	        foo() === 2;
	    })();
	    foo() === 1;
	})();
	
##Arrow functions (lambda expressions)
Simpler and 
More expressive closure syntax, more intuitive handling of current object context

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	odds  = evens.map(v => v + 1);
	
	this.nums.forEach((v) => 
		{
    		if (v % 5 === 0)
	    	    this.fives.push(v);
		});
###ES5
	odds  = evens.map(function (v) { return v + 1; });
	
	//  1
	var self = this;
	this.nums.forEach(function (v) 
	{
	    if (v % 5 === 0)
	        self.fives.push(v);
	});

	//  2,  since ES 5.1 only
	this.nums.forEach(function (v) 
	{
	    if (v % 5 === 0)
	        this.fives.push(v);
	}.bind(this));

##Extended parameters handling
Default parameters, parameters aggregation

Chrome 52,Opera 39,Edge 14 - Fully supported
Firefox 48 - Partially supported
Internet Explorer 11 - Not supported
###ES6
	function f (x, y = 7, z = 42) 
	{
	    return x + y + z
	}
	f(1) === 50
	
	function f (x, y, ...a) 
	{
	    return (x + y) * a.length
	}
	f(1, 2, "hello", true, 7) === 9
###ES5
	function f (x, y, z) 
	{
	    if (y === undefined)
	        y = 7;
	    if (z === undefined)
	        z = 42;
	    return x + y + z;
	};
	f(1) === 50;
	
	function f (x, y) 
	{
		var a = Array.prototype.slice.call(arguments, 2);
		return (x + y) * a.length;
	};
	f(1, 2, "hello", true, 7) === 9;
	
##Spread operator

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var params = [ "hello", true, 7 ]
	var other = [ 1, 2, ...params ] // [ 1, 2, "hello", true, 7 ]
	f(1, 2, ...params) === 9

	var str = "foo"
	var chars = [ ...str ] // [ "f", "o", "o" ]
###ES5
	var params = [ "hello", true, 7 ];
	var other = [ 1, 2 ].concat(params); // [ 1, 2, "hello", true, 7 ]
	f.apply(undefined, [ 1, 2 ].concat(params)) === 9;

	var str = "foo";
	var chars = str.split(""); // [ "f", "o", "o" ]
	
##String interpolation

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var customer = { name: "Foo" }
	var card = { amount: 7, product: "Bar", unitprice: 42 }
	message = `Hello ${customer.name},
	want to buy ${card.amount} ${card.product} for
	a total of ${card.amount * card.unitprice} bucks?`
###ES5
	var customer = { name: "Foo" };
	var card = { amount: 7, product: "Bar", unitprice: 42 };
	message = "Hello " + customer.name + ",\n" +
	"want to buy " + card.amount + " " + card.product + " for\n" +
	"a total of " + (card.amount * card.unitprice) + " bucks?";
	
##Custom interpolation

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	get`http://example.com/foo?bar=${bar + baz}&quux=${quux}`
###ES5
	get([ "http://example.com/foo?bar=", "&quux=", "" ],bar + baz, quux);
	
##Raw strings
###ES6
	function tag(strings, ...values) {
	  return strings.raw[0];
	}

	tag`string text line 1 \n string text line 2`;
	// "string text line 1 \\n string text line 2"
	
###ES5
	// no equivalent
	
##Binary/octal literals
Direct support for safe binary and octal literals

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	0b111110111 === 503
	0o767 === 503
###ES5
	parseInt("111110111", 2) === 503;
	parseInt("767", 8) === 503;
	0767 === 503; // only in non-strict, backward compatibility mode
	
##Unicode String & RegExp Literal
Extended support using Unicode within strings and regular expressions.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	"𠮷".length === 2
	"𠮷".match(/./u)[0].length === 2
	5| "𠮷" === "\uD842\uDFB7"
	"𠮷" === "\u{20BB7}"
	"𠮷".codePointAt(0) == 0x20BB7
	for (let codepoint of "𠮷") console.log(codepoint)
###ES5
	"𠮷".length === 2;
	"𠮷".match(/(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF][\uD800-\uDBFF][\uDC00-\uDFFF][\uD800-\uDBFF](?![\uDC00-\uDFFF])(?:[^\uD800-\uDBFF]^)[\uDC00-\uDFFF])/)[0].length === 2;
	"𠮷" === "\uD842\uDFB7";
	//  no equivalent in ES5
	//  no equivalent in ES5
	//  no equivalent in ES5
	
##Regular Expression Sticky Matching
Keep the matching position sticky between matches and this way support efficient parsing of arbitrary long input strings, even with an arbitrary number of distinct regular expressions.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	let parser = (input, match) => {
		for (let pos = 0, lastPos = input.length; pos < lastPos; ) {
			for (let i = 0; i < match.length; i++) {
				match[i].pattern.lastIndex = pos
				let found
				if ((found = match[i].pattern.exec(input)) !== null) {
					match[i].action(found)
					pos = match[i].pattern.lastIndex
					break
				}
			}
		}
	}

	let report = (match) => {
		console.log(JSON.stringify(match))
	}
	parser("Foo 1 Bar 7 Baz 42", [
		{ pattern: /^Foo\s+(\d+)/y, action: (match) => report(match) },
		{ pattern: /^Bar\s+(\d+)/y, action: (match) => report(match) },
		{ pattern: /^Baz\s+(\d+)/y, action: (match) => report(match) },
		{ pattern: /^\s*/y,         action: (match) => {}            }
	])
###ES5
	var parser = function (input, match) {
		for (var i, found, inputTmp = input; inputTmp !== ""; ) {
			for (i = 0; i < match.length; i++) {
				if ((found = match[i].pattern.exec(inputTmp)) !== null) {
					match[i].action(found);
					inputTmp = inputTmp.substr(found[0].length);
					break;
				}
			}
		}
	}

	var report = function (match) {
		console.log(JSON.stringify(match));
	};
	parser("Foo 1 Bar 7 Baz 42", [
		{ pattern: /^Foo\s+(\d+)/, action: function (match) { report(match); } },
		{ pattern: /^Bar\s+(\d+)/, action: function (match) { report(match); } },
		{ pattern: /^Baz\s+(\d+)/, action: function (match) { report(match); } },
		{ pattern: /^\s*/,         action: function (match) {}                 }
	]);
	
##Property Shorthand
Shorter syntax for common object property definition idiom.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	obj = { x, y };
###ES5
	obj = { x: x, y: y };
	
##Computed Property Names
Support for computed names in object property definitions.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	let obj = {
		foo: "bar",
		[ "sample" + random() ]: 42
	};
###ES5
	var obj = {
		foo: "bar"
	};
	obj[ "sample" + random() ] = 42;
	
Method Properties
Support for method notation in object property definitions, for both regular functions and generator functions.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	obj = {
		foo (a, b) {
			…
		},
		bar (x, y) {
			…
		},
		*quux (x, y) {
			…
		}
	};
###ES5
	obj = {
		foo: function (a, b) {
			…
		},
		bar: function (x, y) {
			…
		},
		//  quux: no equivalent in ES5
		…
	};
	
##Array Matching
Intuitive and flexible destructuring of Arrays into individual variables during assignment.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	var list = [ 1, 2, 3 ];
	var [ a, , b ] = list;
	[ b, a ] = [ a, b ];
###ES5
	var list = [ 1, 2, 3 ];
	var a = list[0], b = list[2];
	var tmp = a; a = b; b = tmp;
	
##Object Matching, Shorthand Notation
Intuitive and flexible destructuring of Objects into individual variables during assignment.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	var { op, lhs, rhs } = getASTNode();
###ES5
	var tmp = getASTNode();
	var op  = tmp.op;
	var lhs = tmp.lhs;
	var rhs = tmp.rhs;
	
##Object Matching, Deep Matching
Intuitive and flexible destructuring of Objects into individual variables during assignment.
Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var { op: a, lhs: { op: b }, rhs: c } = getASTNode();
###ES5
	var tmp = getASTNode();
	var a = tmp.op;
	var b = tmp.lhs.op;
	var c = tmp.rhs;

##Parameter Context Matching
Intuitive and flexible destructuring of Arrays and Objects into individual parameters during function calls.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	function f ([ name, val ]) {
		console.log(name, val);
	}
	function g ({ name: n, val: v }) {
		console.log(n, v);
	}
	function h ({ name, val }) {
		console.log(name, val);
	}
	f([ "bar", 42 ]);
	g({ name: "foo", val:  7 });
	h({ name: "bar", val: 42 });
###ES5
	function f (arg) {
		var name = arg[0];
		var val  = arg[1];
		console.log(name, val);
	};
	function g (arg) {
		var n = arg.name;
		var v = arg.val;
		console.log(n, v);
	};
	function h (arg) {
		var name = arg.name;
		var val  = arg.val;
		console.log(name, val);
	};
	f([ "bar", 42 ]);
	g({ name: "foo", val:  7 });
	h({ name: "bar", val: 42 });
	
##Fail-Soft Destructuring
Fail-soft destructuring, optionally with defaults.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
##ES6
	var list = [ 7, 42 ];
	var [ a = 1, b = 2, c = 3, d ] = list;
	a === 7;
	b === 42;
	c === 3;
	d === undefined;
##ES5
	var list = [ 7, 42 ];
	var a = typeof list[0] !== "undefined" ? list[0] : 1;
	var b = typeof list[1] !== "undefined" ? list[1] : 2;
	var c = typeof list[2] !== "undefined" ? list[2] : 3;
	var d = typeof list[3] !== "undefined" ? list[3] : undefined;
	a === 7;
	b === 42;
	c === 3;
	d === undefined;
	
##Value Export/Import
Support for exporting/importing values from/to modules without global namespace pollution.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	//  lib/math.js
	export function sum (x, y) { return x + y };
	export var pi = 3.141593;

	//  someApp.js
	import * as math from "lib/math";
	console.log("2π = " + math.sum(math.pi, math.pi));

	//  otherApp.js
	import { sum, pi } from "lib/math";
	console.log("2π = " + sum(pi, pi));
###ES5
	//  lib/math.js
	LibMath = {};
	LibMath.sum = function (x, y) { return x + y };
	LibMath.pi = 3.141593;

	//  someApp.js
	var math = LibMath;
	console.log("2π = " + math.sum(math.pi, math.pi));

	//  otherApp.js
	var sum = LibMath.sum, pi = LibMath.pi;
	console.log("2π = " + sum(pi, pi));
	
##Default & Wildcard
Marking a value as the default exported value and mass-mixin of values.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	//  lib/mathplusplus.js
	export * from "lib/math";
	export var e = 2.71828182846;
	export default (x) => Math.exp(x);

	//  someApp.js
	import exp, { pi, e } from "lib/mathplusplus";
	console.log("e^{π} = " + exp(pi));
###ES5
	//  lib/mathplusplus.js
	LibMathPP = {};
	for (symbol in LibMath)
		if (LibMath.hasOwnProperty(symbol))
			LibMathPP[symbol] = LibMath[symbol];
	LibMathPP.e = 2.71828182846;
	LibMathPP.exp = function (x) { return Math.exp(x) };

	//  someApp.js
	var exp = LibMathPP.exp, pi = LibMathPP.pi, e = libMathPP.e;
	console.log("e^{π} = " + exp(pi));
	
##Class Definition
More intuitive, OOP-style and boilerplate-free classes.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	class Shape {
		constructor (id, x, y) {
			this.id = id;
			this.move(x, y);
		}
		move (x, y) {
			this.x = x;
			this.y = y;
		}
	}
###ES5
	var Shape = function (id, x, y) {
		this.id = id;
		this.move(x, y);
	};
	Shape.prototype.move = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
##Class Inheritance
More intuitive, OOP-style and boilerplate-free inheritance.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	class Rectangle extends Shape {
		constructor (id, x, y, width, height) {
			super(id, x, y);
			this.width  = width;
			this.height = height;
		}
	}
	class Circle extends Shape {
		constructor (id, x, y, radius) {
			super(id, x, y);
			this.radius = radius;
		}
	}
###ES5
	var Rectangle = function (id, x, y, width, height) {
		Shape.call(this, id, x, y);
		this.width  = width;
		this.height = height;
	};
	Rectangle.prototype = Object.create(Shape.prototype);
	Rectangle.prototype.constructor = Rectangle;
	var Circle = function (id, x, y, radius) {
		Shape.call(this, id, x, y);
		this.radius = radius;
	};
	Circle.prototype = Object.create(Shape.prototype);
	Circle.prototype.constructor = Circle;
	
##Class Inheritance, From Expressions
Support for mixin-style inheritance by extending from expressions yielding function objects. [Notice: the generic aggregation function is usually provided by a library like this one, of course]

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	var aggregation = (baseClass, ...mixins) => {
		let base = class _Combined extends baseClass {
			constructor (...args) {
				super(...args);
				mixins.forEach((mixin) => {
					mixin.prototype.initializer.call(this);
				});
			}
		};
		let copyProps = (target, source) => {
			Object.getOwnPropertyNames(source)
				.concat(Object.getOwnPropertySymbols(source))
				.forEach((prop) => {
				if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
					return
				Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
			})
		}
		mixins.forEach((mixin) => {
			copyProps(base.prototype, mixin.prototype);
			copyProps(base, mixin);
		});
		return base;
	};

	class Colored {
		initializer ()     { this._color = "white"; }
		get color ()       { return this._color; }
		set color (v)      { this._color = v; }
	}

	class ZCoord {
		initializer ()     { this._z = 0; }
		get z ()           { return this._z; }
		set z (v)          { this._z = v; }
	}

	class Shape {
		constructor (x, y) { this._x = x; this._y = y; }
		get x ()           { return this._x; }
		set x (v)          { this._x = v; }
		get y ()           { return this._y; }
		set y (v)          { this._y = v; }
	}

	class Rectangle extends aggregation(Shape, Colored, ZCoord) {}

	var rect = new Rectangle(7, 42);
	rect.z     = 1000;
	rect.color = "red";
	console.log(rect.x, rect.y, rect.z, rect.color);
###ES5
	var aggregation = function (baseClass, mixins) {
		var base = function () {
			baseClass.apply(this, arguments);
			mixins.forEach(function (mixin) {
				mixin.prototype.initializer.call(this);
			}.bind(this));
		};
		base.prototype = Object.create(baseClass.prototype);
		base.prototype.constructor = base;
		var copyProps = function (target, source) {
			Object.getOwnPropertyNames(source).forEach(function (prop) {
				if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
					return
				Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
			})
		}
		mixins.forEach(function (mixin) {
			copyProps(base.prototype, mixin.prototype);
			copyProps(base, mixin);
		});
		return base;
	};

	var Colored = function () {};
	Colored.prototype = {
		initializer: function ()  { this._color = "white"; },
		getColor:    function ()  { return this._color; },
		setColor:    function (v) { this._color = v; }
	};

	var ZCoord = function () {};
	ZCoord.prototype = {
		initializer: function ()  { this._z = 0; },
		getZ:        function ()  { return this._z; },
		setZ:        function (v) { this._z = v; }
	};

	var Shape = function (x, y) {
		this._x = x; this._y = y;
	};
	Shape.prototype = {
		getX: function ()  { return this._x; },
		setX: function (v) { this._x = v; },
		getY: function ()  { return this._y; },
		setY: function (v) { this._y = v; }
	}

	var _Combined = aggregation(Shape, [ Colored, ZCoord ]);
	var Rectangle = function (x, y) {
		_Combined.call(this, x, y);
	};
	Rectangle.prototype = Object.create(_Combined.prototype);
	Rectangle.prototype.constructor = Rectangle;

	var rect = new Rectangle(7, 42);
	rect.setZ(1000);
	rect.setColor("red");
	console.log(rect.getX(), rect.getY(), rect.getZ(), rect.getColor());
	
##Base Class Access
Intuitive access to base class constructor and methods.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	class Shape {
		…
		toString () {
			return `Shape(${this.id})`
		}
	}
	class Rectangle extends Shape {
		constructor (id, x, y, width, height) {
			super(id, x, y);
			…
		}
		toString () {
			return "Rectangle > " + super.toString();
		}
	}
	class Circle extends Shape {
		constructor (id, x, y, radius) {
			super(id, x, y);
			…
		}
		toString () {
			return "Circle > " + super.toString();
		}
	}
##ES5
	var Shape = function (id, x, y) {
		…
	};
	Shape.prototype.toString = function (x, y) {
		return "Shape(" + this.id + ")"
	};
	var Rectangle = function (id, x, y, width, height) {
		Shape.call(this, id, x, y);
		…
	};
	Rectangle.prototype.toString = function () {
		return "Rectangle > " + Shape.prototype.toString.call(this);
	};
	var Circle = function (id, x, y, radius) {
		Shape.call(this, id, x, y);
		…
	};
	Circle.prototype.toString = function () {
		return "Circle > " + Shape.prototype.toString.call(this);
	};
	
##Static Members
Simple support for static class members.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	class Rectangle extends Shape {
		…
		static defaultRectangle () {
			return new Rectangle("default", 0, 0, 100, 100);
		}
	}
	class Circle extends Shape {
		…
		static defaultCircle () {
			return new Circle("default", 0, 0, 100);
		}
	}
	var defRectangle = Rectangle.defaultRectangle();
	var defCircle    = Circle.defaultCircle();
###ES5
	var Rectangle = function (id, x, y, width, height) {
		…
	};
	Rectangle.defaultRectangle = function () {
		return new Rectangle("default", 0, 0, 100, 100);
	};
	var Circle = function (id, x, y, width, height) {
		…
	};
	Circle.defaultCircle = function () {
		return new Circle("default", 0, 0, 100);
	};
	var defRectangle = Rectangle.defaultRectangle();
	var defCircle    = Circle.defaultCircle();
	
##Static Members
Simple support for static class members.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6	class Rectangle extends Shape {
		…
		static defaultRectangle () {
			return new Rectangle("default", 0, 0, 100, 100);
		}
	}
	class Circle extends Shape {
		…
		static defaultCircle () {
			return new Circle("default", 0, 0, 100);
		}
	}
	var defRectangle = Rectangle.defaultRectangle();
	var defCircle    = Circle.defaultCircle();
###ES5
	var Rectangle = function (id, x, y, width, height) {
		…
	};
	Rectangle.defaultRectangle = function () {
		return new Rectangle("default", 0, 0, 100, 100);
	};
	var Circle = function (id, x, y, width, height) {
		…
	};
	Circle.defaultCircle = function () {
		return new Circle("default", 0, 0, 100);
	};
	var defRectangle = Rectangle.defaultRectangle();
	var defCircle    = Circle.defaultCircle();
	
##Getter/Setter
Getter/Setter also directly within classes (and not just within object initializers, as it is possible since ECMAScript 5.1).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	class Rectangle {
		constructor (width, height) {
			this._width  = width;
			this._height = height;
		}
		set width  (width)  { this._width = width;               }
		get width  ()       { return this._width;                }
		set height (height) { this._height = height;             }
		get height ()       { return this._height;               }
		get area   ()       { return this._width * this._height; }
	};
	var r = new Rectangle(50, 20);
	r.area === 1000;
###ES5
	var Rectangle = function (width, height) {
		this._width  = width;
		this._height = height;
	};
	Rectangle.prototype = {
		set width  (width)  { this._width = width;               },
		get width  ()       { return this._width;                },
		set height (height) { this._height = height;             },
		get height ()       { return this._height;               },
		get area   ()       { return this._width * this._height; }
	};
	var r = new Rectangle(50, 20);
	r.area === 1000;
	
##Symbol Type
Unique and immutable data type to be used as an identifier for object properties. Symbol can have an optional description, but for debugging purposes only.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	Symbol("foo") !== Symbol("foo");
	const foo = Symbol();
	const bar = Symbol();
	typeof foo === "symbol";
	typeof bar === "symbol";
	let obj = {};
	obj[foo] = "foo";
	obj[bar] = "bar";
	JSON.stringify(obj); // {}
	Object.keys(obj); // []
	Object.getOwnPropertyNames(obj); // []
	Object.getOwnPropertySymbols(obj); // [ foo, bar ]
###ES5
	// no equivalent in ES5
	
##Global Symbols
Global symbols, indexed through unique keys.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported,
Internet Explorer 11 - Not supported
###ES6
	Symbol.for("app.foo") === Symbol.for("app.foo")
	const foo = Symbol.for("app.foo");
	const bar = Symbol.for("app.bar");
	Symbol.keyFor(foo) === "app.foo";
	Symbol.keyFor(bar) === "app.bar";
	typeof foo === "symbol";
	typeof bar === "symbol";
	let obj = {};
	obj[foo] = "foo";
	obj[bar] = "bar";
	JSON.stringify(obj); // {}
	Object.keys(obj); // []
	Object.getOwnPropertyNames(obj); // []
	Object.getOwnPropertySymbols(obj); // [ foo, bar ]
###ES5
	// no equivalent in ES5
	
##Iterator & For-Of Operator
Support "iterable" protocol to allow objects to customize their iteration behaviour. Additionally, support "iterator" protocol to produce sequence of values (either finite or infinite). Finally, provide convenient of operator to iterate over all values of an iterable object.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let fibonacci = {
		[Symbol.iterator]() {
			let pre = 0, cur = 1;
			return {
			   next () {
				   [ pre, cur ] = [ cur, pre + cur ];
				   return { done: false, value: cur };
			   }
			};
		}
	}

	for (let n of fibonacci) {
		if (n > 1000)
			break;
		console.log(n);
	}
###ES5
	var fibonacci = {
		next: (function () {
			var pre = 0, cur = 1;
			return function () {
				tmp = pre;
				pre = cur;
				cur += tmp;
				return cur;
			};
		})()
	};

	var n;
	for (;;) {
		n = fibonacci.next();
		if (n > 1000)
			break;
		console.log(n);
	}
	
##Generator Function, Iterator Protocol
Support for generators, a special case of Iterators containing a generator function, where the control flow can be paused and resumed, in order to produce sequence of values (either finite or infinite).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6	let fibonacci = {
		*[Symbol.iterator]() {
			let pre = 0, cur = 1;
			for (;;) {
				[ pre, cur ] = [ cur, pre + cur ];
				yield cur;
			}
		}
	}

	for (let n of fibonacci) {
		if (n > 1000)
			break;
		console.log(n);
	}
###ES5
	var fibonacci = {
		next: (function () {
			var pre = 0, cur = 1;
			return function () {
				tmp = pre;
				pre = cur;
				cur += tmp;
				return cur;
			};
		})()
	};

	var n;
	for (;;) {
		n = fibonacci.next();
		if (n > 1000)
			break;
		console.log(n);
	}
	
##Generator Function, Direct Use
Support for generator functions, a special variant of functions where the control flow can be paused and resumed, in order to produce sequence of values (either finite or infinite).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	function* range (start, end, step) {
		while (start < end) {
			yield start;
			start += step;
		}
	}

	for (let i of range(0, 10, 2)) {
		console.log(i); // 0, 2, 4, 6, 8
	}
##ES5
	function range (start, end, step) {
		var list = [];
		while (start < end) {
			list.push(start);
			start += step;
		}
		return list;
	}

	var r = range(0, 10, 2);
	for (var i = 0; i < r.length; i++) {
		console.log(r[i]); // 0, 2, 4, 6, 8
	}
	
##Generator Matching
Support for generator functions, i.e., functions where the control flow can be paused and resumed, in order to produce and spread sequence of values (either finite or infinite).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let fibonacci = function* (numbers) {
		let pre = 0, cur = 1;
		while (numbers-- > 0) {
			[ pre, cur ] = [ cur, pre + cur ];
			yield cur;
		}
	};

	for (let n of fibonacci(1000))
		console.log(n);

	let numbers = [ ...fibonacci(1000) ];

	let [ n1, n2, n3, ...others ] = fibonacci(1000);
###ES5
	//  no equivalent in ES5
	
##Generator Control-Flow
Support for generators, a special case of Iterators where the control flow can be paused and resumed, in order to support asynchronous programming in the style of "co-routines" in combination with Promises (see below).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	//  generic asynchronous control-flow driver
	function async (proc, ...params) {
		var iterator = proc(...params);
		return new Promise((resolve, reject) => {
			let loop = (value) => {
				let result;
				try {
					result = iterator.next(value);
				}
				catch (err) {
					reject(err);
				}
				if (result.done)
					resolve(result.value);
				else if (   typeof result.value      === "object"
						 && typeof result.value.then === "function")
					result.value.then((value) => {
						loop(value);
					}, (err) => {
						reject(err);
					});
				else
					loop(result.value);
			}
			loop();
		});
	}

	//  application-specific asynchronous builder
	function makeAsync (text, after) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(text), after);
		});
	}

	//  application-specific asynchronous procedure
	async(function* (greeting) {
		let foo = yield makeAsync("foo", 300)
		let bar = yield makeAsync("bar", 200)
		let baz = yield makeAsync("baz", 100)
		return `${greeting} ${foo} ${bar} ${baz}`
	}, "Hello").then((msg) => {
		console.log("RESULT:", msg); // "Hello foo bar baz"
	})
##ES5
	//  no equivalent in ES5
	
##Generator Methods
Support for generator methods, i.e., methods in classes and on objects, based on generator functions.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	class Clz {
		* bar () {
			…
		}
	};
	let Obj = {
		* foo () {
			…
		}
	};
###ES5
	//  no equivalent in ES5
	
##Set Data-Structure
Cleaner data-structure for common algorithms based on sets.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let s = new Set();
	s.add("hello").add("goodbye").add("hello");
	s.size === 2;
	s.has("hello") === true;
	for (let key of s.values()) // insertion order
		console.log(key);
###ES5
	var s = {};
	s["hello"] = true; s["goodbye"] = true; s["hello"] = true;
	Object.keys(s).length === 2;
	s["hello"] === true;
	for (var key in s) // arbitrary order
		if (s.hasOwnProperty(key))
			console.log(s[key]);
			
##Map Data-Structure
Cleaner data-structure for common algorithms based on maps.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6	let m = new Map();
	m.set("hello", 42);
	m.set(s, 34);
	m.get(s) === 34;
	m.size === 2;
	for (let [ key, val ] of m.entries())
		console.log(key + " = " + val);
###ES5
	var m = {};
	m["hello"] = 42;
	// no equivalent in ES5
	// no equivalent in ES5
	Object.keys(m).length === 2;
	for (key in m) {
		if (m.hasOwnProperty(key)) {
			var val = m[key];
			console.log(key + " = " + val);
		}
	}
	
##Weak-Link Data-Structures
Memory-leak-free Object-key’d side-by-side data-structures.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let isMarked     = new WeakSet();
	let attachedData = new WeakMap();

	export class Node {
		constructor (id)   { this.id = id;                  }
		mark        ()     { isMarked.add(this);            }
		unmark      ()     { isMarked.delete(this);         }
		marked      ()     { return isMarked.has(this);     }
		set data    (data) { attachedData.set(this, data);  }
		get data    ()     { return attachedData.get(this); }
	}

	let foo = new Node("foo");

	JSON.stringify(foo) === '{"id":"foo"}';
	foo.mark();
	foo.data = "bar";
	foo.data === "bar";
	JSON.stringify(foo) === '{"id":"foo"}';

	isMarked.has(foo)     === true
	attachedData.has(foo) === true
	foo = null  /* remove only reference to foo */
	attachedData.has(foo) === false
	isMarked.has(foo)     === false
###ES5
	// no equivalent in ES5
	
##Typed Arrays
Support for arbitrary byte-based data structures to implement network protocols, cryptography algorithms, file format manipulations, etc.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	//  ES6 class equivalent to the following C structure:
	//  struct Example { unsigned long id; char username[16]; float amountDue; };
	class Example {
		constructor (buffer = new ArrayBuffer(24)) {
			this.buffer = buffer;
		}
		set buffer (buffer) {
			this._buffer    = buffer;
			this._id        = new Uint32Array (this._buffer,  0,  1);
			this._username  = new Uint8Array  (this._buffer,  4, 16);
			this._amountDue = new Float32Array(this._buffer, 20,  1);
		}
		get buffer ()     { return this._buffer;       }
		set id (v)        { this._id[0] = v;           }
		get id ()         { return this._id[0];        }
		set username (v)  { this._username[0] = v;     }
		get username ()   { return this._username[0];  }
		set amountDue (v) { this._amountDue[0] = v;    }
		get amountDue ()  { return this._amountDue[0]; }
	}

	let example = new Example()
	example.id = 7
	example.username = "John Doe"
	example.amountDue = 42.0
###ES5
	//  no equivalent in ES5
	//  (only an equivalent in HTML5)
	
##Object Property Assignment
New function for assigning enumerable properties of one or more source objects onto a destination object.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var dst  = { quux: 0 };
	var src1 = { foo: 1, bar: 2 };
	var src2 = { foo: 3, baz: 4 };
	Object.assign(dst, src1, src2);
	dst.quux === 0;
	dst.foo  === 3;
	dst.bar  === 2;
	dst.baz  === 4;
###ES5
	var dst  = { quux: 0 };
	var src1 = { foo: 1, bar: 2 };
	var src2 = { foo: 3, baz: 4 };
	Object.keys(src1).forEach(function(k) {
		dst[k] = src1[k];
	});
	Object.keys(src2).forEach(function(e) {
		dst[k] = src2[k];
	});
	dst.quux === 0;
	dst.foo  === 3;
	dst.bar  === 2;
	dst.baz  === 4;
	
##Array Element Finding
New function for finding an element in an array.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	[ 1, 3, 4, 2 ].find(x => x > 3); // 4
###ES5
	[ 1, 3, 4, 2 ].filter(function (x) { return x > 3; })[0]; // 4
	
##String Repeating
New string repeating functionality.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6	" ".repeat(4 * depth);
	"foo".repeat(3);
###ES5	Array((4 * depth) + 1).join(" ");
	Array(3 + 1).join("foo");
	
##String Searching
New specific string functions to search for a sub-string.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	"hello".startsWith("ello", 1) // true
	"hello".endsWith("hell", 4)   // true
	"hello".includes("ell")       // true
	"hello".includes("ell", 1)    // true
	"hello".includes("ell", 2)    // false
###ES5
	"hello".indexOf("ello") === 1;    // true
	"hello".indexOf("hell") === (4 - "hell".length); // true
	"hello".indexOf("ell") !== -1;    // true
	"hello".indexOf("ell", 1) !== -1; // true
	"hello".indexOf("ell", 2) !== -1; // false
	
##Number Type Checking
New functions for checking for non-numbers and finite numbers.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	Number.isNaN(42) === false
	Number.isNaN(NaN) === true

	Number.isFinite(Infinity) === false
	Number.isFinite(-Infinity) === false
	Number.isFinite(NaN) === false
	Number.isFinite(123) === true
###ES5
	var isNaN = function (n) {
		return n !== n;
	};
	var isFinite = function (v) {
		return (typeof v === "number" && !isNaN(v) && v !== Infinity && v !== -Infinity);
	};
	isNaN(42) === false;
	isNaN(NaN) === true;

	isFinite(Infinity) === false;
	isFinite(-Infinity) === false;
	isFinite(NaN) === false;
	isFinite(123) === true;
	
##Number Safety Checking
Checking whether an integer number is in the safe range, i.e., it is correctly represented by JavaScript (where all numbers, including integer numbers, are technically floating point number).

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	Number.isSafeInteger(42) === true
	Number.isSafeInteger(9007199254740992) === false
###ES5
	function isSafeInteger (n) {
		return (
			   typeof n === 'number'
			&& Math.round(n) === n
			&& -(Math.pow(2, 53) - 1) <= n
			&& n <= (Math.pow(2, 53) - 1)
		);
	}
	isSafeInteger(42) === true;
	isSafeInteger(9007199254740992) === false;
	
##Number Comparison
Availability of a standard Epsilon value for more precise comparison of floating point numbers.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	console.log(0.1 + 0.2 === 0.3) // false
	console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON) // true
###ES6
	console.log(0.1 + 0.2 === 0.3); // false
	console.log(Math.abs((0.1 + 0.2) - 0.3) < 2.220446049250313e-16); // true
	
##Number Truncation
Truncate a floating point number to its integral part, completely dropping the fractional part.
###ES6
	console.log(Math.trunc(42.7)) // 42
	console.log(Math.trunc( 0.1)) // 0
	console.log(Math.trunc(-0.1)) // -0
###ES5
	function mathTrunc (x) {
		return (x < 0 ? Math.ceil(x) : Math.floor(x));
	}
	console.log(mathTrunc(42.7)) // 42
	console.log(mathTrunc( 0.1)) // 0
	console.log(mathTrunc(-0.1)) // -0
	
##Number Sign Determination
Determine the sign of a number, including special cases of signed zero and non-number.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	console.log(Math.sign(7))   // 1
	console.log(Math.sign(0))   // 0
	console.log(Math.sign(-0))  // -0
	console.log(Math.sign(-7))  // -1
	console.log(Math.sign(NaN)) // NaN
###ES5
	function mathSign (x) {
		return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1));
	}
	console.log(mathSign(7))   // 1
	console.log(mathSign(0))   // 0
	console.log(mathSign(-0))  // -0
	console.log(mathSign(-7))  // -1
	console.log(mathSign(NaN)) // NaN
	
##Promise Usage
First class representation of a value that may be made asynchronously and be available in the future.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	function msgAfterTimeout (msg, who, timeout) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(`${msg} Hello ${who}!`), timeout)
		})
	}
	msgAfterTimeout("", "Foo", 100).then((msg) =>
		msgAfterTimeout(msg, "Bar", 200)
	).then((msg) => {
		console.log(`done after 300ms:${msg}`)
	})
###ES5
	function msgAfterTimeout (msg, who, timeout, onDone) {
		setTimeout(function () {
			onDone(msg + " Hello " + who + "!");
		}, timeout);
	}
	msgAfterTimeout("", "Foo", 100, function (msg) {
		msgAfterTimeout(msg, "Bar", 200, function (msg) {
			console.log("done after 300ms:" + msg);
		});
	});
	
##Promise Combination
Combine one or more promises into new promises without having to take care of ordering of the underlying asynchronous operations yourself.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	function fetchAsync (url, timeout, onData, onError) {
		…
	}
	let fetchPromised = (url, timeout) => {
		return new Promise((resolve, reject) => {
			fetchAsync(url, timeout, resolve, reject)
		})
	}
	Promise.all([
		fetchPromised("http://backend/foo.txt", 500),
		fetchPromised("http://backend/bar.txt", 500),
		fetchPromised("http://backend/baz.txt", 500)
	]).then((data) => {
		let [ foo, bar, baz ] = data
		console.log(`success: foo=${foo} bar=${bar} baz=${baz}`)
	}, (err) => {
		console.log(`error: ${err}`)
	})
###ES5
	function fetchAsync (url, timeout, onData, onError) {
		…
	}
	function fetchAll (request, onData, onError) {
		var result = [], results = 0;
		for (var i = 0; i < request.length; i++) {
			result[i] = null;
			(function (i) {
				fetchAsync(request[i].url, request[i].timeout, function (data) {
					result[i] = data;
					if (++results === request.length)
						onData(result);
				}, onError);
			})(i);
		}
	}
	fetchAll([
		{ url: "http://backend/foo.txt", timeout: 500 },
		{ url: "http://backend/bar.txt", timeout: 500 },
		{ url: "http://backend/baz.txt", timeout: 500 }
	], function (data) {
		var foo = data[0], bar = data[1], baz = data[2];
		console.log("success: foo=" + foo + " bar=" + bar + " baz=" + baz);
	}, function (err) {
		console.log("error: " + err);
	});
	
##Proxying
Hooking into runtime-level object meta-operations.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let target = {
		foo: "Welcome, foo"
	}
	let proxy = new Proxy(target, {
		get (receiver, name) {
			return name in receiver ? receiver[name] : `Hello, ${name}`
		}
	})
	proxy.foo   === "Welcome, foo"
	proxy.world === "Hello, world"
###ES5
	// no equivalent in ES5
	
##Reflection
Make calls corresponding to the object meta-operations.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	let obj = { a: 1 }
	Object.defineProperty(obj, "b", { value: 2 })
	obj[Symbol("c")] = 3
	Reflect.ownKeys(obj) // [ "a", "b", Symbol(c) ]
###ES5
	var obj = { a: 1 };
	Object.defineProperty(obj, "b", { value: 2 });
	// no equivalent in ES5
	Object.getOwnPropertyNames(obj); // [ "a", "b" ]
	
##Sorting a set of strings and searching within a set of strings. Collation is parameterized by locale and aware of Unicode.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	// in German,  "ä" sorts with "a"
	// in Swedish, "ä" sorts after "z"
	var list = [ "ä", "a", "z" ]
	var i10nDE = new Intl.Collator("de")
	var i10nSV = new Intl.Collator("sv")
	i10nDE.compare("ä", "z") === -1
	i10nSV.compare("ä", "z") === +1
	console.log(list.sort(i10nDE.compare)) // [ "a", "ä", "z" ]
	console.log(list.sort(i10nSV.compare)) // [ "a", "z", "ä" ]
###ES5
	// no equivalent in ES5
	
##Number Formatting
Format numbers with digit grouping and localized separators.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var i10nEN = new Intl.NumberFormat("en-US")
	var i10nDE = new Intl.NumberFormat("de-DE")
	i10nEN.format(1234567.89) === "1,234,567.89"
	i10nDE.format(1234567.89) === "1.234.567,89"
###ES5
	// no equivalent in ES5
	
##Currency Formatting
Format numbers with digit grouping, localized separators and attached currency symbol.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6
	var i10nUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
	var i10nGBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
	var i10nEUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
	i10nUSD.format(100200300.40) === "$100,200,300.40"
	i10nGBP.format(100200300.40) === "£100,200,300.40"
	i10nEUR.format(100200300.40) === "100.200.300,40 €"
###ES5
	// no equivalent in ES5
	
##Date/Time Formatting
Format date/time with localized ordering and separators.

Chrome 52,Opera 39,Edge 14,Firefox 48 - Fully supported
Internet Explorer 11 - Not supported
###ES6	var i10nEN = new Intl.DateTimeFormat("en-US")
	var i10nDE = new Intl.DateTimeFormat("de-DE")
	i10nEN.format(new Date("2015-01-02")) === "1/2/2015"
	i10nDE.format(new Date("2015-01-02")) === "2.1.2015"
###ES5
	// no equivalent in ES5

#Summary
Итого, ES приблизился к стандарту C# очень-очень сильно :)
