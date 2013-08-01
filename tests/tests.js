(function() {

var releasable, test;
try {
	releasable = require('../releasable');
	test = require('tape');
} catch(e) {
	releasable = window.releasable;
	test = window.test;
}

function noop(){}

test('creating', function(t) {
	t = t || window;

	var mixedin = {"a": 1};
	releasable.mixin(mixedin, noop);

	t.ok( mixedin.a === 1, 'Passing an object into releasable.mixin(object) should return the same object' );
	t.ok( typeof mixedin.retain === 'function', 'retain function is added.');
	t.ok( typeof mixedin.release === 'function', 'release function is added.');

	var created = releasable.create(noop);

	t.ok( typeof created.retain === 'function', 'retain function is present.');
	t.ok( typeof created.release === 'function', 'release function is present.');

	t.end && t.end();
});

test('getting the callbacks', function(t) {
	t = t || window;

	var object = {};
	var wasCalledBack = 0;
	var gotRetainCallback = 0;
	var gotEveryReleaseCallback = 0;

	function releasedCallback( obj ) {
		wasCalledBack++;
		t.equal( obj, object, 'the object is passed to the release callback');
	}
	function retainCallback( obj ) {
		gotRetainCallback++;
		t.equal( obj, object, 'the object is passed to the retain callback');
	}
	function everyReleaseCallback( obj ) {
		gotEveryReleaseCallback++;
		t.equal( obj, object, 'the object is passed to the every release callback');
	}
	
	releasable.mixin(object, releasedCallback, retainCallback, everyReleaseCallback);

	object.retain();
	object.release();

	t.equal( wasCalledBack, 1, 'got the release callback once' );
	t.equal( gotRetainCallback, 1, 'got the retain callback once' );
	t.equal( gotEveryReleaseCallback, 1, 'got the every release callback once' );

	try {
		object.release();
		t.ok( false, 'errored when release was called too many times');
	} catch(e) {
		t.ok( true, 'errored when release was called too many times');
	}

	t.end && t.end();
});

})();