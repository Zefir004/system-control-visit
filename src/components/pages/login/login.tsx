// src/components/pages/login/login.tsx

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, generateToken } from '../../../services/authService';
import { setAuth } from '../../../utils/auth';
import styles from './login.module.scss';

export const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authenticateUser(login, password);

      if (!user) {
        setError('Неверный логин или пароль');
        return;
      }

      setAuth(user, generateToken());
      navigate(user.role === 'student' ? '/student' : '/teacher');
    } catch(e) {
      setError('Не удалось подключиться к серверу. Запустите npm run api');
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <form className={styles['login-form']} onSubmit={handleSubmit}>
          <div className={styles.logo}></div>
          
          <h1 className={styles.title}>Контроль посещаемости</h1>
          
          <p className={styles.subtitle}>
            Войдите в систему для отметки или просмотра табелей
          </p>

          <div className={styles['input-group']}>
            <label className={styles['input-label']} htmlFor="login">
              Логин
            </label>
            <input
              type="text"
              id="login"
              className={styles['input-field']}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              disabled={loading}
              required
            />
          </div>

          <div className={styles['input-group']}>
            <label className={styles['input-label']} htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={styles['input-field']}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
              required
            />
          </div>

          {error && <div className={styles['error-message']}>{error}</div>}

          <button
            type="submit"
            className={styles['login-button']}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>

          <div className={styles['test-hint']}>
            <p>Тестовые данные:</p>
            <p>👨‍🏫 Преподаватель: teacher / teacher123</p>
            <p>👨‍🎓 Студент: student1 / student123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;