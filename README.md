SauceJs
=======

SauceJs is an AngularJS binding for moving your functions to a jSauce node server. Following the example of the included demo, you can create front end applications that do not expose all of your javascript source code.

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
