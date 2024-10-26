// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

export function App() {
  
  async function handleSubmit(e: Event){
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
  }
  
  return (
    <div>
      <form method='post' onSubmit={}>
        <input type="text" name='userName'/>
        <input type="text" name='password1'/>
        <input type="text" name="password2"/>
      </form>
    </div>
  );
}

export default App;
