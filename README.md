# Releasable

This adds retain/release functionality to any object. This allows memory cleanup when an object needs to be sent to many areas of an application.

## Methods

 * `releaseable.mixin( object, releasedCallback [, retainedCallback, everyReleaseCallback] )` - Makes an object releaseable.
 * `releaseable.create( releasedCallback [, retainedCallback, everyReleaseCallback] )` - Same as releaseable.mixin( {}, ...).

When `release()` has been called on a releasable as many times as `retain()`, releasedCallback will be called with the target as the only argument. At this time nobody should be watching your object and it is safe to remove it from your cache, stop polling, etc.

## Basic Usage

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

