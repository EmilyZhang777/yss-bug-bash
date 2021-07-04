const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const fetch = require('node-fetch');
const { Dom } = require('./Dom');
const slugify = require('slugify');
const regeneratorRuntime = require("regenerator-runtime");
const testPort = 5957;

class UnitTest {
  constructor(build) {
    Object.assign(this, {
      _assertions: build._assert,
      _data: build._data,
      _description: build._description,
      _name: build._name,
      _template: build._template,
    })
  }

  description() {
    return this._description;
  }

  fileName() {
    return path.resolve(__dirname, `../testdata/generated/${slugify(this._name)}.json`);
  }

  prepare() {
    fs.writeFileSync(this.fileName(), JSON.stringify(this._data));
  }

  url() {
    return `http://localhost:${testPort}/${this._template}?partial=1&JSONDATA=${this.fileName()}`;
  }

  async render() {
    this.prepare();
    console.log(this.url());
    const response = await fetch(this.url());
    const body = await response.text()
    return body;
  }

  tearDown() {
    fs.unlink(this.fileName());
  }

  async run() {
    let testInstance = this;
    return it(this._description, async function() {
      this.test.renderedURL = testInstance.url();
      let body = await testInstance.render();
      const dom = new Dom('', body);
      testInstance._assertions(dom.document, testInstance._data);
    });
  }

  static get Builder() {
    class Builder {
      constructor(name) {
        this._name = name;
      }
      withDescription(description)
      {
        this._description = description;
        return this;
      }
      withTemplate(tmpl) {
        this._template = tmpl;
        return this;
      }
      withAssertions(func) {
        this._assert = func;
        return this;
      }
      withTestData(data) {
        this._data = data;
        return this;
      }
      build() {
        return new UnitTest(this);
      }
    }

    return Builder;
  }
}

module.exports = {
  UnitTest
};
