var table_project;

$( document ).ready( function (){
	$.ajax( {
		url     : 'js/data.json',
		dataType: 'json',
		success : function ( result ){
			table_project = new tTable( result.projects );
		}
	} );
	var fake_data = (function (){
		return [];
	})();
} );