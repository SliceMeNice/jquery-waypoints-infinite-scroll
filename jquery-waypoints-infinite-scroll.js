( function( $, Waypoint ) {
	'use strict'

	function InfiniteScroll( options ) {
		this.options = $.extend( {}, InfiniteScroll.defaults, options );
		this.container = this.options.element;

		if ( this.options.container !== 'auto' ) {
			this.container = this.options.container;
		}

		this.$container = $( this.container );
		this.$more = $( this.options.more );

		if ( this.$more.length ) {
			this.setupHandler();
			this.waypoint = new Waypoint( this.options );
		}
	}

	/* Private */
	InfiniteScroll.prototype.setupHandler = function() {
		this.options.handler = $.proxy( function() {

			this.destroy();
			window.hooks.doAction( 'infiniteScroll/beforeLoadingNewData' );

			var $ajax = hooks.applyFilters( 'infiniteScroll/loadNewData', false );

			if ( $ajax === false ) {
				$.ajax( {
					dataType: 'json',
					url: hooks.applyFilters( 'infiniteScroll/requestURL', $( this.options.more ).attr( 'href' ) ),
					data: hooks.applyFilters( 'infiniteScroll/requestData', {} )
				} );
			}

			$ajax.then( $.proxy( function( response ) {
				hooks.doAction( 'infiniteScroll/handleResponse', response );

				if ( !hooks.applyFilters( 'infiniteScroll/isLastPage', true, response ) ) {
					this.waypoint = new Waypoint( this.options );
				}
			}, this ) );

		}, this );
	}

	/* Public */
	InfiniteScroll.prototype.destroy = function() {
		if ( this.waypoint ) {
			this.waypoint.destroy();
		}
	}

	InfiniteScroll.defaults = {
		container: 'auto',
		more: '.infinite-more-link',
		offset: 'bottom-in-view'
	}

	Waypoint.InfiniteScroll = InfiniteScroll;

} )( jQuery, Waypoint );
