jQuery Storage API Plugin - v1.0 - 06/20/2012
=============================================

Copyright (c) 2012 "Quickredfox" Francois Lafortune

Licensed under the same conditions as jQuery itself.

**license:** http://jquery.org/license/

**source:**  https://github.com/quickredfox/jquery-storage-api

Description
-----------

Provides a unified API for persistent and non-persisten data storage APIs. 

There are 4 types of storage facilities: 

- $.store.local uses localStorage
- $.store.session uses sessionStorage
- $.store.cookie stores information in cookies
- $.store.memory stores information in a in-memory object

All storage facilities expose the same methods as the W3C Storage API
with the only difference being that the setItem() and getItem() methods work 
directly with JSON instead of strings.

Before Proceeding
-----------------

If you're looking for a jQuery based persistent storage solution, this may not be your best fit.
You may want to look at these:

- [jquery-html5Storage](http://archive.plugins.jquery.com/project/html5Storage) 
- [jStorage](http://www.jstorage.info/)
- [jquery-storage](https://github.com/kilhage/jquery-storage)

This plugin is not designed to work in all browsers and provides no fallback for older browsers, 
this should be handled by you using - for example - the [modernizr](http://modernizr.com/) library.

But why build this then? 

Most of the existing implementations provide you with one interface and take it upon 
themselves to decide which storage facility to use, depending on the available browser APIs. 
This is OK as it's pretty much the "jquery way" but I feel this omits a few use cases where 
one could use different storage facilities for different purposes and more fine-tuned control.

Therefore, I have developed this in order to unify 4 different storage facilities under a common API.

The API
=======

$.store[store].setItem( key, value ) 
------------------------------------

Adds a new item to [store]. 

( where store is one of: local, session, cookie or memory ) 

Params:

- key: A string representing the identifier for this value, for later access.
- value: A JSON value.

Example:

    $.store.local.setItem( 'test-item', { kung: 'fu' } );

$.store[store].getItem( key )
-----------------------------

Gets the item in [store], for a specified key, returns that item or null if not found. 

( where store is one of: local, session, cookie or memory ) 

Params:

- key: The identifier for the value wanted.

Example:

    $.store.local.getItem( 'test-item' ); // { kung: 'fu' }

$.store[store].removeItem( key )
--------------------------------

Removes the item in [store], for a specified key. 

( where store is one of: local, session, cookie or memory ) 

Params:

- key: The identifier for the value to remove.

Example:

    $.store.local.getItem( 'test-item' ); // undefined

$.store[store].hasKey( key )
----------------------------

Detect the existance of a specified key, returns a boolean. 

( where store is one of: local, session, cookie or memory ) 

Params:

- key: The identifier to detect presence of.

Example:

    $.store.local.getItem( 'test-item' ); // true

$.store[store].key( n )
-----------------------

Get the key at specified index. 

( where store is one of: local, session, cookie or memory ) 

Params:

- n: The index of the key to fetch.

Example:

    $.store.local.key( 0 ); // test-item


$.store[store].clear()
----------------------

Destroys all data in [store]. 

( where store is one of: local, session, cookie or memory ) 

Example:

    $.store.local.clear();
    console.log( $.store.local.length ) // 0

Gotchas!
--------

How to loop through items in storage:

    for (var i = 0; i < $.store.local.length; i++){
        // get the name of the key
        var key  = $.store.local.key( i );
        // get the item
        var item = $.store.local.getItem( key );
        // do something with it        
        console.log( item );
    };


