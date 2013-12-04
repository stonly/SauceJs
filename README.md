SauceJs
=======

SauceJs is a Javascript library for moving your functions to a jSauce server. You can use SauceJS as an AngularJS factory or as a standalone wrapper. Once added as a script to your application, you can take the contents of any function and move them to the servers 'recepies.js' file. Then you can convert your functions to 'zombie' form. The function will take the arguments you pass it, perfom the operation on the backend, and return the result or update the variables in your scope.

For ex.

```js
//this normal function takes two arguments, which we will assume are integers, and returns the sum.
function add(a,b){
  return a+b;
}

//the above function would be converted to the following zombie version, as would any functions you choseto convert. 
function add(){
  return z_._(arguments);
}
```

[Demo Page](http://mysterious-ridge-3762.herokuapp.com/)

Usage
=======

1. Include the saucejs.js script in your applicaton's html head or body.
```html
<script type="text/javascript" src="lib/saucejs.js"></script>
```

2. Add the souce binding to your angularjs application's module decleration.
```js
var coLab = angular.module('coLab', ['firebase', 'sauce']);
``` 

3. Add the sauceJs factory to your controllers 
```js
function coLabCtrl($scope, angularFire, z_, $routeParams, $location){
...
```

4. Add functions to the recipes.js exports.have object
```js
  test : function(a){
          return { val: 1, scope : {test : 1 }, exec : "alert('test')", local : { test : 1 } } ;
        }
```

5. Call the function from your controller in the SauceJs way. Note that the function is named twice and no arguments are defined. This is the unifored approach to calling any function you convert to sauceJs.
```js
  scope.test = function test(){
    return z_._(arguments);
  }
```

You can also create multiple function links at once :
```js
  z_.SecretSauce(['fun1', 'fun2', 'fun3'], $scope);
  // In this example, $scope.fun1() would become callable as with the other function names listed.
```


Install jSauce node server
-----------

```bash
npm install -g express
```


License
-------
MIT

Contact [@StonlyBaptise](http://twitter.com/StonlyBaptiste) if you have any questions.
