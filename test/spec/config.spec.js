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

			it( '`[ ]` empty array by default', function () {
				our_table = new tTable();
				(our_table.get( 'data' ).length === 0 ).should.be.true;
			} );

			it( '{array}: example for 1 row with 3 columns table [["column1", 2, "three"]]', function () {
				var data = [
					["column1", 2, "three"]
				];
				our_table = new tTable( {
					container: '#table_id',
					data     : data
				} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( data[0][i].toString() );
				} );
				our_table.get( 'data' ).should.equal( data );
			} );

		} );

		describe( "row_numbers", function () {

			it( '{boolean} - `false` (default)', function () {
				var titles = ['Col1', 'Title2', 'Other'];
				our_table = new tTable( {
					container: '#table_id',
					titles   : titles
				} );
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				($td.eq( 0 ).text() == titles[0]).should.be.true;
				($td.length == titles.length).should.be.true;
			} );

			it( '{boolean} - `true`', function () {
				var titles = ['Col1', 'Title2', 'Other'];
				our_table = new tTable( {
					container  : '#table_id',
					titles     : titles,
					row_numbers: true
				} );
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				($td.eq( 0 ).text() == '#').should.be.true;
				($td.length == titles.length + 1).should.be.true;
			} );

		} );

		describe( "pager", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'pager' ) === null ).should.be.true;
			} );

			it( "{string} - example: '#table_id_pager'", function () {
				var pager = '#table_id_pager';
				our_table = new tTable( {
					pager: pager
				} );
				( our_table.get( 'pager' ) === pager ).should.be.true;
				( our_table.$pager.length > 0  ).should.be.true;
			} );

			it( "{DOM element} - example: document.getElementById('table_id_pager')", function () {
				var pager = document.getElementById( 'table_id_pager' );
				our_table = new tTable( {
					pager: pager
				} );
				( our_table.get( 'pager' ) === pager ).should.be.true;
				( our_table.$pager.length > 0  ).should.be.true;
			} );

			it( "{jQuery object} - example: $('table_id_pager')", function () {
				var pager = $( '#table_id_pager' );
				our_table = new tTable( {
					pager: pager
				} );
				( our_table.get( 'pager' ) === pager ).should.be.true;
				( our_table.$pager.length > 0  ).should.be.true;
			} );

		} );

		describe( "page", function () {
			it( "{number} - 1 by default", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						container: '#table_id',
						pager    : '#table_id_pager',
						page_size: 1,
						data     : data
					} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( data[0][i].toString() );
				} );
			} );

			it( "{number} - example: 2", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						container: '#table_id',
						pager    : '#table_id_pager',
						page     : 2,
						page_size: 1,
						data     : data
					} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( data[1][i].toString() );
				} );
			} );

			it( "{number} - example: 100500 (more than exist in table, will show last)", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						container: '#table_id',
						pager    : '#table_id_pager',
						page     : 100500,
						page_size: 1,
						data     : data
					} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( data[1][i].toString() );
				} );
			} );

			it( "{number} - example: -100500 (less than exist in table, will show first)", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						container: '#table_id',
						pager    : '#table_id_pager',
						page     : -100500,
						page_size: 1,
						data     : data
					} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				_.each( $td, function ( td, i ) {
					($( td ).text()).should.equal( data[0][i].toString() );
				} );
			} );

		} );

		describe( "nav_arrows", function () {

			it( "{boolean} - example: `true` (default)", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager    : '#table_id_pager',
						page_size: 1,
						data     : data
					} );
				our_table.get( 'nav_arrows' ).should.be.true;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_arrows ).length > 0  ).should.be.true;
			} );

			it( "{boolean} - example: `false`", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager     : '#table_id_pager',
						page_size : 1,
						data      : data,
						nav_arrows: false
					} );
				our_table.get( 'nav_arrows' ).should.be.false;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_arrows ).length > 0  ).should.be.false;
			} );

			it( 'If there is one page in the table - navigation arrows are not displayed', function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager: '#table_id_pager',
						data : data
					} );
				our_table.get( 'nav_arrows' ).should.be.true;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_arrows ).length > 0  ).should.be.false;
			} );
		} );

		describe( "show_pages", function () {
			it( "{boolean} - example: `true` (default)", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager    : '#table_id_pager',
						page_size: 1,
						data     : data
					} );
				our_table.get( 'show_pages' ).should.be.true;
				console.log( our_table.$pager.html() );
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_pages ).length > 0  ).should.be.true;
			} );

			it( "{boolean} - example: `false`", function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager     : '#table_id_pager',
						page_size : 1,
						data      : data,
						nav_arrows: false
					} );
				our_table.get( 'nav_arrows' ).should.be.false;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_arrows ).length > 0  ).should.be.false;
			} );

			it( 'If there is one page in the table - navigation arrows are not displayed', function () {
				var data = [
						["col1", 1, "one"],
						["col2", 2, "two"]
					],
					our_table = new tTable( {
						pager: '#table_id_pager',
						data : data
					} );
				our_table.get( 'nav_arrows' ).should.be.true;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_arrows ).length > 0  ).should.be.false;
			} );
		} );

		describe( "page_size", function () {
			it( "{number}" );
		} );

		describe( "page_sizes", function () {
			it( "`[10, 25, 50] by default`" );
			it( "{array}" );
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
