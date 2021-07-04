import jsdomGlobal from 'jsdom-global';

class Dom {
  static init() {
    this.instance = new this();
  }

  constructor(head, body) {
    this._head = head ? head : '';
    this._body = body ? body : '';
    this.render();
  }

  render() {
    this._dom = jsdomGlobal(`
      <html>
        <head>${this._head}</head>
        <body>${this._body}</body>
      </html>
    `);
    this.window = window;
    this.document = document;
  }

  setHead(head) {
    this.delete();
    this._head = head;
    this.render();
  }

  setBody(body) {
    this.delete();
    this._body = body;
    this.render();
  }

  delete() {
    if (this._dom) {
      this._dom();
      this._dom = null;
    }
  }
}

Dom.init();

export {
  Dom
};