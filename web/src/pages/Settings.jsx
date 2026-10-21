import { useState } from 'react';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import PasswordStrength from '../components/PasswordStrength';

export default function Settings() {
  const toast = useToast();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const toggle = (field) => () => setShow((p) => ({ ...p, [field]: !p[field] }));

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (form.newPassword.length < 8) e.newPassword = 'Must be at least 8 characters';
    if (!form.confirmNewPassword) e.confirmNewPassword = 'Please confirm new password';
    else if (form.newPassword !== form.confirmNewPassword)
      e.confirmNewPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.patch('/users/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account security</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" />
          Change password
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Ensure your account is using a strong, unique password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label">
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={show.current ? 'text' : 'password'}
                className={`input pr-10 ${errors.currentPassword ? 'input-error' : ''}`}
                value={form.currentPassword}
                onChange={update('currentPassword')}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={toggle('current')}
                tabIndex={-1}
              >
                {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-xs text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="label">
              New password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={show.new ? 'text' : 'password'}
                className={`input pr-10 ${errors.newPassword ? 'input-error' : ''}`}
                value={form.newPassword}
                onChange={update('newPassword')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={toggle('new')}
                tabIndex={-1}
              >
                {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-xs text-red-600">{errors.newPassword}</p>
            )}
            <PasswordStrength password={form.newPassword} />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="label">
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={show.confirm ? 'text' : 'password'}
                className={`input pr-10 ${errors.confirmNewPassword ? 'input-error' : ''}`}
                value={form.confirmNewPassword}
                onChange={update('confirmNewPassword')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={toggle('confirm')}
                tabIndex={-1}
              >
                {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="mt-1.5 text-xs text-red-600">{errors.confirmNewPassword}</p>
            )}
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating…
                </>
              ) : (
                'Update password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
