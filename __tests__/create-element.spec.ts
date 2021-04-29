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
