import toast from 'react-hot-toast';
import { useThemeProvider } from '../utils/ThemeContext';

export const useAppToast = () => {
  const { currentTheme } = useThemeProvider();
  const isDark = currentTheme === 'dark';

  const baseStyle = isDark
    ? {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid rgba(55, 65, 81, 0.8)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      }
    : {
        background: '#ffffff',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      };

  const successStyle = isDark
    ? { ...baseStyle, border: '1px solid rgba(35, 159, 82, 0.4)', iconTheme: { primary: '#3ec972', secondary: '#1f2937' } }
    : { border: '1px solid #8bf0b0', iconTheme: { primary: '#3ec972', secondary: '#ffffff' } };

  const errorStyle = isDark
    ? { ...baseStyle, border: '1px solid rgba(197, 39, 39, 0.4)', iconTheme: { primary: '#ff5656', secondary: '#1f2937' } }
    : { border: '1px solid #ffb2b2', iconTheme: { primary: '#ff5656', secondary: '#ffffff' } };

  return {
    success: (message) => toast.success(message, { style: { ...baseStyle, ...successStyle }, iconTheme: successStyle.iconTheme }),
    error: (message) => toast.error(message, { style: { ...baseStyle, ...errorStyle }, iconTheme: errorStyle.iconTheme }),
    loading: (message) => toast.loading(message, { style: baseStyle }),
    dismiss: (id) => toast.dismiss(id),
    promise: (promise, msgs) => toast.promise(promise, msgs, { style: baseStyle }),
  };
};
