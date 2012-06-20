/*
  Running a series of tests in parallel for each different store since all stored are expected
  to be composed of the exact same API.
*/module('$.store');
asyncTest('Should be bound to $ as "store"', 2, function() {
  ok($.store, 'is bound to $ as "store"');
  raises(function() {
    return new Needium.poll();
  }, "Cannot create instance of singleton");
  return start();
});
['local', 'session', 'memory', 'cookie'].forEach(function(type) {
  var Store;
  module("$.store." + type);
  asyncTest('Should be bound to $ as "$.store.' + type + '"', 1, function() {
    ok($.store[type], 'Is properly bound to namespace');
    return start();
  });
  Store = $.store[type];
  asyncTest('Provides the common interface expected', 7, function() {
    ok(typeof Store.key === 'function', 'key() method is supported');
    ok(typeof Store.setItem === 'function', 'setItem() method is supported');
    ok(typeof Store.getItem === 'function', 'getItem() method is supported');
    ok(typeof Store.hasKey === 'function', 'hasKey() method is supported');
    ok(typeof Store.removeItem === 'function', 'removeItem() method is supported');
    ok(typeof Store.clear === 'function', 'clear() method is supported');
    ok(typeof Store.length === 'number', 'length getter is supported');
    return start();
  });
  asyncTest('setItem() must accept JSON data anbd getItem() must return it as JSON', 2, function() {
    var item, key, value;
    key = 'testitem-0';
    value = {
      isJSON: true
    };
    Store.setItem(key, value);
    item = Store.getItem(key);
    deepEqual(item, value, 'Should be { isJSON: true }');
    ok(item && item.isJSON, 'is json');
    return start();
  });
  asyncTest('setItem() can change JSON data and getItem() must return changed data', 2, function() {
    var item, key, value;
    key = 'testitem-1';
    value = {
      isJSON: false
    };
    Store.setItem(key, value);
    Store.setItem(key, {
      isJSON: true,
      foo: true
    });
    item = Store.getItem(key);
    deepEqual(item, {
      isJSON: true,
      foo: true
    }, 'Should be { isJSON: true, foo: true }');
    ok(item && item.isJSON && item.foo, 'is changed');
    return start();
  });
  asyncTest('clear() must remove all items', 1, function() {
    Store.clear();
    equal(Store.length, 0, 'After clear() length is 0');
    return start();
  });
  return asyncTest('length must return the length', 3, function() {
    Store.setItem('item1', {
      id: 1
    });
    equal(Store.length, 1, 'After adding a first item length is 1');
    Store.setItem('item2', {
      id: 2
    });
    equal(Store.length, 2, 'After adding a second item length is 2');
    Store.setItem('item3', {
      id: 3
    });
    equal(Store.length, 3, 'After adding a third item length is 3');
    return start();
  });
});
module("$.store.cookie");
asyncTest('Cookie store must throw when size limit exceeded (so do others, but harder to test)', 1, function() {
  var over4kjson;
  over4kjson = {
    string: ''
  };
  while (over4kjson.string.length < 4000) {
    over4kjson.string += Math.random();
  }
  raises(function() {
    return $.store.cookie.setItem('bigitem', over4kjson);
  }, 'Throws a "Max Cookie Size Exceeded" error');
  return start();
});