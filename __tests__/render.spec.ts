import { React } from '../src';

describe('React.render()', () => {
  test('test text node, we dont create tag but only text', () => {
    const data = React.createElement('div', null, 'hello world');
    const base = document.createElement('div');
    document.body.appendChild(base);

    React.render(data, base);

    expect(base.innerHTML).toStrictEqual('<div>hello world</div>');
  });

  test('common usage', () => {
    const data = React.createElement('div', null,
      'hello',
      React.createElement('h1', null, 'yzl'),
    );

    const base = document.createElement('div');
    document.body.appendChild(base);

    React.render(data, base);

    expect(base.innerHTML).toEqual(`<div>hello<h1>yzl</h1></div>`);
  });
});
