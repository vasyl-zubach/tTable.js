/*global describe, it */

(function (){
	describe( 'init', function (){

		it( 'Instance of tTable', function (){
			var new_table = new tTable(),
				new_table_instance = new_table instanceof tTable;

			new_table_instance.should.be.true;
		} );

	} );
})();
