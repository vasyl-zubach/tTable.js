/**
 * tTable.js - work with tables like a boss
 * http://github.com/TjRus/tTable.js
 * (c) 2013 Vasiliy Zubach (aka TjRus) - http://tjrus.com/
 * tTable.js may be freely distributed under the MIT license.
 */

(function ( window, document, undefined ){

	var defaults = {
		page_size  : 10,
		row_numbers: false,
		start_page : 1,
		page_sizes : [2, 5, 10],
		sort_type  : 'asc',
		sorting    : true
	};

	var tTable = function ( config ){
		if ( !(this instanceof tTable) ) {
			return new tTable( config );
		}
		var self = this;
		self.config = _.clone( defaults );

		return self.init( config );
	};
	var t_proto = tTable.prototype;
	t_proto.cache = [];

	t_proto.tpl = {
		top   : "<table>",
		header: "<tr><%= data.colls || '' %></tr>",

		row    : "<tr class='<%= className %>'><%= colls %></tr>",
		coll   : "<td><%= data.html || '' %></td>",
		sorting: '<div class="table-sorting" data-sort_type="<%= sort_type %>" data-sort_by="<%= sort_by %>" <%= is_sort_column ? "data-sort" : "" %>><div class="table-sorting-asc"></div><div class="table-sorting-desc"></div></div>',
		pager  : {
			wrap_top    : '<div class="table-pager">',
			arrows      : '<span class="table-pager-arrows"><a href="#" class="table-pager-arrows-prev <%= prev_disabled %>">prev</a><a href="#" class="table-pager-arrows-next <%= next_disabled %>">next</a></span>',
			pages_top   : '<span class="table-pager-pages">',
			pages       : '<a href="#<%= page %>" class="table-pager-pages-item <%= current == page ? "table-pager-pages-item__on" : ""%>" data-goto="<%= page %>"><%= page %></a>',
			dots        : '<span class="table-pager-pages-item">...</span>',
			pages_bottom: '</span>',
			goto        : '<input type="text" name="table-goto" class="table-pager-goto" />',
			page_size   : '<select class="table-pager-page_size"><% _.each(sizes, function(item){ %><option value="<%= item %>" <%= current == item ? "selected" : "" %>><%= item %></option><% }); %></select>',
			wrap_bottom : '</div>'
		},

		bottom: "</table>"
	};
	t_proto.html = {

	};


	t_proto.init = function ( config ){
		var self = this;
		self.config = _.extend( self.config, config );

		//		console.log( 'Config: ', self.config );

		self.$el = $( self.get( 'container' ) );
		self.$pager = $( self.get( 'pager' ) );

		self.goto( self.get( 'start_page' ) );
		return self;
	};

	t_proto.get = function ( what ){
		var self = this,
			val;

		val = self.config[what] || null;
		return val;
	};
	t_proto.set = function ( what ){
		var self = this;
		for ( var key in what ) {
			self.config[key] = what[key];
		}
		return self;
	};

	t_proto.update = function (){
		var self = this,
			html = {},
			titles = self.get( 'titles' ),
			data = self.get( 'data' ),
			num = [
				{"title": "#", "type": "number" }
			],
			is_row_numbers = self.get( 'row_numbers' ),
			sorting_enabled = self.get( 'sorting' ),
			sorted_by = self.get( 'sort_by' ),
			sort_type = self.get( 'sort_type' ),
			html_str = '';

		html.top = self.html.top || _.template( self.tpl.top, {} );

		// Table header with titles
		html.header = (function (){
			var str = self.html.header || '';
			if ( !str ) {
				if ( is_row_numbers ) {
					str += _.template( self.tpl.coll, {
						data: {
							html: num[0].title
						}
					} );
				}
			}

			_.each( titles, function ( item, iterator ){
				var sorting = '';
				if ( sorting_enabled ) {
					sorting = _.template( self.tpl.sorting, {
						sort_by       : iterator + 1,
						sort_type     : sort_type,
						is_sort_column: sorted_by == iterator + 1
					} );
				}
				str += _.template( self.tpl.coll, {
					data: {
						html: item.title + sorting
					}
				} );
			} );

			str = _.template( self.tpl.row, {
				className: 'table-head',
				colls    : str
			} )

			return str;
		})();

		// All table rows with some data
		html.body = (function (){
			var str = '',
				page_size = self.get( 'page_size' ),
				start_page = self.get( 'start_page' ),
				sort_by = self.get( 'sort_by' ),
				num = page_size * (start_page - 1) + 1,
				rows_data = self.getPageData();

			_.each( rows_data, function ( row ){
				var row_html = '';
				if ( is_row_numbers ) {
					row = [num].concat( row );
					num++;
				}
				_.each( row, function ( item ){
					row_html += _.template( self.tpl.coll, {
						data: {
							html: item
						}
					} );
				} );
				str += _.template( self.tpl.row, {
					className: '',
					colls    : row_html
				} )
			} );

			return str;
		})();

		// Table bottom
		html.bottom = self.html.bottom || _.template( self.tpl.bottom, {} );

		// full table str
		html_str = html.top + html.header + html.body + html.bottom;

		// inserting
		self.$el.html( html_str );
		self.updatePager(); // update pager;
		return self;
	};

	t_proto.updatePager = function (){
		var self = this,
			tpl = self.tpl.pager,
			page_size = parseInt( self.get( 'page_size' ), 10 ),
			page_sizes = self.get( 'page_sizes' ),
			page = parseInt( self.get( 'start_page' ), 10 ),
			pager_str = '',
			max = (function ( page_size, data_length ){
				var max = data_length / page_size,
					max_rounded = Math.floor( max );
				if ( max_rounded < max ) {
					max = max_rounded + 1;
				}
				return max;
			})( page_size, self.get( 'data' ).length ),
			get_pages = function (){
				var diff = 2,
					pages = [page - diff, page + diff],
					pages4str = '',
					dots = tpl.dots,
					tmp = 0,
					tpl_page = function ( item ){
						return _.template( tpl.pages, {
							page   : item,
							current: page
						} );
					};

				if ( pages[1] > max ) {
					tmp = pages[1] - max;
					pages[1] = max;
					pages[0] = pages[0] - tmp;
				}
				if ( pages[0] < 1 ) {
					tmp = 0 - pages[0];
					pages[0] = 1;
					pages[1] = pages[1] + tmp + 1;
				}
				if ( pages[1] > max ) {
					pages[1] = max;
				}
				pages4str = (function (){
					var str = '';
					for ( var i = pages[0]; i <= pages[1]; i++ ) {
						str += tpl_page( i );
					}
					return str;
				})();

				if ( pages[0] == 2 ) {
					pages4str = tpl_page( 1 ) + pages4str;
				}
				if ( pages[0] == 3 ) {
					pages4str = tpl_page( 1 ) + tpl_page( 2 ) + pages4str;
				}
				if ( pages[0] > 3 ) {
					pages4str = tpl_page( 1 ) + dots + pages4str;
				}
				if ( pages[1] + 2 == max ) {
					pages4str = pages4str + tpl_page( max - 1 ) + tpl_page( max );
				}
				if ( pages[1] + 1 == max ) {
					pages4str = pages4str + tpl_page( max );
				}
				if ( pages[1] + 3 <= max ) {
					pages4str = pages4str + dots + tpl_page( max );
				}
				return pages4str;
			},

			pager = {
				top      : tpl.wrap_top,
				arrows   : _.template( tpl.arrows, {
					prev_disabled: page == 1 ? 'table-pager-arrows-prev__disabled' : '',
					next_disabled: page == max ? 'table-pager-arrows-next__disabled' : ''
				} ),
				pages    : get_pages(),
				goto     : _.template( tpl.goto, {} ),
				page_size: _.template( tpl.page_size, {
					sizes  : page_sizes,
					current: page_size
				} ),
				bottom   : tpl.wrap_bottom
			};


		pager_str = pager.top + pager.arrows + pager.pages + pager.page_size + pager.goto + pager.bottom;

		self.$pager.html( pager_str );
		self.pagerEvents();
		return self;
	};

	t_proto.pagerEvents = function (){
		var self = this;

		self.$pager.off( 'click', '.table-pager-arrows-prev' ).on( 'click', '.table-pager-arrows-prev', function ( e ){
			e.preventDefault();
			self.goto( self.get( 'start_page' ) - 1 );
			return false;
		} );

		self.$pager.off( 'click', '.table-pager-arrows-next' ).on( 'click', '.table-pager-arrows-next', function ( e ){
			e.preventDefault();
			self.goto( self.get( 'start_page' ) + 1 );
			return false;
		} );

		self.$pager.off( 'click', '.table-pager-pages-item' ).on( 'click', '.table-pager-pages-item', function ( e ){
			e.preventDefault();
			if ( $( e.target ).hasClass( 'table-pager-pages-item__on' ) ) {
				return false;
			}
			self.goto( $( this ).data( 'goto' ) );
			return false;
		} );

		self.$pager.off( 'keypress', '.table-pager-goto' ).on( 'keypress', '.table-pager-goto', function ( e ){
			if ( e.keyCode == 13 ) {
				e.preventDefault();
				self.goto( $( this ).val() );
				return false;
			}
		} );

		self.$pager.off( 'change', '.table-pager-page_size' ).on( 'change', '.table-pager-page_size', function ( e ){
			e.preventDefault();
			self.set( {page_size: parseInt( $( this ).val(), 10 ) } ).goto( 1 );
			return false;
		} );

		self.$el.off( 'click', '.table-sorting' ).on( 'click', '.table-sorting', function ( e ){
			e.preventDefault();
			var $this = $( this ),
				was_sorted_by = self.get( 'sort_by' ),
				sort_by = $this.data( 'sort_by' ),
				sort_type = $this.data( 'sort_type' ) ,
				reverse_sort_type = sort_type == 'asc' ? 'desc' : 'asc';

			self.set( {
				start_page: 1,
				sort_by   : sort_by,
				sort_type : was_sorted_by == sort_by ? reverse_sort_type : sort_type
			} ).update();
			return false;
		} );

		return self;
	};

	t_proto.getData = function (){
		var self = this,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			sort_by = self.get( 'sort_by' ),
			data = self.get( 'data' ),
			sort_type = self.get( 'sort_type' ),
			data_type = ((sort_by > 0 && sort_by <= titles_length) ? titles[sort_by - 1].type : '').toLowerCase(),
			cache_key = self.get( 'start_page' ).toString() + sort_by.toString() + sort_type.toString(),
			sorted_data = [];

		if ( self.data_cache_key == cache_key ) {
			return self.data;
		}

		if ( sort_by > 0 && sort_by <= titles_length ) {
			if ( data_type == 'string' ) {
				sorted_data = data.sort( function ( prev, next ){
					var p = prev[sort_by - 1].toString();
					var n = next[sort_by - 1].toString();

					if ( sort_type == 'asc' ) {
						return p.localeCompare( n );
					} else if ( sort_type == 'desc' ) {
						return n.localeCompare( p );
					}
				} );
			} else if ( data_type == 'number' ) {
				sorted_data = data.sort( function ( prev, next ){
					var p = prev[sort_by - 1];
					var n = next[sort_by - 1];
					if ( sort_type == 'asc' ) {
						return p - n;
					} else if ( sort_type == 'desc' ) {
						return n - p;
					}
				} );
			}
		} else {
			sorted_data = data;
		}

		// todo: filter data here;

		if ( self.data_cache_key != cache_key ) {
			self.data_cache_key = cache_key
			self.data = sorted_data;
		}

		return self.data;
	};

	t_proto.sortData = function ( data, type ){
		var self = this,
			sorted_data = [];

		return sorted_data;
	};

	t_proto.getTotal = function ( column ){
		var self = this,
			total = 0,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			data_type = ((column > 0 && column <= titles_length) ? titles[column - 1].type : '').toLowerCase(),
			data = self.getData();

		if ( data_type == 'number' ) {
			_.each( data, function ( item ){
				total += parseInt( item[column - 1] );
			} );
		}

		return total
	};

	t_proto.getPageData = function (){
		var self = this,
			page_size = self.get( 'page_size' ),
			start_page = self.get( 'start_page' ),
			data = self.getData(),
			page_data = (function (){
				var data4work;
				if ( typeof page_size == 'number' ) {
					data4work = data.slice( (start_page - 1) * page_size, start_page * page_size )
				} else {
					data4work = data;
				}
				return data4work;
			})();
		return page_data;
	};


	/**
	 *
	 * @param {number} page - page that should be rendered
	 * @returns {*}
	 */
	t_proto.goto = function ( page ){

		//	console.group( 'goto( ' + page + ' )' );
		if ( !page || page < 1 ) {
			return this;
		}
		var self = this,
			page_size = self.get( 'page_size' ),
			data = self.getData(),
			data_length = data.length,
			max = (function ( page_size, data_length ){
				var max = data_length / page_size,
					max_rounded = Math.floor( max );
				if ( max_rounded < max ) {
					max = max_rounded + 1;
				}
				return max;
			})( page_size, self.get( 'data' ).length );


		//	console.log( 'page_size: ', page_size );
		//	console.log( 'data_length: ', data_length );
		//	console.log( 'max: ', max );

		if ( page <= max ) {
			self.set( {start_page: page} ).update();
		}
		//		console.groupEnd();
		return self;
	};

	window.tTable = tTable;

})( window, document );