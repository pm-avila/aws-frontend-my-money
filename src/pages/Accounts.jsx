import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { accountAPI } from '../services/api';

export const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    balance: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAll();
      
      // Handle different response formats
      let accountsData = response.data;
      if (Array.isArray(accountsData)) {
        setAccounts(accountsData);
      } else if (accountsData && Array.isArray(accountsData.accounts)) {
        setAccounts(accountsData.accounts);
      } else if (accountsData && typeof accountsData === 'object') {
        // If it's a single account object, wrap in array
        setAccounts([accountsData]);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      setError('Erro ao carregar contas');
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const accountData = {
        ...formData,
        balance: parseFloat(formData.balance)
      };

      if (editingAccount) {
        // For now, disable edit since we don't have PUT endpoint
        setError('Edição de contas não está disponível no momento');
        return;
      } else {
        await accountAPI.create(accountData);
      }
      
      await loadAccounts();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar conta');
      console.error('Error saving account:', err);
    }
  };

  // Temporarily disabled - backend endpoints not available yet
  // const handleEdit = (account) => {
  //   setEditingAccount(account);
  //   setFormData({
  //     name: account.name,
  //     balance: account.balance.toString()
  //   });
  //   setShowModal(true);
  // };

  // const handleDelete = async (id) => {
  //   setError('Exclusão de contas não está disponível no momento');
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({
      name: '',
      balance: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contas
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie suas contas bancárias e carteiras
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Conta
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-danger-50 p-4 dark:bg-danger-900/20">
          <div className="text-sm text-danger-700 dark:text-danger-400">
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-primary-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {account.name}
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma conta</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comece criando sua primeira conta.
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nova Conta
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Nova Conta"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Conta Corrente, Poupança"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Saldo Inicial
            </label>
            <Input
              name="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0,00"
              required
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;