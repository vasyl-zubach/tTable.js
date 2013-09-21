var ttt = {};

$( document ).ready( function (){

	var fake_data = (function (){
			var string_values = ('qwertyuiopasdfghjklzxcvbnm').split( '' ),
				string_values_length = string_values.length,
				number_values = ('1234567890').split( '' ),
				data = [];
			for ( var i = 0; i < 100; i++ ) {
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
		})(),
		table_update = function ( id ){
			var config = ttt[id].config,
				$config = $( '#' + id + '_config' );
			config.page_size = parseInt( $config.find( '[data-page_size]' ).text(), 10 );
			config.start_page = parseInt( $config.find( '[data-start_page]' ).text(), 10 );
			config.row_numbers = $config.find( '[data-row_numbers]' ).text() == "true";
			config.sort_by = parseInt( $config.find( '[data-sort_by]' ).text(), 10 );
			config.sorting = $config.find( '[data-sorting]' ).text() == "true";

			config.nav_arrows = $config.find( '[data-nav_arrows]' ).text() == "true";
			config.show_pages = $config.find( '[data-show_pages]' ).text() == "true";
			config.goto = $config.find( '[data-goto]' ).text() == "true";
			config.page_sizes = $config.find( '[data-page_sizes]' ).text();
			if ( config.page_sizes == 0 || config.page_sizes == "false" || config.page_sizes == "null" || config.page_sizes == "undefined" ) {
				config.page_sizes = false;
			}
			if ( config.page_sizes ) {
				config.page_sizes = config.page_sizes.split( ',' );
			}

			console.log( config );
			ttt[id] = new tTable( config );
		};

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


	$( '.table_id--update' ).off( 'click' ).on( 'click', function (){
		table_update( 'table_id' );
	} );

	$( '#table_id_object' ).off( 'click' ).on( 'click', function (){
		console.log( ttt.table_id );
	} )


	ttt.ajax_table_id = new tTable( {
		container  : '#ajax_table_id',
		pager      : '#ajax_table_id_pager',
		titles     : [
			{ "title": "Project", "type": "string", "key": "name" },
			{ "title": "Link", "type": "string", "key": "link" },
			{ "title": "Type", "type": "string", "key": "type" }
			//			{ "title": "Project", "type": "string" },
			//			{ "title": "Link", "type": "string" },
			//			{ "title": "Type", "type": "string" }
		],
		page_sizes : [2, 3, 4, 5, 6, 7],
		page_size  : 2,
		start_page : 1,
		sorting    : [1, 3],
		row_numbers: true,
		formatter  : {
			"3": function ( value ){
				return value == 'work' || value == 'opensource' ? '<b>' + value + '</b>' : value;
			}
		},
		ajax       : {
			dataType    : 'json',
			url         : function ( from, limit, sort_by, sort_type, search, sensitive ){
				return 'php/ajax.php?limit=' + from + ',' + limit + '&sort_by=' + sort_by + '&sort_type=' + sort_type + '&search=' + search + '&sensitive=' + sensitive;
			},
			//	url : 'php/ajax.php',
			prepare_data: function ( response ){
				return _.map( response.data, function ( item ){
					return _.toArray( item );
				} );
			},
			full_size   : function ( response ){
				return response.count;
			}
		},

		"search"          : true,
		"search_auto"     : false,
		"search_container": "#ajax_table_id_search",
		"search_sensitive": false,
		"search_value"    : ""
	} );

	/*
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
	 page_sizes   : [10, 25, 50, 100, 250, 500],

	 "search"               : true,
	 "search_auto"          : true,
	 "search_container"     : "#long_table_id_search",
	 "search_case_sensitive": false,
	 "search_value"         : ""
	 } );
	 */
} );