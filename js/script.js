var ttt = {};

$( document ).ready( function (){

	var fake_data = (function (){
		var string_values = ('qwertyuiopasdfghjklzxcvbnm').split( '' ),
			string_values_length = string_values.length,
			number_values = ('1234567890').split( '' ),
			data = [];
		for ( var i = 0; i < 10000; i++ ) {
			var str = (function (){
					var tmp = '';
					for ( var j = 0; j < 15; j++ ) {
						tmp += string_values[Math.floor( Math.random() * string_values_length )];
					}
					return tmp;
				})(),
				num = (function (){
					var tmp = '';
					for ( var j = 0; j < 5; j++ ) {
						tmp += (number_values[Math.floor( Math.random() * 10 )] || 0).toString();
					}
					return parseInt( tmp, 10 );
				})();

			data.push( [str, num] );
		}
		return data;
	})();

	$.ajax( {
		url     : 'js/data.json',
		dataType: 'json',
		success : function ( result ){
			result.projects.formatter = {
				"3": function ( value ){
					return value == 'work' || value == 'opensource' ? '<b>' + value + '</b>' : value;
				}
			};
			ttt.table_id = new tTable( result.projects );
		}
	} );


	ttt.long = new tTable( {
		titles       : [
			{
				"title": "String",
				"type" : "string"
			},
			{
				"title": "Number",
				"type" : "number"
			}
		],
		"page_size"  : 10,
		"start_page" : 1,
		"row_numbers": true,
		"sort_by"    : 1,
		"sorting"    : true,
		"data"       : fake_data,
		"container"  : "#long_table_id",
		"pager"      : "#long_table_id_pager",
		page_sizes   : [10, 25, 50, 100, 250, 500]
	} );


} );