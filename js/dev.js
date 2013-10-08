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


	//	function commafy( num ) {
	//		var str = num.toString().split('.');
	//		if (str[0].length >= 5) {
	//			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	//		}
	//		if (str[1] && str[1].length >= 5) {
	//			str[1] = str[1].replace(/(\d{3})/g, '$1 ');
	//		}
	//		return str.join('.');
	//	}


	var commafy = function ( num ){
		var str = num.toString().split( '.' );
		if ( str[0].length >= 4 ) {
			str[0] = str[0].replace( /(\d)(?=(\d{3})+$)/g, '$1,' );
		}
		return str.join( '.' );
	}

	window.ttt_others = new tTable( {
		titles          : [
			{ title: "Campaigns", type: "string" },
			{ title: "Unique Visitors", type: "number" },
			{ title: "Downloads", type: "number" },
			{ title: "Revenue", type: "number" },
			{ title: "Sales", type: "number" },
			{ title: "Downloads > Sales", type: "number" },
			{ title: "Visits > Sales", type: "number" }
		],
		data            : [
			["Christmass Sale / Newsletter", 15257, 5678, 5700, 3821, 0.67, 0.25],
			["Christmass Sale / Banners", 18759, 8316, 4663, 6498, 0.78, 0.34],
			["Christmass Sale / Landing 1", 17314, 6099, 3218, 5448, 0.89, 0.31],
			["Christmass Sale / Landing 2", 18868, 5652, 5941, 5367, 0.94, 0.28],
			["Christmass Sale / AdWords", 15113, 6769, 4852, 3418, 0.50, 0.22],
			["Christmass Sale / Mailing", 15313, 5541, 3514, 3803, 0.68, 0.24],
			["Some Campaign / Newsletter", 12891, 8512, 5107, 4561, 0.53, 0.35],
			["Some Campaign / Banners", 13554, 7446, 2345, 5920, 0.79, 0.43],
			["Some Campaign / Landing 1", 17534, 8101, 1657, 3986, 0.49, 0.22],
			["Some Campaign / Landing 2", 16253, 8312, 3803, 3486, 0.41, 0.21],
			["Some Campaign / AdWords", 16086, 9401, 5823, 5906, 0.62, 0.36],
			["Some Campaign / Mailing", 16334, 7988, 3085, 5586, 0.69, 0.34]
		],
		other           : {
			'1': 'Summary',
			'6': function (){
				return ((this.getOtherTotal( 5, 1 ) / this.getOtherTotal( 3, 1 )) * 100).toFixed( 2 );
			},
			'7': function (){
				return ((this.getOtherTotal( 5, 1 ) / this.getOtherTotal( 2, 1 )) * 100).toFixed( 2 );
			}
		},
		total           : {
			'1': 'Totals',
			'6': function (){
				return ((this.getTotal( 5, 1 ) / this.getTotal( 3, 1 )) * 100).toFixed( 2 );
			},
			'7': function (){
				return ((this.getTotal( 5, 1 ) / this.getTotal( 2, 1 )) * 100).toFixed( 2 );
			}
		},
		column_bars     : true,
		page_size       : 5,
		container       : '#other_table_id',
		pager           : '#other_table_id_pager',
		search_container: '#other_table_id_search',
		search          : [1],
		sort_td_click   : true,
		prefix          : {
			'4': '$'
		},
		suffix          : {
			'6': '%',
			'7': '%'
		},
		row_numbers     : true,
		page_size       : 3,
		sorting         : [2, 3, 4, 5, 6, 7],
		formatter       : {
			'1': function ( value ){
				return '<a href="#link' + encodeURIComponent( value ) + '">' + value + '</a>';
			},
			'2': function ( value ){
				return commafy( value );
			},
			'3': function ( value ){
				return commafy( value );
			},
			'4': function ( value ){
				return commafy( value );
			},
			'5': function ( value ){
				return commafy( value );
			},
			'6': function ( value ){
				return commafy( value );
			},
			'7': function ( value ){
				return commafy( value );
			}
		}
	} );
} );