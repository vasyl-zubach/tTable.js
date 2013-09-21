var data_table, ajax_table_id, ajax_per_page_table_id;
$( document ).ready( function (){
	prettyPrint();


	// tabs init
	$( '.pg-tabs-item' ).on( 'click', function (){
		var $this = $( this );
		$( '.pg-tabs-item' ).removeClass( 'pg-tabs-item__on' );
		$this.addClass( 'pg-tabs-item__on' );
		$( '.pg' ).removeClass( 'pg__on' );
		$( '.pg[data-container="' + $this.data( 'tab' ) + '"]' ).addClass( 'pg__on' );
	} );

	// show/hide code button control
	$( '.show_hide_code' ).on( 'click', function (){
		var $this = $( this ),
			$to_show = $( '[data-code="' + $this.data( '2show' ) + '"]' );
		if ( $to_show.css( 'display' ) == 'none' ) {
			$to_show.show();
			$this.html( $this.data( 'hide' ) );
		} else {
			$to_show.hide();
			$this.html( $this.data( 'show' ) );
		}
	} );

	data_table = new tTable( {
		titles          : [
			{ "title": "Project", "type": "string" },
			{ "title": "Link", "type": "string" },
			{ "title": "Type", "type": "string" }
		],
		page_size       : 2,
		page_sizes      : [2, 3, 4, 5, 6, 7],
		start_page      : 1,
		row_numbers     : true,
		sort_by         : 1,
		sorting         : true,
		data            : [
			["DevMate", "<a href='http://devmate.com'>DevMate</a>", "work" ],
			["MacPaw", "<a href='http://macpaw.com'>MacPaw</a>", "work"],
			["Ensoul.Me", "<a href='http://ensoul.me'>Ensoul.me</a>", "work"],
			["TjRus.com", "<a href='http://tjrus.com'>TjRus.com</a>", "personal"],
			["Imageless iPhone", "<a href='http://tjrus.com/iphone'>Imageless iPhone</a>", "personal"],
			["Imageless Lumia", "<a href='http://tjrus.com/lumia'>Imageless Lumia</a>", "personal"],
			["_v_.js", "<a href='http://github.com/TjRus/_v_.js'>_v_.js</a>", "git"],
			["tFormer.js", "<a href='http://github.com/TjRus/tFormer.js'>tFormer.js</a>", "git"],
			["tTable.js", "<a href='http://github.com/TjRus/tTable.js'>tTable.js</a>", "git"],
			["aer.js", "<a href='http://github.com/TjRus/aer.js'>aer.js</a>", "git"],
			["Imageless iPhone", "<a href='http://github.com/TjRus/iPhone.js'>iPhone.js</a>", "git"],
			["Imageless Lumia", "<a href='http://github.com/TjRus/Lumia.js'>Lumia.js</a>", "git"],
			["_v_.js", "<a href='http://tjrus.github.io/_v_.js'>_v_.js</a>", "opensource"],
			["tFormer.js", "<a href='http://tformerjs.com/'>tFormer.js</a>", "opensource"]
		],
		search          : true,
		search_auto     : true,
		search_container: "#table_id_search",
		search_sensitive: true,
		search_value    : "",
		container       : "#table_id",
		pager           : "#table_id_pager",
		hover_cols      : [1, 2],
		formatter       : {
			"3": function ( value ){
				return value == 'work' || value == 'opensource' ? '&lt;b&gt;' + value + '&lt;/b&gt;' : value;
			}
		}
	} );


	ajax_table_id = new tTable( {
		container  : '#ajax_table_id',
		pager      : '#ajax_table_id_pager',
		titles     : [
			{ "title": "Project", "type": "string", "key": "name" },
			{ "title": "Link", "type": "string", "key": "link" },
			{ "title": "Type", "type": "string", "key": "type" }
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
			url         : 'php/ajax.php',
			prepare_data: function ( response ){
				return _.map( response.data, function ( item ){
					return _.toArray( item );
				} );
			}
		},

		"search"          : true,
		"search_auto"     : false,
		"search_container": "#ajax_table_id_search",
		"search_sensitive": false,
		"search_value"    : ""
	} );


	ajax_per_page_table_id = new tTable( {
		container  : '#ajax_per_page_table_id',
		pager      : '#ajax_per_page_table_id_pager',
		titles     : [
			{ "title": "Project", "type": "string", "key": "name" },
			{ "title": "Link", "type": "string", "key": "link" },
			{ "title": "Type", "type": "string", "key": "type" }
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
		"search_container": "#ajax_per_page_table_id_search",
		"search_sensitive": false,
		"search_value"    : ""
	} );

} );