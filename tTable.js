/**
 * tTable.js - work with tables like a boss
 * http://github.com/TjRus/tTable.js
 * (c) 2013 Vasiliy Zubach (aka TjRus) - http://tjrus.com/
 * tTable.js may be freely distributed under the MIT license.
 */

(function ( window, document, undefined ){


	/**
	 * Table defaults
	 * @type {{page: number, show_pages: boolean, page_sizes: Array, page_size: number, row_numbers: boolean, nav_arrows: boolean, goto: boolean, sort_by: number, sorting: boolean, sort_type: string, prefix: {}, suffix: {}, hover_cols: boolean, hidden_cols: Array, search: boolean, search_auto: boolean, search_sensitive: boolean, search_value: string, data: Array, titles: Array}}
	 */
	var tTable_defaults = {
		container: null,
		titles   : [],
		data     : [],

		row_numbers: false,

		pager     : null,
		page      : 1,
		nav_arrows: true,
		show_pages: true,
		page_size : 10,
		page_sizes: [10, 25, 50],
		goto      : true,

		sorting      : true,
		sort_by      : 0,
		sort_type    : 'asc',
		sort_td_click: true,

		prefix   : {},
		suffix   : {},
		formatter: null,

		hover_cols : false,
		hidden_cols: [],

		search_container: null,
		search          : false,
		search_auto     : true,
		search_sensitive: false,
		search_value    : "",

		ajax: null,

		other: false,
		total: false,

		column_bars: false,

		number_separators: ',',

		show_min : false,
		show_max : false,

		// todo:
		//		filter: {
		//			"3": "git"
		//		},
		className: {
			main               : 'tTable',
			head               : 'tTable-head',
			number_bar         : 'tTable-number-bar',
			number_column      : 'tTable-number-column',
			max_value          : 'tTable-max-value',
			min_value          : 'tTable-min-value',
			cell_value         : 'tTable-cell-value',
			sorting            : 'tTable-sorting',
			sorted             : 'tTable-td-sorted',
			sort_column        : 'tTable-sort-column',
			sorting_asc        : 'tTable-sorting-asc',
			sorting_desc       : 'tTable-sorting-desc',
			pager              : 'tTable-pager',
			pager_arrows       : 'tTable-pager-arrows',
			pager_arrows_prev  : 'tTable-pager-arrows-prev',
			pager_arrows_next  : 'tTable-pager-arrows-prev',
			pager_pages        : 'tTable-pager-pages',
			pager_pages_item   : 'tTable-pager-pages-item',
			pager_pages_item_on: 'tTable-pager-pages-item__on',
			pager_goto         : 'tTable-pager-goto',
			pager_page_size    : 'tTable-pager-page_size',
			loading            : 'tTable-loading',
			no_data            : 'tTable-no-data',
			search             : 'tTable-search-input'
		}

	};
	window.tTable_defaults = tTable_defaults;

	/**
	 * Constructor
	 * @param config
	 * @returns {*}
	 */
	var tTable = function ( config ){
		if ( !(this instanceof tTable) ) {
			return new tTable( config );
		}
		var self = this;
		self.config = _.clone( tTable_defaults );

		return self.init( config );
	};


	var t_proto = tTable.prototype;
	t_proto.cache = [];

	/** Method for creating templates that will be used in table
	 *
	 * @returns {tTable}
	 * @private
	 */
	t_proto._buildTpls = function (){
		var self = this,
			cName = self.get( 'className' );

		self.tpl = {
			top   : '<table class="' + cName.main + '">',
			header: "<tr><%= data.colls || '' %></tr>",

			colgroup : '<colgroup class="<%= className %>"></colgroup>',
			row      : "<tr class='<%= className %>'><%= colls %></tr>",
			coll     : '<td class="<%= data.className %>"><%= data.html || "" %></td>',
			coll_bar : '<div class="' + cName.number_bar + '"></div>',
			min_value: '<span class="' + cName.min_value + '">min</span>',
			max_value: '<span class="' + cName.max_value + '">max</span>',
			sorting  : '<div class="' + cName.sorting + '" data-sort_type="<%= sort_type %>" data-sort_by="<%= sort_by %>" <%= is_sort_column ? "data-sort" : "" %>><div class="' + cName.sorting_asc + '"></div><div class="' + cName.sorting_desc + '"></div></div>',
			pager    : {
				wrap_top    : '<div class="' + cName.pager + '">',
				arrows      : '<span class="' + cName.pager_arrows + '"><a href="#" class="' + cName.pager_arrows_prev + ' <%= prev_disabled %>">prev</a><a href="#" class="' + cName.pager_arrows_next + ' <%= next_disabled %>">next</a></span>',
				pages_top   : '<span class="' + cName.pager_pages + '">',
				pages       : '<a href="#<%= page %>" class="' + cName.pager_pages_item + ' <%= current == page ? "' + cName.pager_pages_item_on + '" : ""%>" data-goto="<%= page %>"><%= page %></a>',
				dots        : '<span class="' + cName.pager_pages_item + '">...</span>',
				pages_bottom: '</span>',
				goto        : '<input type="text" name="tTable-goto" class="' + cName.pager_goto + '" />',
				page_size   : '<select class="' + cName.pager_page_size + '"><% _.each(sizes, function(item){ %><option value="<%= item %>" <%= current == item ? "selected" : "" %>><%= item %></option><% }); %></select>',
				wrap_bottom : '</div>'
			},

			loading: '<div class="' + cName.loading + '">Loading data...</div>',
			no_data: '<div class="' + cName.no_data + '">No data...</div>',

			search: '<input type="text" name="tTable_search" class="' + cName.search + '" placeholder="Search" value="<%= value %>">',

			bottom: "</table>"
		};
		return self;
	}

	// TODO: move caching HTML
	t_proto.html = {

	};


	/**
	 * Initialize table
	 * @param {object} config - table config
	 * @returns {*}
	 */
	t_proto.init = function ( config ){
		var self = this,
			ajax;
		self.config = _.extend( self.config, config );
		self.$el = $( self.get( 'container' ) );
		self.$pager = $( self.get( 'pager' ) );

		self.xhr = {};
		self.xhr_key = '';
		self.xhr_data = {};
		self.xhr_data_size = {};

		self.loading = false;

		self.min = {};
		self.max = {};

		self.column_types = {};
		self.getColumnTypes();

		ajax = self.get( 'ajax' );

		self._buildTpls();

		if ( ajax && typeof ajax.url == 'string' && !self.ajax_data_size ) {
			self.getAJAXData();
		}

		if ( self.get( 'search' ) ) {
			self.search = self.get( 'search_value' );
			self.$search = $( self.get( 'search_container' ) );
			self.renderSearch();
			if ( self.search ) {
				self.searchData();
			}
		}


		self.goto( self.get( 'page' ) );

		return self;
	};


	/**
	 * Destroy table - remove events and DOM objects
	 * @returns {*}
	 */
	t_proto.destroy = function (){
		var self = this;
		if ( self.$search ) {
			self.$search
				.off( 'input keypress blur', '.tTable-search-input' );
			self.$search.empty();
		}
		if ( self.$el ) {
			self.$el
				.off( 'click', '.tTable-sorting' )
				.find( '.tTable-sorting' ).parent().off( 'click' );
			self.$el.undelegate( 'td', 'mouseover mouseleave' );
			self.$el.empty();
		}
		if ( self.$pager ) {
			self.$pager
				.off( 'click', '.tTable-pager-arrows-prev' )
				.off( 'click', '.tTable-pager-arrows-next' )
				.off( 'click', '.tTable-pager-pages-item' )
				.off( 'keypress', '.tTable-pager-goto' )
				.off( 'change', '.tTable-pager-page_size' );
			self.$pager.empty();
		}
		return self;
	};


	/**
	 * Get table property value
	 * @param {string} what - table property name
	 * @returns {*}
	 */
	t_proto.get = function ( what ){
		var self = this,
			val;

		val = self.config[what];
		return val;
	};


	/**
	 * Update you table properties
	 * @param {object} what - { property : new_value, ....}
	 * @returns {*}
	 */
	t_proto.set = function ( what ){
		var self = this;
		for ( var key in what ) {
			self.config[key] = what[key];
		}
		return self;
	};


	t_proto.getColumnTypes = function (){
		var self = this,
			titles = self.get( 'titles' );

		for ( var i = 0, t_l = titles.length; i < t_l; i++ ) {
			self.column_types[i + 1] = titles[i].type || 'string';
		}
		return self.column_types;
	};

	/**
	 * Render search field
	 * @returns {*}
	 */
	t_proto.renderSearch = function (){
		var self = this,
			search_value = self.get( 'search_value' );

		self.$search.html( _.template( self.tpl.search, {
			value: search_value
		} ) );

		return self;
	};


	/**
	 * Update table viewport
	 * @returns {*}
	 */
	t_proto.renderTable = function (){
		var self = this,
			html = {},
			html_str,
			other = self.get( 'other' ),
			total = self.get( 'total' );

		html.top = self.html.top || _.template( self.tpl.top, {} );

		// Table header with titles
		html.header = self.__tableHeadHTML();

		// All table rows with some data
		html.body = '';
		if ( total !== false ) {
			html.body += self.__tableTotalRowHTML();
		}
		html.body += self.__tableBodyHTML();
		if ( other !== false ) {
			html.body += self.__tableOtherRowHTML();
		}

		// Table bottom
		html.bottom = self.html.bottom || _.template( self.tpl.bottom, {} );

		// inserting
		if ( self.loading ) {
			html_str = html.top + html.header + html.bottom + self.tpl.loading;
		} else {
			if ( self.dataSize() == 0 ) {
				html_str = html.top + html.header + html.bottom + self.tpl.no_data;
			} else {
				html_str = html.top + html.header + html.body + html.bottom;
			}
		}
		self.$el.html( html_str );
		self.updatePager(); // update pager;
		self.bindEvents();
		return self;
	};


	/**
	 * Gethering table head HTML
	 * @returns {*|string}
	 * @private
	 */
	t_proto.__tableHeadHTML = function (){
		var self = this,
			is_row_numbers = self.get( 'row_numbers' ),
			titles = self.get( 'titles' ),
			num = [
				{"title": "#", "type": "number" }
			],
			sorting = self.get( 'sorting' ),
			sorted_by = self.get( 'sort_by' ),
			sort_type = self.get( 'sort_type' ),
			str = self.html.header || '',
			hover_cols = self.get( 'hover_cols' ),
			hidden_cols = self.get( 'hidden_cols' ),
			cName = self.get( 'className' ),
			colgroups = '';

		if ( !str ) {
			if ( is_row_numbers ) {
				colgroups += _.template( self.tpl.colgroup, {
					className: ''
				} );
				str += _.template( self.tpl.coll, {
					data: {
						html: num[0].title
					}
				} );
			}
		}


		_.each( titles, function ( item, iterator ){
			var sorting_html = '',
				column_num = iterator + 1,
				td_config = {},
				sorting_available = sorting === true || _.contains( sorting, column_num );

			if ( !hidden_cols || hidden_cols.indexOf( column_num ) === -1 ) {
				colgroups += _.template( self.tpl.colgroup, {
					className: ((sorted_by == column_num ) ? cName.sort_column : '')
				} );

				if ( sorting_available ) {
					sorting_html = _.template( self.tpl.sorting, {
						sort_by       : column_num,
						sort_type     : sort_type,
						is_sort_column: sorted_by == column_num
					} );
				}

				td_config = {
					html: (item.title || item) + sorting_html
				};

				if ( sorting_available ) {
					td_config.className = (sorted_by == column_num ? ' ' + cName.sorted : '');
				}

				str += _.template( self.tpl.coll, {
					data: td_config
				} );
			}
		} );


		str = _.template( self.tpl.row, {
			className: self.get( 'className' ).head,
			colls    : str
		} );
		str = colgroups + str;
		return str;
	};

	/**
	 * Gethering table body HTML for defined page
	 * @returns {string}
	 * @private
	 */
	t_proto.__tableBodyHTML = function (){
		var self = this,
			str = '',
			page_size = self.get( 'page_size' ),
			page = self.get( 'page' ),
			sort_by = self.get( 'sort_by' ),
			prefix = self.get( 'prefix' ),
			suffix = self.get( 'suffix' ),
			num = page_size * (page - 1) + 1,
			is_row_numbers = self.get( 'row_numbers' ),
			rows_data = self.getPageData(),
			hidden_cols = self.get( 'hidden_cols' ),
			column_bars = self.get( 'column_bars' ),
			column_types = self.column_types,
			show_max = self.get( 'show_max' ),
			array_show_max = _.isArray( show_max ),
			show_min = self.get( 'show_min' ),
			array_show_min = _.isArray( show_min ),
			tpl_bar = column_bars ? self.tpl.coll_bar : '',
			cName = self.get( 'className' );

		_.each( rows_data, function ( row ){
			var row_html = '';
			if ( is_row_numbers ) {
				row = [num].concat( row );
				num++;
			}
			_.each( row, function ( item, iterator ){

				var origin = item.value || item,
					value = item.formatted || item,
					col_id = iterator + (is_row_numbers ? 0 : 1),
					min_html = '',
					max_html = '',
					number_class = '';

				if ( !hidden_cols || hidden_cols.indexOf( col_id ) === -1 ) {
					number_class = (column_types[col_id] == 'number') ? cName.number_column : ''

					if ( prefix[col_id] ) {
						value = prefix[col_id] + value;
					}
					if ( suffix[col_id] ) {
						value = value + suffix[col_id];
					}

					if ( column_bars && column_types[col_id] === 'number' ) {
						value = tpl_bar + value;
					}

					if ( show_max === true || (array_show_max && show_max.indexOf( col_id ) !== -1 ) ) {
						if ( origin == self.max[col_id] ) {
							max_html = self.tpl.max_value;
						}
					}
					if ( show_min === true || (array_show_min && show_min.indexOf( col_id ) !== -1 ) ) {
						if ( origin == self.min[col_id] ) {
							min_html = self.tpl.min_value;
						}
					}

					value = max_html + min_html + value;

					row_html += _.template( self.tpl.coll, {
						data: {
							html     : value,
							className: number_class
						}
					} );
				}
			} );
			str += _.template( self.tpl.row, {
				className: '',
				colls    : row_html
			} )
		} );

		return str;
	};


	/**
	 * Gethering table other row HTML
	 * @returns {string}
	 * @private
	 */
	t_proto.__tableOtherRowHTML = function (){
		var self = this,
			str = '',
			page_size = self.get( 'page_size' ),
			page = self.get( 'page' ),
			sort_by = self.get( 'sort_by' ),
			prefix = self.get( 'prefix' ),
			suffix = self.get( 'suffix' ),
			cols_num = _.size( self.get( 'titles' ) ),
			is_row_numbers = self.get( 'row_numbers' ),
			hidden_cols = self.get( 'hidden_cols' ),
			tpl_col = self.tpl.coll,
			other = self.get( 'other' ),
			formatter = self.get( 'formatter' ),
			column_types = self.column_types,
			cName = self.get( 'className' ),
			number_class = '';

		if ( is_row_numbers ) {
			str += _.template( tpl_col, {data: { html: ''}} );
		}

		for ( var column = 1; column <= cols_num; column++ ) {
			var value = other[column] || self.getOtherTotal( column, page );

			if ( !hidden_cols || hidden_cols.indexOf( column ) === -1 ) {
				number_class = (column_types[column] == 'number') ? cName.number_column : '';

				if ( typeof other[column] == 'function' ) {
					value = value.call( self );
					if ( prefix[column] ) {
						value = prefix[column] + value;
					}
					if ( suffix[column] ) {
						value = value + suffix[column];
					}
				}

				if ( !other[column] ) {
					value = formatter && formatter[column] ? formatter[column]( value ) : value;
					if ( prefix[column] ) {
						value = prefix[column] + value;
					}
					if ( suffix[column] ) {
						value = value + suffix[column];
					}
				}
				str += _.template( tpl_col, {
					data: {
						html     : value,
						className: number_class
					}
				} );
			}
		}

		str = _.template( self.tpl.row, {
			className: '',
			colls    : str
		} );

		return str;
	};


	/**
	 * Gethering table total row HTML
	 * @returns {string}
	 * @private
	 */
	t_proto.__tableTotalRowHTML = function (){
		var self = this,
			str = '',
			page_size = self.get( 'page_size' ),
			page = self.get( 'page' ),
			sort_by = self.get( 'sort_by' ),
			prefix = self.get( 'prefix' ),
			suffix = self.get( 'suffix' ),
			cols_num = _.size( self.get( 'titles' ) ),
			is_row_numbers = self.get( 'row_numbers' ),
			hidden_cols = self.get( 'hidden_cols' ),
			tpl_col = self.tpl.coll,
			total = self.get( 'total' ),
			formatter = self.get( 'formatter' ),
			column_types = self.column_types,
			cName = self.get( 'className' ),
			number_class = '';

		if ( is_row_numbers ) {
			str += _.template( tpl_col, {data: { html: ''}} );
		}

		for ( var column = 1; column <= cols_num; column++ ) {
			var value = total[column] || self.getTotal( column );

			if ( !hidden_cols || hidden_cols.indexOf( column ) === -1 ) {
				number_class = (column_types[column] == 'number') ? cName.number_column : '';

				if ( typeof total[column] == 'function' ) {
					value = value.call( self );
					if ( prefix[column] ) {
						value = prefix[column] + value;
					}
					if ( suffix[column] ) {
						value = value + suffix[column];
					}
				}

				if ( !total[column] ) {
					value = formatter && formatter[column] ? formatter[column]( value ) : value;
					if ( prefix[column] ) {
						value = prefix[column] + value;
					}
					if ( suffix[column] ) {
						value = value + suffix[column];
					}
				}
				str += _.template( tpl_col, {
					data: {
						html     : value,
						className: number_class
					}
				} );
			}
		}

		str = _.template( self.tpl.row, {
			className: '',
			colls    : str
		} );

		return str;
	};

	/**
	 * Rendering table pager
	 * @returns {*}
	 */
	t_proto.updatePager = function (){
		var self = this,
			tpl = self.tpl.pager,
			page_size = parseInt( self.get( 'page_size' ), 10 ),
			page_sizes = self.get( 'page_sizes' ),
			page_sizes_available = !!page_sizes,
			nav_arrows_available = self.get( 'nav_arrows' ),
			goto_available = self.get( 'goto' ),
			pages_available = self.get( 'show_pages' ),
			page = parseInt( self.get( 'page' ), 10 ),
			pager_str,
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
				tpl_top = tpl.pages_top,
				tpl_bottom = tpl.pages_bottom,
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
			return tpl_top + pages4str + tpl_bottom;
		};

		pager = {
			top      : tpl.wrap_top,
			arrows   : nav_arrows_available && pages_count > 1 ? _.template( tpl.arrows, {
				prev_disabled: page == 1 ? 'tTable-pager-arrows-prev__disabled' : '',
				next_disabled: page == pages_count ? 'tTable-pager-arrows-next__disabled' : ''
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
		return self;
	};


	/**
	 * creating all needed events for table working
	 * @returns {*}
	 */
	t_proto.bindEvents = function (){
		var self = this,
			evnts = {
				nav_arrows: function (){
					self.$pager.off( 'click', '.tTable-pager-arrows-prev' ).on( 'click', '.tTable-pager-arrows-prev', function ( e ){
						e.preventDefault();
						self.goto( self.get( 'page' ) - 1 );
						return false;
					} );
					self.$pager.off( 'click', '.tTable-pager-arrows-next' ).on( 'click', '.tTable-pager-arrows-next', function ( e ){
						e.preventDefault();
						self.goto( self.get( 'page' ) + 1 );
						return false;
					} );
				},

				pagination: function (){
					self.$pager.off( 'click', '.tTable-pager-pages-item' ).on( 'click', '.tTable-pager-pages-item', function ( e ){
						e.preventDefault();
						if ( $( e.target ).hasClass( 'tTable-pager-pages-item__on' ) ) {
							return false;
						}
						self.goto( $( this ).data( 'goto' ) );
						return false;
					} );
				},

				goto: function (){
					self.$pager.off( 'keypress', '.table-pager-goto' ).on( 'keypress', '.table-pager-goto', function ( e ){
						if ( e.keyCode == 13 ) {
							e.preventDefault();
							self.goto( $( this ).val() );
							return false;
						}
					} );
				},

				page_sizes: function (){
					self.$pager.off( 'change', '.tTable-pager-page_size' ).on( 'change', '.tTable-pager-page_size', function ( e ){
						e.preventDefault();
						self.set( {
							page_size: parseInt( $( this ).val(), 10 )
						} ).goto( 1 );
						return false;
					} );
				},

				sorting: function (){
					if ( self.get( 'sort_td_click' ) ) {
						self.$el.find( '.tTable-sorting' ).parent().off( 'click' ).on( 'click', function ( e ){
							var $this = $( this ),
								$sort = $this.find( '.tTable-sorting' ),
								was_sorted_by = self.get( 'sort_by' ),
								sort_by = $sort.data( 'sort_by' ),
								sort_type = $sort.data( 'sort_type' ) ,
								reverse_sort_type = sort_type == 'asc' ? 'desc' : 'asc';
							self.set( {
								sort_by  : sort_by,
								sort_type: was_sorted_by == sort_by ? reverse_sort_type : sort_type
							} ).goto( 1 );
						} )
					} else {
						self.$el.off( 'click', '.tTable-sorting' ).on( 'click', '.tTable-sorting', function ( e ){
							var $this = $( this ),
								was_sorted_by = self.get( 'sort_by' ),
								sort_by = $this.data( 'sort_by' ),
								sort_type = $this.data( 'sort_type' ) ,
								reverse_sort_type = sort_type == 'asc' ? 'desc' : 'asc';
							self.set( {
								sort_by  : sort_by,
								sort_type: was_sorted_by == sort_by ? reverse_sort_type : sort_type
							} ).goto( 1 );
						} );
					}
				},

				search: function (){
					var search_auto = self.get( 'search_auto' ),
						search_event = search_auto ? 'input keypress' : 'keypress',
						search_sensitive = self.get( 'search_sensitive' );

					self.$search.off( search_event, '.tTable-search-input' ).on( search_event, '.tTable-search-input', function ( e ){
						var value = this.value;
						if ( !search_sensitive ) {
							value = value.toLowerCase();
						}
						if ( (search_auto || e.keyCode == 13) && self.search != value ) {
							self.search = value;
							self.set( {
								search_value: value
							} ).goto( 1 );
						}
					} );

					self.$search.off( 'blur', '.tTable-search-input' ).on( 'blur', '.tTable-search-input', function ( e ){
						var value = this.value;
						if ( !search_sensitive ) {
							value = value.toLowerCase();
						}
						if ( self.search != value ) {
							self.search = value;
							self.set( {
								search_value: value
							} ).goto( 1 );
						}
					} );
				},

				hover_cols: function (){
					var $colgroups = self.$el.find( 'colgroup' ),
						row_numbers = self.get( 'row_numbers' ),
						hover_cols = self.get( 'hover_cols' );

					self.$el.undelegate( 'td', 'mouseover mouseleave' ).delegate( 'td', 'mouseover mouseleave', function ( e ){
						var $this = $( this ),
							index = $this.index();
						if ( (!row_numbers || index !== 0) && ((_.isArray( hover_cols ) && hover_cols.indexOf( index + (row_numbers ? 0 : 1) ) !== -1) || hover_cols === true) ) {
							if ( e.type == 'mouseover' ) {
								$colgroups.eq( index ).addClass( 'tTable-col-hover' );
							} else {
								$colgroups.eq( index ).removeClass( 'tTable-col-hover' );
							}
						}
					} );
				}
			};

		if ( self.get( 'nav_arrows' ) ) {
			evnts.nav_arrows();
		}

		if ( self.get( 'show_pages' ) ) {
			evnts.pagination();
		}

		if ( self.get( 'goto' ) ) {
			evnts.goto();
		}

		if ( !!self.get( 'page_sizes' ) ) {
			evnts.page_sizes();
		}

		if ( self.get( 'sorting' ) ) {
			evnts.sorting();
		}

		if ( self.get( 'search' ) ) {
			evnts.search();
		}

		if ( self.get( 'hover_cols' ) ) {
			evnts.hover_cols();
		}

		return self;
	};


	/**
	 * Method that calculates available pages count for filtered and searched data
	 * @returns {number}
	 */
	t_proto.countPages = function (){
		var self = this,
			data_length = self.dataSize(),
			page_size = self.get( 'page_size' ),
			max = data_length / page_size,
			max_rounded = Math.floor( max );

		max = max_rounded < max ? max_rounded + 1 : max;
		self.pages_count = max;
		return max > 0 ? max : 1;
	};


	/**
	 * method that calculates and return table data size
	 * @returns {number}
	 */
	t_proto.dataSize = function (){
		var self = this,
			ajax = self.get( 'ajax' ) || {},
			ajax_per_page = typeof ajax.url === "function",
			filters = _.size( self.get( 'filter' ) ),
			size = 0,
			data;

		if ( ajax_per_page ) {
			self.getData();
			size = self.ajax_data_size;
		} else if ( self.search ) {
			size = _.size( self.search_data );
		} else if ( filters ) {
			size = _.size( self.filtered_data );
		} else {
			size = _.size( self.get( 'data' ) );
		}
		return size > 0 ? size : 0;
	};


	/**
	 * Method for getting table data with ajax
	 * @returns {*}
	 */
	t_proto.getAJAXData = function (){
		var self = this,
			titles = self.get( 'titles' ),
			sort_key = self.getSortKey(),
			sort_type = self.getSortType(),
			page_size = self.get( 'page_size' ),
			page = self.get( 'page' ),
			from = (page - 1) * page_size,
			ajax = self.get( 'ajax' ),
			ajax_per_page = typeof ajax.url === "function",
			search = self.search,
			search_sensitive = self.get( 'search_sensitive' ).toString(),
			xhr_key = from.toString() + page_size.toString() + sort_key.toString() + sort_type.toString() + search,
			new_data,
			ajax_config = _.cloneDeep( ajax );

		from = (from < 0) ? 0 : from;

		if ( ajax_per_page ) {
			ajax_config.url = ajax.url( from, page_size, sort_key, sort_type, search, search_sensitive );
		}

		ajax_config.success = function ( response ){
			var data = ajax.prepare_data( response );
			var data_size = ajax_per_page ? ajax.full_size( response ) : data.length;

			self.set( {data: data} );

			self.ajax_data_size = data_size;
			self.data = data;

			self.xhr_data[xhr_key] = data;
			self.xhr_data_size[xhr_key] = data_size;

			self.loading = false;
			self.countPages( data_size );
			self.goto( page );
		};

		if ( self.xhr_data[xhr_key] ) {
			if ( ajax_per_page ) {
				self.ajax_data_size = self.xhr_data_size[xhr_key];
			}
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


	/**
	 * Method for getting table data (filtered, searched and cutted to page size)
	 * Or if we have ajax per page driven table - it will run detAJAXData()
	 * @returns {*}
	 */
	t_proto.getData = function (){
		var self = this,
			sort_by = self.get( 'sort_by' ),
			data = self.get( 'data' ),
			sort_type = self.get( 'sort_type' ),
			ajax = self.get( 'ajax' ),
			show_min = self.get( 'show_min' ),
			show_max = self.get( 'show_max' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			sorted_data, filtered_data, result_data;

		if ( !ajax || (!ajax_per_page && _.size( self.data ) == self.ajax_data_size ) ) {
			sorted_data = self.sortData( data, sort_by, sort_type );
			filtered_data = self.filterData( sorted_data );
			result_data = self.searchData( filtered_data, self.search );
			if ( show_min ) {
				self.getMin( ( _.isArray( show_min ) ) ? show_min : self.getNumberColIds(), result_data );
			}
			if ( show_max ) {
				self.getMax( ( _.isArray( show_max ) ) ? show_max : self.getNumberColIds(), result_data );
			}
		} else {
			result_data = self.getAJAXData();
		}

		return result_data;
	};


	/**
	 * Method for searching data in table that can be associated with search string
	 * @param {array} data - data in which we are searching for something
	 * @param {string} search - search string
	 * @returns {*}
	 */
	t_proto.searchData = function ( data, search ){
		data = data || this.getData();
		search = search || this.search;
		var self = this,
			new_data,
			cols = self.get( 'search' ),
			cols_all = cols === true || (_.isArray( cols ) && _.size( cols ) === 0),
			search_sensitive = self.get( 'search_sensitive' );

		if ( !search ) {
			return data;
		}

		new_data = _.filter( data, function ( row ){
			var results = 0;
			_.each( row, function ( item, iterator ){
				if ( cols_all || _.indexOf( cols, iterator + 1 ) !== -1 ) {
					if ( search_sensitive ) {
						if ( (_.isObject( item ) && _.contains( item.value, search )) || _.contains( item, search ) ) {
							results += 1;
						}
					} else {
						if ( _.isObject( item ) ) {
							if ( typeof item.value === 'string' && item.value.toLowerCase().indexOf( search ) !== -1 ) {
								results += 1;
							} else if ( typeof item.value === 'number' && item.value.toString().indexOf( search ) !== -1 ) {
								results += 1;
							}
						} else if ( typeof item === 'string' && item.indexOf( search ) !== -1 ) {
							results += 1;
						} else if ( typeof item === 'number' && item.toString().indexOf( search ) !== -1 ) {
							results += 1;
						}
					}
				}
			} );
			return results > 0;
		} );
		self.search_data = new_data;
		return new_data;
	};


	/**
	 * Method for filtering table data according to defined / setted table filters
	 * @param {array} data - table data that should be filtered
	 * @returns {Array}
	 */
	t_proto.filterData = function ( data ){
		var self = this,
			filtered_data = [],
			filter = self.get( 'filter' ),
			match_size = _.size( filter ),
			data_size = _.size( data );

		if ( _.size( filter ) > 0 ) {
			for ( var row = 0; row < data_size; row++ ) {
				var match = 0;
				_.each( filter, function ( value, key ){
					var item = data[row][key - 1];
					if ( _.isObject( item ) ) {
						if ( item.value == value ) {
							match += 1;
						}
					} else if ( item == value ) {
						match += 1;
					}
				} );
				if ( match == match_size ) {
					filtered_data.push( data[row] );
				}
			}
		} else {
			filtered_data = data;
		}
		self.filtered_data = filtered_data;
		return filtered_data;
	};


	/**
	 * Method for formatting data according to defined column formatters
	 * @param {array} data - data that should be formatted
	 * @param {object} formatter - object with formatters defined while creating the table
	 * @returns {*}
	 * @private
	 */
	t_proto.__prepareDataFormat = function ( data, formatter ){
		var self = this,
			total_rows = (data || []).length,
			row_size = (data && data[0]) ? data[0].length : 0,
			column_type = self.column_types;

		for ( var row = 0; row < total_rows; row++ ) {
			for ( var col_id = 0; col_id < row_size; col_id++ ) {
				var col = col_id + 1,
					item = data[row][col_id],
					origin;

				item = item.value || item;

				origin = item;

				if ( column_type[col] == 'number' ) {
					item = self.numberFormat( item );
				}
				if ( formatter && formatter[col] ) {
					item = formatter[col].call( self, item );
				}

				if ( item !== origin ) {
					data[row][col_id] = {
						value    : origin,
						formatted: item
					};
				}
			}
		}
		return data;
	};


	/**
	 * Method for getting sorting key
	 * By default it will be column id in human readable format,
	 * but if developer defines `key` property in titles it will return that `key` value related to proper column id
	 * @returns {*|String|*|Number}
	 */
	t_proto.getSortKey = function (){
		var self = this,
			titles = self.get( 'titles' ),
			sort_by = parseInt( self.get( 'sort_by' ), 10 );
		return sort_by > 0 ? (titles[sort_by - 1].key || sort_by) : sort_by;
	};


	/**
	 * Method for getting sort_type string ('asc' or 'desc')
	 * @returns {*}
	 */
	t_proto.getSortType = function (){
		return this.get( 'sort_type' );
	};


	t_proto.getColumnDataType = function ( column ){
		var self = this,
			titles = self.get( 'titles' ),
			titles_length = titles.length;
		column = column || self.get( 'sort_by' );
		return ((column > 0 && column <= titles_length) ? (titles[column - 1].type || 'string') : 'string').toLowerCase();
	};

	/**
	 * Method for finding sort data type (string or number) that defined in titles
	 * @returns {string}
	 */
	t_proto.getSortDataType = function (){
		var self = this;
		return self.getColumnDataType( self.get( 'sort_by' ) );
	};


	/**
	 * Method for sorting table rows (data) by defined column and sort_type ('asc', 'desc')
	 * @param {array} data - table data. If not defined - get it from the main table object
	 * @param {number} sort_by - number of column
	 * @param {string} sort_type - sort type ('asc', 'desc')
	 * @returns {*}
	 */
	t_proto.sortData = function ( data, sort_by, sort_type ){
		data = data || this.get( 'data' );
		sort_by = sort_by || this.get( 'sort_by' );
		sort_type = sort_type || this.getSortType();

		var self = this,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			data_type = self.getSortDataType(),
			ajax = self.get( 'ajax' ) || {},
			ajax_per_page = ajax && typeof ajax.url === "function",
			data_size = ajax_per_page ? '' : self.dataSize(),
			cache_key = sort_by.toString() + sort_type.toString() + data_size.toString(),
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

	/**
	 * Method that calculate total sum of table data in some predefined column
	 * @param column
	 * @returns {number}
	 */
	t_proto.getTotal = function ( column ){
		var self = this,
			total = 0,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			data_type = ((column > 0 && column <= titles_length) ? titles[column - 1].type : '').toLowerCase(),
			data = self.getData(),
			col = column - 1;

		if ( data_type == 'number' ) {
			_.each( data, function ( item ){
				if ( _.isObject( item[col] ) ) {
					total += parseFloat( item[col].value );
				} else {
					total += parseFloat( item[col] );
				}
			} );
		}

		return total
	};


	/**
	 * Method that calculate total sum of table data in some predefined column
	 * @param column
	 * @param page
	 * @returns {number}
	 */
	t_proto.getPageTotal = function ( column, page ){
		var self = this,
			total = 0,
			titles = self.get( 'titles' ),
			titles_length = titles.length,
			data_type = ((column > 0 && column <= titles_length) ? titles[column - 1].type : '').toLowerCase(),
			data = self.getPageData( page ),
			col = column - 1;

		if ( data_type == 'number' ) {
			_.each( data, function ( item ){
				total += parseFloat( item[col].value || item[col] );
			} );
		}

		return total
	};

	t_proto.getOtherTotal = function ( column, page ){
		var self = this;
		return self.getTotal( column ) - self.getPageTotal( column, page );
	};

	/**
	 * Method for getting data array with table data related to current page
	 * @returns {*}
	 */
	t_proto.getPageData = function ( page ){
		page = page || this.get( 'page' );
		var self = this,
			page_size = self.get( 'page_size' ),
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
					data4work = data.slice( (page - 1) * page_size, page * page_size )
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

	t_proto.getMin = function ( column, data ){
		var self = this,
			is_array = _.isArray( column ),
			min = [],
			get_min = function ( col_data ){
				return _.min( col_data, function ( item ){
					return (item.value || item);
				} );
			};

		data = data || self.getData();

		if ( is_array ) {
			for ( var i = 0, c_l = column.length; i < c_l; i++ ) {
				min[i] = get_min( self.getColumnData( column[i], data ) );
				min[i] = min[i].value || min[i];
				self.min[column[i]] = min[i];
			}
		} else {
			min = get_min( self.getColumnData( column, data ) );
			min = (min.value || min)
			self.min[column] = min;
		}
		return min;
	};

	t_proto.getMax = function ( column, data ){
		var self = this,
			is_array = _.isArray( column ),
			max = [],
			get_max = function ( col_data ){
				return _.max( col_data, function ( item ){
					return (item.value || item);
				} );
			};

		data = data || self.getData();

		if ( is_array ) {
			for ( var i = 0, c_l = column.length; i < c_l; i++ ) {
				max[i] = get_max( self.getColumnData( column[i], data ) );
				max[i] = max[i].value || max[i];
				self.max[column[i]] = max[i];
			}
		} else {
			max = get_max( self.getColumnData( column, data ) );
			max = (max.value || max);
			self.max[column] = max;
		}
		return max;
	};

	t_proto.getColumnData = function ( column, data ){
		data = data || this.getData()
		var col_id = column - 1,
			column_array = (function ( data ){
				var arr = [];
				for ( var i = 0, d_l = data.length; i < d_l; i++ ) {
					arr[i] = data[i][col_id];
				}
				return arr;
			}( data ));
		return column_array;
	};

	t_proto.getNumberColIds = function (){
		var self = this,
			num_cols = [],
			titles = self.get( 'titles' );
		for ( var i = 0, t_l = titles.length; i < t_l; i++ ) {
			var col_type = self.getColumnDataType( i + 1 );
			if ( col_type == 'number' ) {
				num_cols.push( i + 1 );
			}
		}
		return num_cols;
	};


	t_proto.numberFormat = function ( num, number_separators ){
		var self = this,
			formatted = '';

		number_separators = (number_separators || self.get( 'number_separators' )).split( '' );

		var str = num.toString().split( '.' );
		if ( str[0].length >= 4 ) {
			str[0] = str[0].replace( /(\d)(?=(\d{3})+$)/g, '$1' + number_separators[0] );
		}
		if ( str[1] && str[1].length >= 4 ) {
			str[1] = str[1].replace( /(\d{3})/g, '$1' + number_separators[1] );
		}
		return str.join( '.' );

		return formatted;
	};

	/**
	 * Method for adding row to the table
	 * @param {array} row - array with row data.
	 * It will be concatenated with table data array and table will be automatically updated
	 * @returns {*}
	 */
	t_proto.addRow = function ( row ){
		var self = this,
			ajax = self.get( 'ajax' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			data;

		if ( ajax_per_page ) {
			console.error( 'Error while adding row to ajax per page driven table' );
			return self;
		}

		data = self.get( 'data' );
		data.push( row );

		self.goto( self.get( 'page' ) );
		return self;
	};

	/**
	 * Method for updating row(s) data
	 * @param {object} update - object with new update data for row(s)
	 * Update structure {col_id: 'value'}, col_id here responds to table column id in human readable format (starts with 1)
	 * update = {
	 *     col_id : 'col_value',
	 *     other_col_id : 'col_value',
	 *     ...
	 * }
	 * @param {object} where - object with data that scripts need to find row that will be updated
	 * Where structure {col_id: 'value'}, col_id here responds to table column id in human readable format (starts with 1)
	 * update = {
	 *     col_id : 'col_value',
	 *     other_col_id : 'col_value',
	 *     ...
	 * }
	 *
	 * At first scripts goes to data and searches for all rows that are relative to `where` config
	 * Than it changes all relative to `update` data
	 * @returns {*}
	 */
	t_proto.updateRow = function ( update, where ){
		var self = this,
			ajax = self.get( 'ajax' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			data,
			match_size = _.size( where ),
			data_size;

		if ( ajax_per_page ) {
			console.error( 'Error while deleting rows from ajax per page driven table' );
			return self;
		}

		data = self.get( 'data' );
		data_size = self.dataSize();

		for ( var row = 0; row < data_size; row++ ) {
			var match = 0;

			for ( var key in where ) {
				var col_id = parseInt( key, 10 ) - 1,
					item = data[row][col_id];

				if ( _.isObject( item ) ) {
					if ( item.value == where[key] ) {
						match += 1;
					}
				} else if ( item == where[key] ) {
					match += 1;
				}
			}

			if ( match === match_size ) {
				_.each( update, function ( value, key ){
					data[row][key - 1] = value;
				} );
			}
		}
		self.goto( self.get( 'page' ) );
		return self;
	};

	/**
	 * Method for deleting row(s) form table data
	 * @param {object} where - object with data that scripts need to find row(s) that will be updated
	 * Where structure {col_id: 'value'}, col_id here responds to table column id in human readable format (starts with 1)
	 * update = {
	 *     col_id : 'col_value',
	 *     other_col_id : 'col_value',
	 *     ...
	 * }
	 * @returns {*}
	 */
	t_proto.delRow = function ( where ){
		var self = this,
			ajax = self.get( 'ajax' ),
			ajax_per_page = ajax && typeof ajax.url === "function",
			data,
			cleaned_data = [],
			match_size = _.size( where );

		if ( ajax_per_page ) {
			console.error( 'Error while deleting rows from ajax per page driven table' );
			return self;
		}

		data = self.get( 'data' );

		_.each( data, function ( row ){
			var match = 0
			_.each( where, function ( value, key ){
				if ( _.isObject( row[key - 1] ) ) {
					if ( row[key - 1].value == value ) {
						match += 1;
					}
				} else if ( row[key - 1] == value ) {
					match += 1;
				}
			} );
			if ( match < match_size ) {
				cleaned_data.push( row );
			}
		} );
		data = cleaned_data;

		self.set( {data: cleaned_data} );
		self.data = cleaned_data;

		self.goto( self.get( 'page' ) );
		return self;
	};


	/**
	 * Method for updating viewport with table data related to defined page number
	 * @param {number} page - page that should be rendered
	 * @returns {*}
	 */
	t_proto.goto = function ( page ){
		if ( typeof page !== 'number' ) {
			return this;
		}
		page = parseInt( page, 10 );

		var self = this,
			page_size = self.get( 'page_size' ),
			max_pages = self.countPages(),
			set_updates = {},
			key = 'page';

		if ( page <= max_pages && page > 0 ) {
			set_updates[key] = page;
		} else if ( page <= 0 ) {
			set_updates[key] = 1;
		} else {
			set_updates[key] = max_pages;
		}
		self.set( set_updates ).renderTable();
		return self;
	};

	window.tTable = tTable;

	// AMD
	// TODO: check is this ok
	if ( typeof window.define === "function" && window.define.amd ) {
		window.define( "tTable", [], function (){
			return tTable;
		} );
	}

})( window, document );
