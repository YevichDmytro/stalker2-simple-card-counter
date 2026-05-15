import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Wrong email or password',
  'auth/user-not-found': 'User not found',
  'auth/wrong-password': 'Wrong password',
  'auth/too-many-requests': 'Too many requests, try again later',
  'auth/invalid-email': 'Invalid email format',
};

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(FIREBASE_ERRORS[code] ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <h1 className='auth-title'>card counter</h1>
        <p className='auth-sub'>Sign in</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            type='email'
            placeholder='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className='auth-input'
            autoComplete='email'
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='auth-input'
            autoComplete='current-password'
          />
          {error && <p className='auth-error'>{error}</p>}
          <button type='submit' disabled={loading} className='auth-btn'>
            {loading ? '...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
