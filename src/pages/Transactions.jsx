import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { transactionAPI, categoryAPI, accountAPI } from '../services/api';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    accountId: '',
    categoryId: ''
  });

  // Define loadTransactions with useCallback before useEffect
  const loadTransactions = useCallback(async () => {
    try {
      const response = await transactionAPI.getAll(currentPage, 10);
      const data = response.data;

      if (currentPage === 1) {
        setTransactions(data.transactions || data || []);
      } else {
        setTransactions(prev => [...prev, ...(data.transactions || data || [])]);
      }

      setHasNextPage(data.hasNextPage || false);
    } catch (err) {
      setError('Erro ao carregar transações');
      console.error('Error loading transactions:', err);
    }
  }, [currentPage]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, accountsRes, transactionsRes] = await Promise.all([
        categoryAPI.getAll(),
        accountAPI.getAll(),
        transactionAPI.getAll(1, 10)
      ]);

      setCategories(categoriesRes.data || []);

      // Handle different response formats for accounts
      let accountsData = accountsRes.data;
      if (Array.isArray(accountsData)) {
        setAccounts(accountsData);
      } else if (accountsData && Array.isArray(accountsData.accounts)) {
        setAccounts(accountsData.accounts);
      } else if (accountsData && typeof accountsData === 'object') {
        // If it's a single account object, wrap in array
        setAccounts([accountsData]);
        accountsData = [accountsData];
      } else {
        setAccounts([]);
        accountsData = [];
      }

      const transactionData = transactionsRes.data;
      setTransactions(transactionData.transactions || transactionData || []);
      setHasNextPage(transactionData.hasNextPage || false);

      // Set default account if available
      if (accountsData && accountsData.length > 0) {
        setFormData(prev => ({ ...prev, accountId: accountsData[0].id.toString() }));
      }
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      loadTransactions();
    }
  }, [currentPage, loadTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        accountId: parseInt(formData.accountId),
        categoryId: parseInt(formData.categoryId),
        date: new Date(formData.date).toISOString()
      };

      if (editingTransaction) {
        await transactionAPI.update(editingTransaction.id, transactionData);
      } else {
        await transactionAPI.create(transactionData);
      }
      
      setCurrentPage(1);
      await loadTransactions();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar transação');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description || '',
      date: new Date(transaction.date).toISOString().split('T')[0],
      type: transaction.type,
      accountId: transaction.accountId.toString(),
      categoryId: transaction.categoryId.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      await transactionAPI.delete(id);
      setCurrentPage(1);
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir transação');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      accountId: Array.isArray(accounts) && accounts.length > 0 ? accounts[0].id.toString() : '',
      categoryId: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === formData.type);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'N/A';
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
            Transações
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Transação
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-danger-50 p-4 dark:bg-danger-900/20">
          <div className="text-sm text-danger-700 dark:text-danger-400">
            {error}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-success-500' : 'bg-danger-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {transaction.description || 'Sem descrição'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
                        : 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400'
                    }`}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>{getAccountName(transaction.accountId)} " </span>
                    <span>{getCategoryName(transaction.categoryId)} " </span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma transação</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comece adicionando sua primeira transação.
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nova Transação
            </Button>
          </div>
        </div>
      )}

      {hasNextPage && (
        <div className="text-center">
          <Button variant="secondary" onClick={handleLoadMore}>
            Carregar Mais
          </Button>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor
              </label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0,00"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Almoço, Salário, Combustível"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data
            </label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Conta
              </label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecione uma conta</option>
                {Array.isArray(accounts) && accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecione uma categoria</option>
                {getFilteredCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
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
              {editingTransaction ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;