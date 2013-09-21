var table_pg, form_pg;
$( document ).ready( function (){
	var tpl = $( '.pg-code-container-tpl' ).html();
	var update_code = function ( options ){
		$( '.pg-code-container' ).html( _.template( tpl, {data: options} ) );
		prettyPrint();
	}
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

	table_pg = new tTable( {
		titles          : [
			{ "title": "Project", "type": "string" },
			{ "title": "Link", "type": "string" },
			{ "title": "Type", "type": "string" }
		],
		page_size       : 3,
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
		search_sensitive: false,
		search_value    : "",
		container       : "#table_id",
		pager           : "#table_id_pager",
		hover_cols      : [1, 2],
		formatter       : {
			"3": function ( value ){
				return value == 'work' || value == 'opensource' ? '<b>' + value + '</b>' : value;
			}
		}
	} );

	update_code( table_pg.config );

	form_pg = tFormer( 'form_pg', {

	} ).submit( function (){
			var options = form_pg.toObject();
			options.goto = options.goto == 'true';
			options.nav_arrows = options.nav_arrows == 'true';
			options.row_numbers = options.row_numbers == 'true';
			options.search = options.search == 'true';
			options.search_auto = options.search_auto == 'true';
			options.search_sensitive = options.search_sensitive == 'true';
			options.show_pages = options.show_pages == 'true';
			options.sorting = options.sorting == 'true';
			options.sort_by = parseInt( options.sort_by, 10 ) || 0;
			options.page = parseInt( options.page, 10 ) || 0;
			options.hidden_cols = (function ( hc ){
				hc = hc.split( ',' );
				hc = _.map( hc, function ( num ){
					return parseInt( num, 10 );
				} );
				return _.filter( hc, function ( num ){
					return typeof num === 'number';
				} );
			})( options.hidden_cols );
			options.hover_cols = (function ( hc ){
				if ( hc == 'false' ) {
					return false;
				}
				if ( hc == 'true' ) {
					return true;
				}
				hc = hc.split( ',' );
				hc = _.map( hc, function ( num ){
					return parseInt( num, 10 );
				} );
				return _.filter( hc, function ( num ){
					return typeof num === 'number';
				} );
			})( options.hover_cols );
			options.page_size = parseInt( options.page_size ) || 10;
			options.page_sizes = (function ( ps ){
				ps = ps.split( ',' );
				ps = _.map( ps, function ( num ){
					return parseInt( num, 10 );
				} );
				return _.filter( ps, function ( num ){
					return typeof num === 'number';
				} );
			})( options.page_sizes );
			options.prefix = (function ( p1, p2, p3 ){
				var p = {};
				if ( p1 ) {
					p['1'] = p1;
				}
				if ( p2 ) {
					p['2'] = p2;
				}
				if ( p3 ) {
					p['3'] = p3;
				}
				return p;
			})( options.prefix_1, options.prefix_2, options.prefix_3 );
			delete options.prefix_1;
			delete options.prefix_2;
			delete options.prefix_3;

			options.suffix = (function ( s1, s2, s3 ){
				var s = {};
				if ( s1 ) {
					s['1'] = s1;
				}
				if ( s2 ) {
					s['2'] = s2;
				}
				if ( s3 ) {
					s['3'] = s3;
				}
				return s;
			})( options.suffix_1, options.suffix_2, options.suffix_3 );
			delete options.suffix_1;
			delete options.suffix_2;
			delete options.suffix_3;
			table_pg.set( options ).destroy().init();
			update_code( options );
			form_pg.processing( false );
		} );

} );