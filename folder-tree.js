(function($) {
  $.widget( 'sh.folderTree' , {
    options: {
      root: 'root_folder',
      contents_url: 'folder contents url',
      file_click: function(event, data) {}
    },

    _addClickHandler: function() {
      var that = this;
      that.element.on('click', '.basename', function(event) {
        var $li = $(this).parent();
        if ($li.hasClass('file')) {
          that._trigger('file_click', event, {path: $li.data('path')});
        } else if ($li.hasClass('folder')) {
          $li.toggleClass('expanded');
          if ($li.hasClass('expanded') && $li.children('ul').hasClass('loading'))
            that._refreshFolder($li.data('path'));
        }
      });
    },

    _branchLi: function(path, isFile) {
      var arr = path.split('/');
      if (isFile) return "<li class='file' data-path='"+path+"'><span class='basename'>"+arr[arr.length-1]+'</span></li>';
      return "<li class='folder' data-path='"+path+"'><span class='basename'>"+arr[arr.length-1]+"</span><ul class='loading'><li>Loading...</li></ul></li>";
    },

    _create: function() {
      var $root_li = $(this._branchLi(this.options.root, false));
      $root_li.addClass('expanded');
      $("<ul class='folder-list'>"+$root_li.clone().wrap('<div>').parent().html()+'</ul>').appendTo(this.element);
      this._refreshFolder(this.options.root);
      this._addClickHandler();
    },

    _refreshFolder: function(path) {
      var that = this;
      $.get(that.options.contents_url, $.param({path: path}), function(data) {
        that._updateFolderContents(path, data);
      });
    },

    _updateFolderContents: function(path, f_contents) {
      var that = this;
      var $ul = that.element.find("li[data-path='"+path+"'] > ul");
      var html = '';
      $.each( {folders: false, files: true}, function(k,v) {
        if (f_contents.hasOwnProperty(k)) html += $.map(f_contents[k].sort(), function(name){ return that._branchLi(path+'/'+name, v); }).join('');
      });
      if (html == '') html = '<li>No contents.</li>';
      $ul.removeClass('loading');
      $ul.html(html);
    }
  });
})(jQuery);
