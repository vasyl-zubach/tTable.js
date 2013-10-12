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
				];
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
				];
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
				];
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
				];
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
				];
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
				];
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
				];
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
				];
				our_table = new tTable( {
					pager    : '#table_id_pager',
					page_size: 1,
					data     : data
				} );
				our_table.get( 'show_pages' ).should.be.true;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_pages ).length > 0  ).should.be.true;
			} );

			it( "{boolean} - example: `false`", function () {
				var data = [
					["col1", 1, "one"],
					["col2", 2, "two"]
				];
				our_table = new tTable( {
					pager     : '#table_id_pager',
					page_size : 1,
					data      : data,
					show_pages: false
				} );
				our_table.get( 'show_pages' ).should.be.false;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_pages ).length > 0  ).should.be.false;
			} );

			it( 'If there is one page in the table - pages are not displayed', function () {
				var data = [
					["col1", 1, "one"],
					["col2", 2, "two"]
				];
				our_table = new tTable( {
					pager: '#table_id_pager',
					data : data
				} );
				our_table.get( 'show_pages' ).should.be.true;
				( our_table.$pager.find( '.' + our_table.get( 'className' ).pager_pages ).length > 0  ).should.be.false;
			} );
		} );

		describe( "page_size", function () {
			it( "{number} - example `10` (default)", function () {
				var data = [
					["col1", 1, "one"],
					["col2", 2, "two"]
				];
				our_table = new tTable( {
					container: '#table_id',
					pager    : '#table_id_pager',
					data     : data
				} );
				(our_table.get( 'page_size' ) === 10).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				$tr.length.should.equal( data.length + 1 );
				($tr.length <= data.length + 1).should.be.true;
			} );

			it( "{number} - example `1`", function () {
				var data = [
					["col1", 1, "one"],
					["col2", 2, "two"]
				];
				our_table = new tTable( {
					container: '#table_id',
					pager    : '#table_id_pager',
					data     : data,
					page_size: 1
				} );
				(our_table.get( 'page_size' ) === 1).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				$tr.length.should.equal( our_table.get( 'page_size' ) + 1 );
			} );
		} );

		describe( "page_sizes", function () {
			it( "{array} - example: `[10, 25, 50]` (default)", function () {
				our_table = new tTable( {
					pager: '#table_id_pager'
				} );
				(our_table.get( 'page_sizes' ).join( ', ' )).should.equal( tTable_defaults.page_sizes.join( ', ' ) );
				var $option = our_table.$pager.find( '.' + our_table.get( 'className' ).pager_page_size ).find( 'option' );
				for ( var i = 0, o_l = $option.length; i < o_l; i++ ) {
					$option[i].value.toString().should.equal( tTable_defaults.page_sizes[i].toString() );
				}
			} );

			it( "{array} - example: `[1, 2, 5, 10, 15, 20]`", function () {
				var ps = [1, 2, 5, 10, 15, 20];
				our_table = new tTable( {
					pager     : '#table_id_pager',
					page_sizes: ps
				} );
				(our_table.get( 'page_sizes' ).join( ', ' )).should.equal( ps.join( ', ' ) );
				var $option = our_table.$pager.find( '.' + our_table.get( 'className' ).pager_page_size ).find( 'option' );
				for ( var i = 0, o_l = $option.length; i < o_l; i++ ) {
					$option[i].value.toString().should.equal( ps[i].toString() );
				}
			} );
		} );

		describe( "goto", function () {
			it( "{boolean} - example: `true` (default)", function () {
				our_table = new tTable( {
					pager    : '#table_id_pager',
					data     : [
						[12],
						[13]
					],
					page_size: 1
				} );
				our_table.get( 'goto' ).should.be.true;
				(our_table.$pager.find( '.' + our_table.get( 'className' ).pager_goto ).length > 0).should.be.true;
			} );

			it( "{boolean} - example: `false`", function () {
				our_table = new tTable( {
					pager    : '#table_id_pager',
					data     : [
						[12],
						[13]
					],
					goto     : false,
					page_size: 1
				} );
				our_table.get( 'goto' ).should.be.false;
				(our_table.$pager.find( '.' + our_table.get( 'className' ).pager_goto ).length > 0).should.be.false;
			} );

			it( "If there is one page in the table - goto field is not displayed", function () {
				our_table = new tTable( {
					pager: '#table_id_pager'
				} );
				our_table.get( 'goto' ).should.be.true;
				(our_table.$pager.find( '.' + our_table.get( 'className' ).pager_goto ).length > 0).should.be.false;
			} );
		} );

		describe( "sorting", function () {
			it( "{boolean} - example `true` (default)", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3']
				} );
				our_table.get( 'sorting' ).should.be.true;
				(our_table.$el.find( '.' + our_table.get( 'className' ).sorting ).length == our_table.get( 'titles' ).length).should.be.true;
				(our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' ).find( '.' + our_table.get( 'className' ).sorting ).length == our_table.get( 'titles' ).length).should.be.true;
			} );

			it( "{boolean} - example `false` - disable sorting at all", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					sorting  : false
				} );
				our_table.get( 'sorting' ).should.be.false;
				(our_table.$el.find( '.' + our_table.get( 'className' ).sorting ).length === 0).should.be.true;
			} );

			it( "{array} - example `[1, 3]` - add sorting to specified columns", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					sorting  : [1, 3]
				} );
				our_table.get( 'sorting' ).join( ',' ).should.equal( '1,3' );
				(our_table.$el.find( '.' + our_table.get( 'className' ).sorting ).length == our_table.get( 'sorting' ).length).should.be.true;
				var $td = our_table.$el.find( '.' + our_table.get( 'className' ).head ).find( 'td' );
				($( $td.eq( 0 ) ).find( '.' + our_table.get( 'className' ).sorting ).length > 0).should.be.true;
				($( $td.eq( 1 ) ).find( '.' + our_table.get( 'className' ).sorting ).length === 0).should.be.true;
				($( $td.eq( 2 ) ).find( '.' + our_table.get( 'className' ).sorting ).length > 0).should.be.true;
			} );
		} );

		describe( "sort_by", function () {
			it( "{number} - example `0` (default, means sorting disabled)", function () {
				var data = [
					[1, 2, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data )
				} );
				(our_table.get( 'sort_by' ) === 0).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				for ( var i = 1, tr_l = $tr.length; i < tr_l; i++ ) {
					var $td = $tr.eq( i ).find( 'td' );
					for ( var j = 0, td_l = $td.length; j < td_l; j++ ) {
						$( $td[j] ).html().should.equal( data[i - 1][j].toString() );
					}
				}
			} );

			it( "{number} - example `1` (sort by 1 column)", function () {
				var data = [
					[1, 2, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					sort_by  : 1
				} );
				(our_table.get( 'sort_by' ) === 1).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				$tr.eq( 1 ).find( 'td' ).eq( 0 ).html().should.equal( '1' );
				$tr.eq( 2 ).find( 'td' ).eq( 0 ).html().should.equal( '2' );
				$tr.eq( 3 ).find( 'td' ).eq( 0 ).html().should.equal( '3' );
			} );

			it( "{number} - example `-1` (bad value - no sorting)", function () {
				var data = [
					[1, 2, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					sort_by  : -1
				} );
				(our_table.get( 'sort_by' ) == -1).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				for ( var i = 1, tr_l = $tr.length; i < tr_l; i++ ) {
					var $td = $tr.eq( i ).find( 'td' );
					for ( var j = 0, td_l = $td.length; j < td_l; j++ ) {
						$( $td[j] ).html().should.equal( data[i - 1][j].toString() );
					}
				}
			} );

			it( "{number} - example `100`  (more than columns - no sorting)", function () {
				var data = [
					[1, 2, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					sort_by  : 100
				} );
				(our_table.get( 'sort_by' ) === 100).should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				for ( var i = 1, tr_l = $tr.length; i < tr_l; i++ ) {
					var $td = $tr.eq( i ).find( 'td' );
					for ( var j = 0, td_l = $td.length; j < td_l; j++ ) {
						$( $td[j] ).html().should.equal( data[i - 1][j].toString() );
					}
				}
			} );
		} );

		describe( "sort_type", function () {
			it( "{string} - example: `ask` (default)", function () {
				var data = [
					[1, 1, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					sort_by  : 2
				} );
				(our_table.get( 'sort_type' ) === 'asc').should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				$tr.eq( 1 ).find( 'td' ).eq( 1 ).html().should.equal( '1' );
				$tr.eq( 2 ).find( 'td' ).eq( 1 ).html().should.equal( '2' );
				$tr.eq( 3 ).find( 'td' ).eq( 1 ).html().should.equal( '3' );
			} );

			it( "{string} - example: `desc`", function () {
				var data = [
					[1, 1, 3],
					[3, 2, 1],
					[2, 3, 1]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					sort_by  : 2,
					sort_type: 'desc'
				} );
				(our_table.get( 'sort_type' ) === 'desc').should.be.true;
				var $tr = our_table.$el.find( 'tr' );
				$tr.eq( 1 ).find( 'td' ).eq( 1 ).html().should.equal( '3' );
				$tr.eq( 2 ).find( 'td' ).eq( 1 ).html().should.equal( '2' );
				$tr.eq( 3 ).find( 'td' ).eq( 1 ).html().should.equal( '1' );
			} );
		} );

		describe( "sort_td_click", function () {
			it( "{string}" );
		} );

		describe( "prefix", function () {
			it( "{object} - empty by default", function () {
				our_table = new tTable();
				(_.size( our_table.get( 'prefix' ) ) === 0).should.be.true;
			} );
			it( "{object} - example `{'2':'$'}` (means that 2nd column values will be with `$` sign at the beginning of output)", function () {
				var data = [
					[1, 2, 3]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					prefix   : {'1': '$'}
				} );
				(our_table.get( 'prefix' )['1'] === '$').should.be.true;
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				$td.eq( 0 ).html().should.equal( '$' + data[0][0] );
				$td.eq( 1 ).html().should.equal( data[0][1].toString() );
				$td.eq( 2 ).html().should.equal( data[0][2].toString() );
			} );
		} );

		describe( "suffix", function () {
			it( "{object} - empty by default", function () {
				our_table = new tTable();
				(_.size( our_table.get( 'suffix' ) ) === 0).should.be.true;
			} );

			it( "{object} - example `{'2':'$'}` (means that 2nd column values will be with `$` sign at the end of output)", function () {
				var data = [
					[1, 2, 3]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					suffix   : {'1': '$'}
				} );
				(our_table.get( 'suffix' )['1'] === '$').should.be.true;
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				$td.eq( 0 ).html().should.equal( data[0][0] + '$' );
				$td.eq( 1 ).html().should.equal( data[0][1].toString() );
				$td.eq( 2 ).html().should.equal( data[0][2].toString() );
			} );
		} );

		describe( "formatter", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'formatter' ) === null ).should.be.true;
			} );

			it( "{object} with key - column number, value - function that prepare your value to output", function () {
				var data = [
					[1, 2, 3]
				];
				our_table = new tTable( {
					container: '#table_id',
					titles   : ['1', '2', '3'],
					data     : _.clone( data ),
					formatter: {
						'1': function ( value ) {
							return value / 10 + ' ololo';
						}
					}
				} );
				var $td = our_table.$el.find( 'tr' ).eq( 1 ).find( 'td' );
				$td.eq( 0 ).html().should.equal( 1 / 10 + ' ololo' );
				$td.eq( 1 ).html().should.equal( data[0][1].toString() );
				$td.eq( 2 ).html().should.equal( data[0][2].toString() );
			} );
		} );

		describe( "hover_cols", function () {
			it( "{boolean} - example `false` (default)", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [1, 2, 3]
				} );
				our_table.get( 'hover_cols' ).should.be.false;
			} );
			it( "{boolean} - example `true`", function () {
				our_table = new tTable( {
					container : '#table_id',
					titles    : [1, 2, 3],
					hover_cols: true
				} );
				our_table.get( 'hover_cols' ).should.be.true;
			} );
			it( "{array} - example `[1,3]` - hover reacts only for specified columns", function () {
				our_table = new tTable( {
					container : '#table_id',
					titles    : [1, 2, 3],
					hover_cols: [1, 3]
				} );
				our_table.get( 'hover_cols' ).join( ',' ).should.equal( '1,3' );
			} );
		} );

		describe( "hidden_cols", function () {
			it( "{array} - `[ ]` empty array by default", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [1, 2, 3],
					data     : [
						[11, 12, 13],
						[21, 22, 23]
					]
				} );
				our_table.get( 'hidden_cols' ).length.should.be.zero;
				var $tr = our_table.$el.find( 'tr' );
				for ( var i = 1, tr_l = $tr.length; i < tr_l; i++ ) {
					var $td = $tr.eq( i ).find( 'td' );
					($td.length == our_table.get( 'data' )[i - 1].length).should.be.true;
					for ( var j = 0, td_l = $td.length; j < td_l; j++ ) {
						$( $td[j] ).html().should.equal( our_table.get( 'data' )[i - 1][j].toString() );
					}
				}
			} );
			it( "{array} - example: `[1,3]` - means that defined columns will be not displayed", function () {
				our_table = new tTable( {
					container  : '#table_id',
					titles     : [1, 2, 3],
					data       : [
						[11, 12, 13],
						[21, 22, 23]
					],
					hidden_cols: [1, 3]
				} );
				our_table.get( 'hidden_cols' ).length.should.be.zero;
				var $tr = our_table.$el.find( 'tr' );
				for ( var i = 1, tr_l = $tr.length; i < tr_l; i++ ) {
					var $td = $tr.eq( i ).find( 'td' );
					($td.length == our_table.get( 'data' )[i - 1].length - our_table.get( 'hidden_cols' ).length).should.be.true;
					$td.eq( 0 ).html().should.equal( our_table.get( 'data' )[i - 1][1].toString() );
				}
			} );
		} );

		describe( "search_container", function () {
			it( "`null` by default", function () {
				our_table = new tTable();
				( our_table.get( 'search_container' ) === null ).should.be.true;
			} );

			it( "{string} - example: '#table_id_search'", function () {
				var search_container = '#table_id_search';
				our_table = new tTable( {
					container       : '#table_id',
					search          : true,
					search_container: search_container
				} );
				(our_table.get( 'search_container' ) ).should.equal( search_container );
				(our_table.$search.find( '.' + our_table.get( 'className' ).search ).length > 0).should.be.true;
			} );

			it( "{DOM element} - example: document.getElementById('table_id_search')", function () {
				var search_container = document.getElementById( 'table_id_search' );
				our_table = new tTable( {
					container       : '#table_id',
					search          : true,
					search_container: search_container
				} );
				(our_table.get( 'search_container' ) ).should.equal( search_container );
				(our_table.$search.find( '.' + our_table.get( 'className' ).search ).length > 0).should.be.true;
			} );

			it( "{jQuery object} - example: $('#table_id_search')", function () {
				var search_container = $( '#table_id_search' );
				our_table = new tTable( {
					container       : '#table_id',
					search          : true,
					search_container: search_container
				} );
				(our_table.get( 'search_container' ) ).should.equal( search_container );
				(our_table.$search.find( '.' + our_table.get( 'className' ).search ).length > 0).should.be.true;
			} );
		} );

		describe( "search", function () {
			it( "{boolean} - example `false` (default)", function () {
				var search_container = $( '#table_id_search' );
				our_table = new tTable( {
					container       : '#table_id',
					search_container: search_container
				} );
				(our_table.get( 'search_container' ) ).should.equal( search_container );
				(!!our_table.$search).should.be.false;
			} );

			it( "{boolean} - example `true`", function () {
				var search_container = $( '#table_id_search' );
				our_table = new tTable( {
					container       : '#table_id',
					search          : true,
					search_container: search_container
				} );
				(our_table.get( 'search_container' ) ).should.equal( search_container );
				(!!our_table.$search).should.be.true;
			} );
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

		describe( "show_min", function () {
			it( "{boolean} - example `false` (default)", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					]
				} );
				our_table.get( 'show_min' ).should.be.false;
				(our_table.$el.find( '.' + our_table.get( 'className' ).min_value ).length === 0).should.be.true
			} );
			it( "{boolean} - example `true`", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					],
					show_min : true
				} );
				our_table.get( 'show_min' ).should.be.true;
				// (our_table.$el.find( '.' + our_table.get( 'className' ).min_value ).length >= our_table.getData()[0].length).should.be.true
				(our_table.$el.find( '.' + our_table.get( 'className' ).min_value ).length === our_table.getData()[0].length).should.be.true
			} );
			it( "{array} - example `[1,3]`", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					],
					show_min : [1, 3]
				} );
				our_table.get( 'show_min' ).join( ',' ).should.equal( '1,3' );
				(our_table.$el.find( '.' + our_table.get( 'className' ).min_value ).length == our_table.get( 'show_min' ).length).should.be.true
			} );
		} );

		describe( "show_max", function () {
			it( "{boolean} - example `false` (default)", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					]
				} );
				our_table.get( 'show_max' ).should.be.false;
				(our_table.$el.find( '.' + our_table.get( 'className' ).max_value ).length === 0).should.be.true
			} );
			it( "{boolean} - example `true`", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					],
					show_max : true
				} );
				our_table.get( 'show_max' ).should.be.true;
				// (our_table.$el.find( '.' + our_table.get( 'className' ).min_value ).length >= our_table.getData()[0].length).should.be.true
				(our_table.$el.find( '.' + our_table.get( 'className' ).max_value ).length === our_table.getData()[0].length).should.be.true
			} );
			it( "{array} - example `[1,3]`", function () {
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'},
						{title: '3', type: 'number'}
					],
					data     : [
						[11, 12, 13],
						[21, 22, 32],
						[31, 32, 33]
					],
					show_max : [1, 3]
				} );
				our_table.get( 'show_max' ).join( ',' ).should.equal( '1,3' );
				(our_table.$el.find( '.' + our_table.get( 'className' ).max_value ).length == our_table.get( 'show_max' ).length).should.be.true
			} );
		} );

		describe( "column_bars", function () {
			it( "{boolean}" );
		} );

	} );
})();
