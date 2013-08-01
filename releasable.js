(function( factory ) {
	if (typeof define !== 'undefined' && define.amd) {
		define([], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory();
	} else {
		window.releasable = factory();
	}
})(function(){
	
	function noop(){}

	function mixin( target, releasedCallback, retainedCallback, singleReleaseCallback ) {
		
		retainedCallback = retainedCallback || noop;
		singleReleaseCallback = singleReleaseCallback || noop;
		var watchers = 0;

		target.retain = target.watch = function() {
			watchers += 1;
			retainedCallback( target );
		};

		target.release = function() {
			watchers -= 1;
			singleReleaseCallback( target );
			if (watchers === 0) {
				releasedCallback( target );
			}
			if (watchers < 0) {
				throw new Error('Object was released too many times.');
			}
		};

		target.isWatched = function() {
			return watchers !== 0;
		};

	}

	return {
		mixin: mixin,
		create: function( releasedCallback, retainedCallback, singleReleaseCallback ) {
			var target = {};
			mixin(target, releasedCallback, retainedCallback, singleReleaseCallback );
			return target;
		}
	};

});