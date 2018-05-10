'use strict';

export default class db {
  constructor() {
    this.data = [];
  }
  findOne(id) {
    if (this.data.hasOwnProperty(id)) return Promise.resolve(this.data[id]);
    else return Promise.reject();
  }
  save(url) {
    this.data.push(url);
    return Promise.resolve(this.data.length - 1);
  }
}
