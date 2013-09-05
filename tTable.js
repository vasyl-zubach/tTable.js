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
		start_page : 1
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

		row : "<tr class='<%= className %>'><%= colls %></tr>",
		coll: "<td><%= data.html || '' %></td>",

		pager: 'pager',

		bottom: "</table>"
	};
	t_proto.html = {

	};


	t_proto.init = function ( config ){
		var self = this;
		self.config = _.extend( self.config, config );

		console.log( 'Config: ', self.config );

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
			html_str = '';

		html.top = self.html.top || _.template( self.tpl.top, {} );

		// Table header with titles
		html.header = (function (){
			var str = self.html.header || '';
			if ( !str ) {
				if ( is_row_numbers ) {
					titles = num.concat( titles );
				}
			}
			_.each( titles, function ( item ){
				str += _.template( self.tpl.coll, {
					data: {
						html: item.title
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
				num = page_size * (start_page -1) + 1,
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
		$( self.config.container ).html( html_str );
		return self;
	};

	t_proto.getData = function (){
		var self = this,
			data = self.get( 'data' ),
			page_data = (function (){
				var data4work;
				if ( typeof page_size == 'number' ) {
					data4work = data.slice( (start_page - 1) * page_size, start_page * page_size )
				} else {
					data4work = data;
				}
				return data4work;
			})();
		return data;
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

	t_proto.goto = function ( page ){
		var self = this,
			page_size = self.get( 'page_size' ),
			data = self.getData(),
			data_length = data.length;

		if ( data_length >= (page - 1) * page_size ) {
			self.set( {start_page: page} ).update();
		}
		return self;
	};

	window.tTable = tTable;

})( window, document );