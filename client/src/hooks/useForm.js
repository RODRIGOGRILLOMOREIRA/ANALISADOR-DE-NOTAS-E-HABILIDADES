import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar formulários
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Function} onSubmit - Função a ser executada no submit
 * @returns {Object} { values, errors, handleChange, handleSubmit, resetForm, setValues, setErrors }
 */
export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(values);
    } catch (error) {
      if (error.response?.data?.errors) {
        // Erros de validação do backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.param || err.field] = err.msg || err.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Erro ao enviar formulário' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
};
