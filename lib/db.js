'use strict';

export default function db() {
  const data = [];
  this.findOne = id => data.hasOwnProperty(id) ? Promise.resolve(data[id]) : Promise.reject();
  this.save = url => {
    data.push(url);
    return Promise.resolve(data.length - 1);
  };
}
