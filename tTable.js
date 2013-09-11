/**
 * tTable.js - work with tables like a boss
 * http://github.com/TjRus/tTable.js
 * (c) 2013 Vasiliy Zubach (aka TjRus) - http://tjrus.com/
 * tTable.js may be freely distributed under the MIT license.
 */

(function ( window, document, undefined ){

	var defaults = {
		start_page : 1,
		show_pages : true,
		page_sizes : [10, 25, 50],
		page_size  : 10,
		row_numbers: false,
		nav_arrows : true,
		goto       : true,
		sort_by    : 0,
		sorting    : true,
		sort_type  : 'asc',
		prefix     : {},
		suffix     : {},
		data       : [],
		titles     : []
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

		loading: '<div class="table-loading">Loading data...</div>',
		no_data: '<div class="table-loading">No data...</div>',

		bottom: "</table>"
	};
	t_proto.html = {

	};


	t_proto.init = function ( config ){
		var self = this;
		self.config = _.extend( self.config, config );
		self.$el = $( self.get( 'container' ) );
		self.$pager = $( self.get( 'pager' ) );

		self.xhr = {};
		self.xhr_key = '';
		self.xhr_data = {};

		self.loading = false;

		self.goto( self.get( 'start_page' ) );
		return self;
	};

	t_proto.get = function ( what ){
		var self = this,
			val;

		val = self.config[what];
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
			ajax = self.get( 'ajax' ),
			html_str;

		html.top = self.html.top || _.template( self.tpl.top, {} );

		// Table header with titles
		html.header = self.__tableHeadHTML();

		// All table rows with some data
		html.body = self.__tableBodyHTML();

		// Table bottom
		html.bottom = self.html.bottom || _.template( self.tpl.bottom, {} );

		// inserting
		if ( self.loading ) {
			html_str = html.top + html.header + html.bottom + self.tpl.loading;
			self.$el.html( html_str );
		} else {
			if ( !_.size( self.data ) ) {
				html_str = html.top + html.header + html.bottom + self.tpl.no_data;
			} else {
				html_str = html.top + html.header + html.body + html.bottom;
			}
			self.$el.html( html_str );
		}
		self.updatePager(); // update pager;
		return self;
	};

	t_proto.__tableHeadHTML = function (){
		var self = this,
			is_row_numbers = self.get( 'row_numbers' ),
			titles = self.get( 'titles' ),
			num = [
				{"title": "#", "type": "number" }
			],
			sorting_enabled = self.get( 'sorting' ),
			sorted_by = self.get( 'sort_by' ),
			sort_type = self.get( 'sort_type' ),
			str = self.html.header || '';

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
		} );
		return str;
	};

	t_proto.__tableBodyHTML = function (){
		var self = this,
			str = '',
			page_size = self.get( 'page_size' ),
			start_page = self.get( 'start_page' ),
			sort_by = self.get( 'sort_by' ),
			prefix = self.get( 'prefix' ),
			suffix = self.get( 'suffix' ),
			num = page_size * (start_page - 1) + 1,
			is_row_numbers = self.get( 'row_numbers' ),
			rows_data = self.getPageData();

		_.each( rows_data, function ( row ){
			var row_html = '';
			if ( is_row_numbers ) {
				row = [num].concat( row );
				num++;
			}
			_.each( row, function ( item, iterator ){
				var value = !_.isObject( item ) ? item : item.formatted,
					row_id = iterator + (is_row_numbers ? 0 : 1);

				if ( prefix[row_id] ) {
					value = prefix[row_id] + value;
				}
				if ( suffix[row_id] ) {
					value = value + suffix[row_id];
				}
				row_html += _.template( self.tpl.coll, {
					data: {
						html: value
					}
				} );
			} );
			str += _.template( self.tpl.row, {
				className: '',
				colls    : row_html
			} )
		} );

		return str;
	};

	t_proto.updatePager = function (){
		var self = this,
			tpl = self.tpl.pager,
			page_size = parseInt( self.get( 'page_size' ), 10 ),
			page_sizes = self.get( 'page_sizes' ),
			page_sizes_available = !!page_sizes,
			nav_arrows_available = self.get( 'nav_arrows' ),
			goto_available = self.get( 'goto' ),
			pages_available = self.get( 'show_pages' ),
			page = parseInt( self.get( 'start_page' ), 10 ),
			pager_str = '',
			pages_count, get_pages, pager;

		if ( !page_size ) {
			self.$pager.empty();
			return self;
		}

		pages_count = self.countPages();

		get_pages = function (){
			var diff = 2,
				pages = [page - diff, page + diff],
				pages4str,
				dots = tpl.dots,
				tmp = 0,
				tpl_page = function ( item ){
					return _.template( tpl.pages, {
						page   : item,
						current: page
					} );
				};

			if ( pages[1] > pages_count ) {
				tmp = pages[1] - pages_count;
				pages[1] = pages_count;
				pages[0] = pages[0] - tmp;
			}
			if ( pages[0] < 1 ) {
				tmp = 0 - pages[0];
				pages[0] = 1;
				pages[1] = pages[1] + tmp + 1;
			}
			if ( pages[1] > pages_count ) {
				pages[1] = pages_count;
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
			if ( pages[1] + 2 == pages_count ) {
				pages4str = pages4str + tpl_page( pages_count - 1 ) + tpl_page( pages_count );
			}
			if ( pages[1] + 1 == pages_count ) {
				pages4str = pages4str + tpl_page( pages_count );
			}
			if ( pages[1] + 3 <= pages_count ) {
				pages4str = pages4str + dots + tpl_page( pages_count );
			}
			return pages4str;
		};

		pager = {
			top      : tpl.wrap_top,
			arrows   : nav_arrows_available && pages_count > 1 ? _.template( tpl.arrows, {
				prev_disabled: page == 1 ? 'table-pager-arrows-prev__disabled' : '',
				next_disabled: page == pages_count ? 'table-pager-arrows-next__disabled' : ''
			} ) : '',
			pages    : pages_available && pages_count > 1 ? get_pages() : '',
			goto     : goto_available && pages_count > 1 ? _.template( tpl.goto, {} ) : '',
			page_size: page_sizes_available ? _.template( tpl.page_size, {
				sizes  : page_sizes,
				current: page_size
			} ) : '',
			bottom   : tpl.wrap_bottom
		};


		pager_str = pager.top + pager.arrows + pager.pages + pager.page_size + pager.goto + pager.bottom;

		self.$pager.html( pager_str );
		self.pagerEvents();
		return self;
	};

	t_proto.countPages = function ( full_size ){
		var self = this,
			data,
			data_length = self.data_size,
			page_size = self.get( 'page_size' ),
			ajax = self.get( 'ajax' ),
			max,
			max_rounded;

		data = self.getData();
		if ( !data_length ) {
			data_length = _.size( data );
		}
		max = data_length / page_size;
		max_rounded = Math.floor( max );
		max = max_rounded < max ? max_rounded + 1 : max;
		self.pages_count = max;
		self.data_size = data_length
		return max > 0 ? max : 1;
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


	t_proto.getAJAXData = function (){

		var self = this,
			ajax = self.get( 'ajax' ),
			sort_by = self.get( 'sort_by' ),
			sort_type = self.get( 'sort_type' ),
			page_size = self.get( 'page_size' ),
			page = self.get( 'start_page' ),
			from = (page - 1) * page_size,
			ajax = self.get( 'ajax' ),
			ajax_per_page = typeof ajax.url === "function",
			xhr_key = from.toString() + page_size.toString() + sort_by.toString() + sort_type.toString(),
			new_data = [],
			ajax_config = _.cloneDeep( ajax );

		from = (from < 0) ? 0 : from;

		if ( ajax_per_page ) {
			ajax_config.url = ajax.url( from, page_size, sort_by, sort_type );
		}

		ajax_config.success = function ( response ){
			var data = ajax.prepare_data( response );
			var data_size = ajax_per_page ? ajax.full_size( response ) : data.length;

			self.set( {data: data} );

			self.data_size = data_size;
			self.data = data;

			self.xhr_data[xhr_key] = data;

			self.loading = false;
			self.countPages( data_size );
			self.goto( page );
		};

		if ( self.xhr_data[xhr_key] ) {
			return !ajax_per_page ? self.data : self.xhr_data[xhr_key];
		}

		if ( self.xhr_key !== xhr_key ) {
			if ( self.xhr.abort ) {
				self.xhr.abort();
			}
			self.loading = true;
			self.xhr = $.ajax( ajax_config );
			self.xhr_key = xhr_key;
		}

		return new_data;
	};

	t_proto.getData = function (){
		var self = this,
			sort_by = self.get( 'sort_by' ),
			data = self.get( 'data' ),
			sort_type = self.get( 'sort_type' ),
			ajax = self.get( 'ajax' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			sorted_data, filtered_data;

		if ( !ajax || (!ajax_per_page && _.size( self.data ) == self.data_size) ) {
			filtered_data = self.filterData( data );
			sorted_data = self.sortData( filtered_data, sort_by, sort_type );
		} else {
			sorted_data = self.getAJAXData();
		}

		return sorted_data;
	};

	t_proto.filterData = function ( data ){
		var self = this,
			filtered_data = [];
		filtered_data = data;
		return filtered_data;
	};

	t_proto.__prepareDataFormat = function ( data, formatter ){
		var self = this,
			data_length = data.length;

		if ( formatter ) {
			for ( var key in formatter ) {
				var col = parseInt( key, 10 ) - 1;
				for ( var i = 0; i < data_length; i++ ) {
					var item = data[i][col];
					if ( !_.isObject( item ) ) {
						data[i][col] = {
							value    : item,
							formatted: formatter[key].apply( item )
						};
					}
				}
			}
		}
		return data;
	};

	t_proto.sortData = function ( data, sort_by, sort_type ){
		data = data || this.get( 'data' );
		sort_by = sort_by || this.get( 'sort_by' );
		sort_type = sort_type || this.get( 'sort_type' )

		var self = this,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			data_type = ((sort_by > 0 && sort_by <= titles_length) ? titles[sort_by - 1].type : '').toLowerCase(),
			cache_key = sort_by.toString() + sort_type.toString(),
			sorted_data = [];

		if ( self.data_cache_key == cache_key ) {
			return self.data;
		}

		if ( sort_by > 0 && sort_by <= titles_length ) {
			if ( data_type == 'string' ) {
				sorted_data = data.sort( function ( prev, next ){
					var p = prev[sort_by - 1],
						n = next[sort_by - 1];
					p = !_.isObject( p ) ? p.toString() : p.value.toString();
					n = !_.isObject( n ) ? n.toString() : n.value.toString();

					if ( sort_type == 'asc' ) {
						return p.localeCompare( n );
					} else if ( sort_type == 'desc' ) {
						return n.localeCompare( p );
					}
				} );
			} else if ( data_type == 'number' ) {
				sorted_data = data.sort( function ( prev, next ){
					var p = prev[sort_by - 1],
						n = next[sort_by - 1];
					p = !_.isObject( p ) ? p : p.value;
					n = !_.isObject( n ) ? n : n.value;

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
		if ( self.data_cache_key != cache_key ) {
			self.data_cache_key = cache_key
			self.data = sorted_data;
		}
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
			formatter = self.get( 'formatter' ),
			ajax = self.get( 'ajax' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			data,
			page_data;

		if ( ajax ) {
			data = self.xhr.readyState == 4 ? self.getData() : [];
		} else {
			data = self.getData();
		}

		if ( !ajax_per_page ) {
			page_data = (function ( data ){
				var data4work;
				if ( typeof page_size == 'number' && data ) {
					data4work = data.slice( (start_page - 1) * page_size, start_page * page_size )
				} else {
					data4work = data;
				}
				return data4work;
			})( data );
		} else {
			page_data = data;
		}

		page_data = self.__prepareDataFormat( page_data, formatter );

		return page_data;
	};


	/**
	 * @param {number} page - page that should be rendered
	 * @returns {*}
	 */
	t_proto.goto = function ( page ){
		if ( !page ) {
			return this;
		}
		page = parseInt( page, 10 );

		var self = this,
			page_size = self.get( 'page_size' ),
			max = self.countPages();

		if ( page <= max && page > 0 ) {
			self.set( {start_page: page} ).update();
		} else if ( page <= 0 ) {
			self.set( {start_page: 1} ).update();
		} else {
			self.set( {start_page: max} ).update();
		}
		return self;
	};

	window.tTable = tTable;

})( window, document );