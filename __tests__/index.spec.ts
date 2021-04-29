import { React } from '../src';

describe('React.createElement()', () => {
  test('common usage', () => {
    const data = React.createElement('div', {
      name: 'yzl',
      age: 20,
    });

    expect(data).toStrictEqual({
      props: {
        name: 'yzl',
        age: 20,
        children: [],
      },
      type: 'div',
    });
  });

  test('test nested usage', () => {
    const data = React.createElement('div', null,
      React.createElement('h1', {
        children: [],
      }, 'first'),
      React.createElement('h1', {
        children: [],
      }, 'second'),
    );

    expect(data).toStrictEqual({
      'props': {
        'children': [
          {
            'props': {
              'children': [
                {
                  'props': {
                    'children': [],
                    'nodeValue': 'first',
                  },
                  'type': 'TEXT',
                },
              ],
            },
            'type': 'h1',
          },
          {
            'props': {
              'children': [
                {
                  'props': {
                    'children': [],
                    'nodeValue': 'second',
                  },
                  'type': 'TEXT',
                },
              ],
            },
            'type': 'h1',
          },
        ],
      },
      'type': 'div',
    });
  });
});

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
