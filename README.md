folder-tree
==============

A live demo can be found at:

http://seanhuber.com/demos/folder-tree/demo.html

![Screenshot](https://cdn.rawgit.com/seanhuber/folder-tree/master/screenshot.png)

`folder-tree` is a no-thrills jQuery widget that renders an interactive tree of directories and their contents.

When a user expands a folder (that hasn't previously been opened), the widget will make an ajax call to your API to retrieve the contents of that directory.

When a user clicks on a file, an event/callback is triggered so that your web-app can respond appropriately.

Requirements
-----------------

jQuery version 1.9.0 or newer.

jQuery-ui - It's only been tested with version `~> 1.11`, but it should work with earlier versions as well.

(Optional) - Bootstrap (vesion `>= 3.1.0`). The folder/file icons in the demo are using the Glyphicons that come with bootstrap. But this dependency can easily be avoided with a little CSS.

Installation
-----------------

With Bower:

```
bower install folder-tree
```

Or grab the scripts and styles and manually insert them in `<head>`:

```html
<script src='folder-tree.js' type='text/javascript' charset='utf-8'></script>
<link rel='stylesheet' href='folder-tree' type='text/css' media='screen' />
```

Or if you are using Ruby on Rails, this widget has been packaged into a ruby gem (thanks to the folks at https://rails-assets.org).  Add to your `Gemfile`:

```ruby
gem 'rails-assets-folder-tree', source: 'https://rails-assets.org'
```

Run `bundle install` and then update your asset pipeline.

Add to `app/assets/javascripts/application.js`:

```javascript
//= require folder-tree
```

Add to `app/assets/stylesheets/application.css`:

```css
/*
 *= require folder-tree
 */
```

Basic Usage
-----------------

```html
<div id='demo_tree'></div>

<script>
  $('#demo_tree').folderTree({ // instantiates the widget

    // the name of the root folder
    root: 'root_folder',

    /*
     * API endpoint for retrieving the contents of a directory.
     *
     * Endpoint must accept a 'path' argument, e.g.,
     *   http://seanhuber.com/demo/folder-tree?path=root_folder/subfolder/another_folder
     *
     * API response must be a valid json with a 'folders' attribute and/or
     * a 'files' attribute with values that are arrays of strings.  Example:
     *
     * {folders: ['First Folder', 'second_folder'], files: ['my_file.txt', 'Hello World.pdf']}
     */
    contents_url: 'http://seanhuber.com/demo/folder-tree',

    // Optional - if your api endpoint, contents_url, is secured via Authorization header check, add the token here
    api_token: 'my_secret_token',

    /*
     * Callback function (also a jQuery widget event) for when a file is clicked.
     *
     * The function takes 2 arguments, first of which is the original click event.
     * The second argument is a javascript object with one property: path
     * 'path' will be a string representing the path clicked, e.g.,
     *
     *   root_folder/second_folder/some_file.rb
     */
    file_click: function(event, data) {
      alert('You clicked the file with path: '+data.path);
    },

    /*
     * Callback function (also a jQuery widget event) for when a folder is clicked.
     *
     * The function takes 2 arguments, first of which is the original click event.
     * The second argument is a javascript object with one property: path
     * 'path' will be a string representing the path clicked, e.g.,
     *
     *   root_folder/second_folder/subfolder
     */
    folder_click: function(event, data) {
      alert('You clicked the folder with path: '+data.path);
    },

    /*
     * Callback function (also a jQuery widget event) for when is expanded.
     *
     * The second argument of this function is a javascript object with one property: path
     * 'path' will be a string representing the path clicked, e.g.,
     *
     *   root_folder/second_folder/
     */
    folder_shown: function(event, data) {
      alert('Folder expanded with path path: '+data.path);
    },
  });
</script>
```

License
-----------------

MIT-LICENSE.
