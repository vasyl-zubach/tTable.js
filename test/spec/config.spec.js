'use strict';
(function () {

	describe( 'Configuration option', function () {
		var our_table = {};
		beforeEach( function () {
			if ( our_table.destroy ) {
				our_table.destroy();
			}
			our_table = {};
		} )

		describe( '{}', function () {
			it( 'no options - sets all defaults', function () {
				our_table = new tTable();
				( JSON.stringify( our_table.config ) ).should.equal( JSON.stringify( tTable_defaults ) );
			} )
		} );


		describe( "container", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'container' ) === null ).should.be.true;
			} );

			it( "{string} - example: '#table_id'", function () {
				var container = '#table_id';
				our_table = new tTable( { container: container } );
				(our_table.get( 'container' ) ).should.equal( container );
				(our_table.$el.find( '.' + our_table.get( 'className' ).main ).length > 0).should.be.true;
			} );

			it( "{DOM element} - example: document.getElementById('table_id')", function () {
				var container = document.getElementById( 'table_id' );
				our_table = new tTable( { container: container } );
				(our_table.get( 'container' ) ).should.equal( container );
				(our_table.$el.find( '.' + our_table.get( 'className' ).main ).length > 0).should.be.true;
			} );

			it( "{jQuery object} - example: $('table_id')", function () {
				var container = $( '#table_id' );
				our_table = new tTable( { container: container } );
				(our_table.get( 'container' ) ).should.equal( container );
				(our_table.$el.find( '.' + our_table.get( 'className' ).main ).length > 0).should.be.true;
			} );
		} );

		describe( "titles", function () {
			it( "`[ ]` - empty array by default", function () {
				our_table = new tTable( {
					container: '#table_id'
				} );
				var titles = our_table.get( 'titles' );
				( _.isArray( titles ) && _.size( titles ) === 0).should.be.true;
			} );
			it( "{array of strings} - example: ['Col1','Title2','Other']", function () {
				var titles = ['Col1', 'Title2', 'Other'];
				our_table = new tTable( {
					container: '#table_id',
					titles   : titles
				} );
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( titles[i] );
				} );
				our_table.get( 'titles' ).should.equal( titles );
			} );
			it( "{array of objects} - example object: { title : 'Col1', type: 'number' }", function () {
				var titles = [
					{ title: 'Col1', type: 'string' },
					{ title: 'title2', type: 'number' },
					{ title: 'other', type: 'number' }
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : titles
				} );
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( titles[i].title );
				} );
				our_table.get( 'titles' ).should.equal( titles );
			} );
			it( "{array of objects with sort key} - example object: { title : 'Col1', type: 'number', key: 'column_key' }", function () {
				var titles = [
					{ title: 'Col1', type: 'string' },
					{ title: 'title2', type: 'number' },
					{ title: 'other', type: 'number' }
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : titles
				} );
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( titles[i].title );
				} );
				our_table.get( 'titles' ).should.equal( titles );
			} );
		} );

		describe( "data", function () {
			it( '{array}' );
		} );

		describe( "row_numbers", function () {
			it( '{boolean} - `true`' );
			it( '{boolean} - `false`' );
		} );

		describe( "pager", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'pager' ) === null ).should.be.true;
			} );
			it( "{string} - example: '#table_id_pager'" );
			it( "{DOM element} - example: document.getElementById('table_id_pager')" );
			it( "{jQuery object} - example: $('table_id_pager')" );
		} );
		describe( "page", function () {
			it( "{number}" );
		} );

		describe( "show_pages", function () {
			it( "{boolean}" );
		} );

		describe( "page_size", function () {
			it( "{number}" );
		} );

		describe( "page_sizes", function () {
			it( "`[10, 25, 50] by default`" );
			it( "{array}" );
		} );

		describe( "nav_arrows", function () {
			it( "{boolean}" );
		} );

		describe( "goto", function () {
			it( "{boolean}" );
		} );

		describe( "sorting", function () {
			it( "{boolean}" );
		} );

		describe( "sort_by", function () {
			it( "{number}" );
		} );

		describe( "sort_type", function () {
			it( "{string}" );
		} );

		describe( "sort_td_click", function () {
			it( "{string}" );
		} );

		describe( "prefix", function () {
			it( "{object}" );
		} );

		describe( "suffix", function () {
			it( "{object}" );
		} );

		describe( "formatter", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'formatter' ) === null ).should.be.true;
			} );
			it( "{object}" );
		} );

		describe( "hover_cols", function () {
			it( "{boolean}" );
			it( "{array}" );
		} );

		describe( "hidden_cols", function () {
			it( "{array}" );
		} );

		describe( "search_container", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'search_container' ) === null ).should.be.true;
			} );
			it( "{string}" );
		} );

		describe( "search", function () {
			it( "{boolean}" );
		} );

		describe( "search_auto", function () {
			it( "{boolean}" );
		} );

		describe( "search_sensitive", function () {
			it( "{boolean}" );
		} );

		describe( "search_value", function () {
			it( "{string}" );
		} );

		describe( "ajax", function () {
			it( "{string}" );
		} );

		describe( "other", function () {
			it( "{object}" );
		} );

		describe( "total", function () {
			it( "{boolean}" );
		} );

		describe( "column_bars", function () {
			it( "{boolean}" );
		} );

	} );
})();
