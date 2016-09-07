// https://github.com/seanhuber/folder-tree
(function($) {
  $.widget( 'sh.folderTree', {
    options: {
      api_token: '', // optional token to be set as an authorization header when making ajax requests to contents_url
      root: 'root_folder',
      contents_url: 'folder contents url',
      file_click: function(event, data) {},
      folder_shown: function(event, data) {},
    },

    _addClickHandler: function() {
      var that = this;
      that.element.on('click', '.basename', function(event) {
        var $li = $(this).parent();
        if ($li.hasClass('file')) {
          that.element.find('li.selected').removeClass('selected');
          $li.addClass('selected');
          that._trigger('file_click', event, {path: $li.data('path')});
        } else if ($li.hasClass('folder')) {
          $li.toggleClass('expanded');
          if ($li.hasClass('expanded')) {
            if ($li.children('ul').hasClass('loading')) {
              that._refreshFolder($li.data('path'));
            } else {
              that._trigger('folder_shown', null, {path: $li.data('path')});
            }
          }
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
      var ajax_opts = {
        data: {path: path},
        complete: function( jqXHR, textStatus ) {
          that._updateFolderContents(path, jqXHR.responseJSON);
        }
      }
      if (that.options.api_token != '') {
        ajax_opts.beforeSend = function (xhr) {
          xhr.setRequestHeader('Authorization', 'Token token='+that.options.api_token);
        }
      }
      $.ajax(that.options.contents_url, ajax_opts);
    },

    _updateFolderContents: function(path, f_contents) {
      var that = this;
      var $ul = that.element.find("li[data-path='"+path+"'] > ul");
      var html = '';
      $.each( {folders: false, files: true}, function(k,v) {
        if (f_contents.hasOwnProperty(k)) html += $.map(f_contents[k].sort(), function(name){ return that._branchLi(path+'/'+name, v); }).join('');
      });
      if (html == '') html = "<li class='no-contents'>No contents.</li>";
      $ul.removeClass('loading');
      $ul.html(html);
      that._trigger('folder_shown', null, {path: path});
    }
  });
})(jQuery);
