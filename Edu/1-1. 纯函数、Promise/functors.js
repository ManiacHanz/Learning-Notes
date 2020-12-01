class Container {
  static of(value) {
    return new Container(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return Container.of(fn(this._value));
  }
}

class Maybe {
  static of(value) {
    return new Maybe(value);
  }
  isNothing() {
    return this._value === null || this._value === undefined;
  }
  constructor(x) {
    this._value = x;
  }
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value));
  }
}

module.exports = { Maybe, Container };
