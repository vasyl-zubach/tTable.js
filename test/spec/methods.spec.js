/*global describe, it */

(function () {

	describe( 'Methods: ', function () {
		describe( 'init() - Initialize tTable with it options', function () {
			it( 'init() - initialize tTable', function () {
				var new_table = new tTable(),
					new_table_instance = new_table instanceof tTable;

				new_table_instance.should.be.true;
			} );
		} );

		describe( "destroy()", function () {
		} );
		describe( "get( what )", function () {
		} );
		describe( "set( what )", function () {
		} );
		describe( "countPages()", function () {
		} );
		describe( "dataSize()", function () {
		} );
		describe( "getData()", function () {
		} );
		describe( "getPageData()", function () {
		} );
		describe( "searchData( data, search )", function () {
		} );
		describe( "getSortKey()", function () {
		} );
		describe( "getSortType()", function () {
		} );
		describe( "getSortDataType()", function () {
		} );
		describe( "sortData( data, sort_by, sort_type )", function () {
		} );
		describe( "getTotal( column )", function () {
		} );
		describe( "addRow( row )", function () {
		} );
		describe( "updateRow( update, where )", function () {
		} );
		describe( "delRow( where )", function () {
		} );
		describe( "goto( page )", function () {
		} );


	} );
})();
