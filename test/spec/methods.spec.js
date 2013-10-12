/*global describe, it */

(function (){

	describe( 'Methods: ', function (){
		var our_table = {};
		beforeEach( function (){
			if ( our_table.destroy ) {
				our_table.destroy();
			}
			our_table = {};
		} )

		describe( 'init() - Initialize tTable with it options', function (){
			it( 'initialize tTable', function (){
				our_table = new tTable();
				(our_table instanceof tTable).should.be.true;
			} );

			it( 'fill new tTable object with properties', function (){
				our_table = new tTable();
				(our_table.config !== undefined).should.be.true;
				// TODO: check other properties
			} );
		} );

		describe( "destroy()", function (){
			it( 'destroy events' );
			it( 'clear containers', function (){
				our_table = new tTable( {
					container       : '#table_id',
					pager           : '#table_id_pager',
					search          : true,
					search_container: '#table_id_search'
				} );
				(our_table.$el.html() !== '' ).should.be.true;
				(our_table.$pager.html() !== '' ).should.be.true;
				(our_table.$search.html() !== '' ).should.be.true;
				our_table.destroy();
				(our_table.$el.html() === '' ).should.be.true;
				(our_table.$pager.html() === '' ).should.be.true;
				(our_table.$search.html() === '' ).should.be.true;
			} );
		} );

		describe( "get( what )", function (){
			it( '{string} what - option that you want to get', function (){
				our_table = new tTable( {
					unexisted_option: 'unexisted_option'
				} );
				(our_table.get( 'unexisted_option' )).should.equal( 'unexisted_option' );
			} );
		} );

		describe( "set( what )", function (){
			it( '{object} what - {property: new_value}', function (){
				our_table = new tTable();
				(our_table.get( 'sort_by' )).should.equal( 0 );
				our_table.set( {sort_by: 4} );
				(our_table.get( 'sort_by' )).should.equal( 4 );
			} );
		} );

		describe( "countPages()", function (){
			it( 'count table pages and returns the value', function (){
				our_table = new tTable( {
					data: [
						[1],
						[2],
						[3]
					]
				} );
				our_table.countPages().should.equal( 1 );
				our_table.set( {page_size: 1} ).goto( 1 );
				our_table.countPages().should.equal( 3 );
			} );
			it( 'minimum value `1`, even if there is no data', function (){
				our_table = new tTable();
				our_table.countPages().should.equal( 1 );
			} );
		} );

		describe( "dataSize()", function (){
			it( 'returns total table data size', function (){
				our_table = new tTable();
				our_table.dataSize().should.equal( 0 );
			} );
			it( 'depends of search' );
			it( 'depends of filters' );
		} );

		describe( "getData()", function (){
			it( 'returns table data array', function (){
				our_table = new tTable( {
					data: [
						[11, 12, 13],
						[21, 22, 23],
						[31, 32, 33]
					]
				} );
				var data = our_table.getData()
				data.length.should.equal( 3 );
				data[0].join( ',' ).should.equal( [11, 12, 13].join( ',' ) );
				data[1].join( ',' ).should.equal( [21, 22, 23].join( ',' ) );
				data[2].join( ',' ).should.equal( [31, 32, 33].join( ',' ) );
			} );
			it( 'depends of search' );
			it( 'depends of filters' );
		} );

		describe( "getPageData()", function (){
			it( 'returns table data array that relates to current chosen page', function (){
				our_table = new tTable( {
					data     : [
						[11, 12, 13],
						[21, 22, 23],
						[31, 32, 33]
					],
					page_size: 2
				} );
				var data = our_table.getPageData();
				data.length.should.equal( 2 );
				data[0].join( ',' ).should.equal( [11, 12, 13].join( ',' ) );
				data[1].join( ',' ).should.equal( [21, 22, 23].join( ',' ) );

				our_table.goto( 2 );
				data = our_table.getPageData();
				data.length.should.equal( 1 );
				data[0].join( ',' ).should.equal( [31, 32, 33].join( ',' ) );
			} );
			it( 'depends of search' );
			it( 'depends of filters' );
		} );

		describe( "searchData( data, search )", function (){
			it( 'searches data, and return new array that relates to search string' );
		} );

		describe( "getSortKey() - get sort column key", function (){
			it( '`0` - if there is no sorting', function (){
				our_table = new tTable( {
					titles: [1, 2, 3]
				} );
				our_table.getSortKey().should.equal( 0 );
			} );
			it( '{number} - if there is some sorting and no key in titles', function (){
				our_table = new tTable( {
					titles : [1, 2, 3],
					sort_by: 2
				} );
				our_table.getSortKey().should.equal( 2 );
			} );
			it( '{string} - if key in titles defined', function (){
				our_table = new tTable( {
					titles : [
						{ title: '1', type: 'string', key: 'some'}
					],
					sort_by: 1
				} );
				our_table.getSortKey().should.equal( 'some' );
			} );
		} );

		describe( "getSortType()", function (){
			it( 'column sort type', function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{ title: '1', type: 'number'}
					],
					data     : [
						[1],
						[2]
					],
					sort_by  : 1
				} );
				our_table.getSortType().should.equal( 'asc' );
				var $tr = our_table.$el.find( 'tr' );
				$tr.eq( 1 ).find( 'td' ).eq( 0 ).html().should.equal( '1' );
				our_table.set( {sort_type: 'desc'} ).goto( 1 );
				our_table.getSortType().should.equal( 'desc' );
				$tr = our_table.$el.find( 'tr' );
				$tr.eq( 1 ).find( 'td' ).eq( 0 ).html().should.equal( '2' );
			} );
		} );

		describe( "getSortDataType() - returns column sort data type", function (){
			it( '{string} - `string`', function (){
				our_table = new tTable( {
					titles : [
						{ title: '1', type: 'string'}
					],
					sort_by: 1
				} );
				our_table.getSortDataType().should.equal( 'string' );
			} );

			it( '{string} - `number`', function (){
				our_table = new tTable( {
					titles : [
						{ title: '1', type: 'number'}
					],
					sort_by: 1
				} );
				our_table.getSortDataType().should.equal( 'number' );
			} );

			it( '{string} - if type is not defined in titles - `string`', function (){
				our_table = new tTable( {
					titles : [
						'some title'
					],
					sort_by: 1
				} );
				our_table.getSortDataType().should.equal( 'string' );
			} );
		} );

		describe( "sortData( data, sort_by, sort_type )", function (){
			it( 'Sort table data' );
		} );

		describe( "getTotal( column ) - get total value of column data", function (){
			it( '{number} column', function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'}
					],
					data     : [
						[11, 12],
						[21, 22],
						[31, 32]
					]
				} );
				our_table.getTotal( 1 ).should.equal( 11 + 21 + 31 );
				our_table.getTotal( 2 ).should.equal( 12 + 22 + 32 );
			} );
		} );

		describe( "getPageTotal( column, page ) - get total counts for some page", function (){
			it( "*{number} column, {null} page", function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'}
					],
					data     : [
						[11, 12],
						[21, 22],
						[31, 32]
					],
					page_size: 2
				} );
				our_table.getPageTotal( 1 ).should.equal( 11 + 21 );
				our_table.getPageTotal( 2 ).should.equal( 12 + 22 );
			} );
			it( "*{number} column, {number} page", function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'}
					],
					data     : [
						[11, 12],
						[21, 22],
						[31, 32],
						[41, 42]
					],
					page_size: 2
				} );
				our_table.getPageTotal( 1, 2 ).should.equal( 31 + 41 );
				our_table.getPageTotal( 2, 2 ).should.equal( 32 + 42 );
			} );
		} );

		describe( "getOtherTotal( column, page ) - get total counts for some page", function (){
			it( "*{number} column, {null} page", function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'}
					],
					data     : [
						[11, 12],
						[21, 22],
						[31, 32],
						[41, 42]
					],
					page_size: 2
				} );
				our_table.getOtherTotal( 1 ).should.equal( 31 + 41 );
				our_table.getOtherTotal( 2 ).should.equal( 32 + 42 );
			} );

			it( "*{number} column, {number} page", function (){
				our_table = new tTable( {
					container: '#table_id',
					titles   : [
						{title: '1', type: 'number'},
						{title: '2', type: 'number'}
					],
					data     : [
						[11, 12],
						[21, 22],
						[31, 32],
						[41, 42]
					],
					page_size: 2
				} );
				our_table.getOtherTotal( 1, 2 ).should.equal( 11 + 21 );
				our_table.getOtherTotal( 2, 2 ).should.equal( 12 + 22 );
			} );
		} );

		describe( "getMin( column ) - get column minimum value", function (){
			it( '{number} *column', function (){
				our_table = new tTable( {
					titles   : [
						{title: '1', type: 'number'}
					],
					data     : [
						[11.12],
						[21.4],
						[31],
						[41.5]
					],
					page_size: 2
				} );
				our_table.getMin( 1 ).should.equal( 11.12 );
			} );
			it( 'creates min property', function (){
				our_table = new tTable( {
					titles   : [
						{title: '1', type: 'number'}
					],
					data     : [
						[11.12],
						[21.4],
						[31],
						[41.5]
					],
					page_size: 2
				} );
				our_table.getMin( 1 );
				our_table.min[1].should.equal( 11.12 );
			} );
		} );

		describe( "getMax( column ) - get column largest value", function (){
			it( '{number} *column', function (){
				our_table = new tTable( {
					titles   : [
						{title: '1', type: 'number'}
					],
					data     : [
						[11.12],
						[21.4],
						[31],
						[41.5]
					],
					page_size: 2
				} );
				our_table.getMax( 1 ).should.equal( 41.5 );
			} );
			it( 'creates max property', function (){
				our_table = new tTable( {
					titles   : [
						{title: '1', type: 'number'}
					],
					data     : [
						[11.12],
						[21.4],
						[31],
						[41.5]
					],
					page_size: 2
				} );
				our_table.getMax( 1 );
				our_table.max[1].should.equal( 41.5 );
			} );
		} );

		describe( "addRow( row )", function (){
			it( 'todo' )
		} );

		describe( "updateRow( update, where )", function (){
			it( 'todo' )
		} );

		describe( "delRow( where )", function (){
			it( 'todo' )
		} );

		describe( "goto( page )", function (){
			it( 'goes to specified page', function (){
				our_table = new tTable( {
					data     : [
						[11, 12, 13],
						[21, 22, 23],
						[31, 32, 33]
					],
					page_size: 2
				} );
				our_table.goto( 2 );
				our_table.get( 'page' ).should.equal( 2 );
			} );
		} );
	} );
}());
