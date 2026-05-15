import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VALID_LOGIN = 'YaHogake1488';
const VALID_PASSWORD = 'YaHogake1488';

export default function AuthPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (login === VALID_LOGIN && password === VALID_PASSWORD) {
      sessionStorage.setItem('authed', '1');
      navigate('/');
    } else {
      setError('невірний логін або пароль');
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <h1 className='auth-title'>card counter</h1>
        <p className='auth-sub'>увійти</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            type='text'
            placeholder='логін'
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            className='auth-input'
            autoComplete='username'
          />
          <input
            type='password'
            placeholder='пароль'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='auth-input'
            autoComplete='current-password'
          />
          {error && <p className='auth-error'>{error}</p>}
          <button type='submit' className='auth-btn'>
            увійти
          </button>
        </form>
      </div>
    </div>
  );
}
