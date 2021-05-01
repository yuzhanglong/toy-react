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
  return (
    <div>
      <h2>Hello Toy React!</h2>
      <h3>
        Count: {count}
      </h3>

      {show ? <Name name={'yzl'} age={'20'} /> : <Name name={'???'} age={'???'} />}

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
