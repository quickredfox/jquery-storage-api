/*
* jQuery Storage API Plugin - v1.0 - 06/20/2012
* 
* Copyright (c) 2012 "Quickredfox" Francois Lafortune
* Licensed under the same conditions as jQuery itself.
* license: http://jquery.org/license/
* source: https://github.com/quickredfox/jquery-storage-api
* 
*/

(function($) {

  "use strict";
  
  // cookieStorage singleton, mimics Storage API
  var cookieStorage = new function() {
    var cookiename   = 'cookiestore'
      , keys = []
      , max_cookie_size = 2000;
      
    // cookieStorage private createCookie()
    var createCookie = function(name, value, days) {
      var date, expires = "";
      if (days) {
        date = new Date();
        date.setTime( date.getTime() + (days * 24 * 60 * 60 * 1000) );
        expires = "; expires=" + ( date.toGMTString() );
      };
      return document.cookie = "" + name + "=" + value + expires + "; path=/";
    };
    
    // cookieStorage private readCookie()
    var readCookie = function(name) {
      var c, ca, i, nameEQ, length;
      nameEQ = "" + name + "=";
      ca = document.cookie.split(';');
      for (i = 0, length = ca.length; i < length; i++) {
        c = ca[i];
        while (c.charAt(0) === ' ')
          c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    };
    
    // cookieStorage private eraseCookie()
    var eraseCookie = function(name) {
      return createCookie(cookiename, '', -1);
    };
    
    // cookieStorage private getJSONCookie()
    var getJSONCookie = function() {
      var cookie;
      cookie = readCookie(cookiename);
      if (typeof cookie === 'string') return JSON.parse(cookie);
      else if (cookie) return cookie;
      else return {};
    };
    
    // cookieStorage private setJSONCookie()
    var setJSONCookie = function(cookie) {
      cookie = typeof cookie === 'string' ? cookie : JSON.stringify(cookie || {});
      if (cookie.length && cookie.length >= max_cookie_size)
        throw new Error("Max Cookie Size Exceeded");
      else
        return createCookie(cookiename, cookie, 365);
    };
    
    // cookieStorage Public API
    this.length = 0;
    
    this.key = function(n) {
      return keys[n];
    };
    
    this.setItem = function(key, value) {
      var cookie;
      cookie = getJSONCookie();
      keys.push(key);
      cookie[key] = value;
      setJSONCookie(cookie);
      this.length = keys.length;
      return null;
    };
    
    this.getItem = function(key) {
      var cookie;
      cookie = getJSONCookie();
      return cookie[key];
    };
    
    this.removeItem = function(key) {
      var cookie, index;
      index = keys.indexOf(key);
      cookie = getJSONCookie();
      if (index !== -1) {
        keys.splice(index, 1);
        delete cookie[key];
        this.length = keys.length;
      };
      setJSONCookie(cookie);
      return null;
    };
    
    this.clear = function() {
      this.length = 0;
      eraseCookie(cookiename);
      keys = [];
      return null;
    };
    return this;
  };
  
  // memoryStorage singleton, mimics Storage API
  var memoryStorage = new function() {
    var keys, memory;
    memory = {};
    keys = [];
    this.length = keys.length;
    this.key = function(n) {
      return keys[n];
    };
    this.setItem = function(key, value) {
      keys.push(key);
      this.length = keys.length;
      memory[key] = value;
      return null;
    };
    this.getItem = function(key) {
      return memory[key] || null;
    };
    this.removeItem = function(key) {
      var index;
      index = keys.indexOf(key);
      if (index !== -1) {
        keys.splice(index, 1);
        delete memory[key];
        this.length = keys.length;
      }
      return null;
    };
    this.clear = function() {
      this.length = 0;
      memory = {};
      keys = [];
      return null;
    };
    return this;
  };
  
  // Map of all stores
  var stores = {
    local: localStorage,
    session: sessionStorage,
    cookie: cookieStorage,
    memory: memoryStorage
  };
  
  // Cannot set new prototype methods on localStorage or sessionStorage, must ad them to
  // Storage prototype. see: https://developer.mozilla.org/en/DOM/Storage#Storage
  Storage.prototype.hasKey = Storage.prototype.hasKey||function() {};
  
  // Since all stores have now been implemented to mimic the Storage API,
  // here we loop through all stores to override setItem and getItem to accept JSON.
  Object.keys(stores).map(function(type) {
    var store = stores[type]
      , _get  = store.getItem
      , _set  = store.setItem;
    store.setItem = function(key, value) {
      value = typeof value !== 'string' ? JSON.stringify(value) : value;
      return _set.call(store, key, value);
    };
    store.getItem = function(key) {
      var stored; 
      stored = _get.call(store, key);
      if (stored && typeof stored === 'string') {
        return JSON.parse(stored);
      }
    };
    return store.hasKey = function(key) {
      var existing, i;
      i = store.length;
      while (existing = store.key(i)) {
        if (key === existing) {
          return true;
        }
      }
      return false;
    };
  });
  // Attach to $ namespace
  $.extend($, {
    store: stores
  });
}).call(this, jQuery);