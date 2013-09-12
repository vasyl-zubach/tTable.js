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
				"3": function (){
					return this == 'work' || this == 'opensource' ? '<b>' + this + '</b>' : this;
				}
			};
			ttt.table_id = new tTable( result.projects );
		}
	} );

	$( 'code:not(.prettyprint)' ).addClass( 'prettyprint' ).addClass( 'linenums' );
	prettyPrint();

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
		sorting    : [1,3],
		row_numbers: true,
		formatter  : {
			"3": function (){
				return this == 'work' || this == 'opensource' ? '<b>' + this + '</b>' : this;
			}
		},
		ajax       : {
			dataType    : 'json',
			url         : function ( from, limit, sort_by, sort_type ){
				return 'php/ajax.php?limit=' + from + ',' + limit + '&sort_by=' + sort_by + '&sort_type=' + sort_type;
			},
			//			url         : 'php/ajax.php',
			prepare_data: function ( response ){
				return _.map( response.data, function ( item ){
					return _.toArray( item );
				} );
			},
			full_size   : function ( response ){
				return response.count;
			}
		}
	} );

} );