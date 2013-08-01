# Releasable

This adds retain/release functionality to any object. This allows you to clean up objects that need to be sent to many parts of an application. One example of usefulness is when you need to continuously update an object, perhaps through ajax polling, but want to stop when the object is no longer needed.

[![browser support](http://ci.testling.com/sakabako/releasable.png)](http://ci.testling.com/sakabako/releasable)

## Creating a Releasable

### Basic
 * `releaseable.mixin( object, releasedCallback )` - Makes an object releaseable. Calls `releasedCallback( object )` when the object can be released.

### Advanced
 * `releaseable.mixin( object, releasedCallback [, retainedCallback, everyReleaseCallback] )` - Makes an object releaseable, with optional additional callbacks.
 * `releaseable.create( releasedCallback [, retainedCallback, everyReleaseCallback] )` - Same as releaseable.mixin( {}, ...).

When `release()` has been called on a releasable as many times as `retain()`, releasedCallback will be called with the target as the only argument. At this time nobody should be watching your object and it is safe to remove it from your cache, stop polling, etc.

## Using a Releasable

When the releasable methods have been added to an object, you can call the releasable methods on it.

 * `object.retain()` - Tells the source of this object that it should continue to update this object.
 * `object.release()` - When everyone that has retained this object has released it, the source of this object will be notified so it can stop updates.


## Sample Module that Creates Releasables

```javascript
var releasable = require('releaseable/releaseable');

var myCache = {};

function removeFromCache( obj ) {
	delete myCache[obj.name];
}

function createObject( name ) {
	
	if( myCache[name] ) {
		return myCache[name];
	}

	var myObject = {
		name: name
	};

	releaseable.mixin( myObject, removeFromCache );
	// myObject now has:
	// myObject.retain();
	// myObject.release();

	myCache[name] = myObject;

	return myObject;
}
```

