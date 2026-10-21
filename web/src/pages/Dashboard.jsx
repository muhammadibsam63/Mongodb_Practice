import { useAuth } from '../context/AuthContext';
import {
  User,
  Calendar,
  Shield,
  Mail,
  Clock,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-semibold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const lastUpdated = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={User}
          label="Account role"
          value={user?.role === 'admin' ? 'Administrator' : 'Standard User'}
          color="bg-brand-100 text-brand-600"
        />
        <StatCard
          icon={Calendar}
          label="Member since"
          value={memberSince}
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={Clock}
          label="Last updated"
          value={lastUpdated}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Profile summary card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Full name</p>
              <p className="text-sm font-medium text-slate-900">{user?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-slate-900">{user?.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Role</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Account ID</p>
              <p className="text-sm font-medium text-slate-900 font-mono text-xs">
                {user?._id?.slice(-8) || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state note */}
      <div className="card p-6 border-dashed">
        <p className="text-sm text-slate-500 text-center">
          No additional activity data available yet. Your account statistics will appear here as you use the application.
        </p>
      </div>
    </div>
  );
}
