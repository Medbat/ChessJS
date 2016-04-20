# Сравнение версий 5 и 6 стандарта ECMAScript
Рассмотрим все новые фичи, появившиеся в 6 версии со времён 5.

##Константы
Объект, на который ссылается константа, может быть изменён.
###ES6
	const PI = 3.141593
###ES5
	// Только с помощью ES5, только в глобальном контексте
	Object.defineProperty(typeof global === "object" ? global : window, "PI", {
	    value:        3.141593,
	    enumerable:   true,
	    writable:     false,
	    configurable: false
	})

##Блоковая область видимости
Переменные, функции и константы без хойстинга
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
	
	//  Только в ES5 при помощи эмуляции
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
	
##Стрелочные функции (лямбда-выражения)
Более простая и удобная форма, а также более интуитивное использование контекста текущего объекта
###ES6
	odds  = evens.map(v => v + 1);
	
	this.nums.forEach((v) => 
		{
    		if (v % 5 === 0)
	    	    this.fives.push(v);
		});
###ES5
	odds  = evens.map(function (v) { return v + 1; });
	
	//  первый вариант
	var self = this;
	this.nums.forEach(function (v) 
	{
	    if (v % 5 === 0)
	        self.fives.push(v);
	});

	//  второй вариант, только с ES 5.1
	this.nums.forEach(function (v) 
	{
	    if (v % 5 === 0)
	        this.fives.push(v);
	}.bind(this));

##Расширенные опции при задавании параметров
Явные значения по умолчанию и агрегация 
##ES6
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
##ES5
	function f (x, y, z) 
	{
	    if (y === undefined)
	        y = 7;
	    if (z === undefined)
	        z = 42;
	    return x + y + z;
	};
	f(1) === 50;
	
	
