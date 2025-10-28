import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authAPI } from '../services/api';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome � obrigat�rio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email � obrigat�rio');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas n�o coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      await authAPI.register(userData);
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              entrar na sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome completo
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Digite sua senha (m�n. 6 caracteres)"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-danger-50 p-4 dark:bg-danger-900/20">
              <div className="text-sm text-danger-700 dark:text-danger-400">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-success-50 p-4 dark:bg-success-900/20">
              <div className="text-sm text-success-700 dark:text-success-400">
                {success}
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>

          <div className="text-center text-xs text-gray-600 dark:text-gray-400">
            Ao criar uma conta, voc� concorda com nossos{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 underline"
              onClick={() => {/* TODO: Implementar modal de Termos de Uso */}}
            >
              Termos de Uso
            </button>{' '}
            e{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 underline"
              onClick={() => {/* TODO: Implementar modal de Pol�tica de Privacidade */}}
            >
              Pol�tica de Privacidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;