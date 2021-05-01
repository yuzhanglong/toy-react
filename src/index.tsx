import { createReactExecutor } from './executor';

const React = createReactExecutor();


const Name = (props) => {
  return (
    <h3>
      name: {props.name}, age:{props.age}
    </h3>
  );
};

const App = () => {
  const [count, setCount] = React.useState(1);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    console.log('count 发生了改变~');
  }, [count]);

  return (
    <div>
      <h2>Hello Toy React!</h2>
      <h3>
        Count: {count}
      </h3>

      {show ? <Name name={'yzl'} age={'20'} /> : <Name name={'???'} age={'???'} />}

      <h3>TIP: 尝试改变 count, 然后打开控制台查看 useEffect 的效果</h3>

      <button onClick={() => setCount(c => c + 1)}>
        +1
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        -1
      </button>
      <button onclick={() => setShow(show => !show)}>
        {show ? 'hide name' : 'show name'}
      </button>
    </div>
  );
};

const el = document.getElementById('app');
React.render(<App />, el);
