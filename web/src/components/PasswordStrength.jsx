export default function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase', met: /[a-z]/.test(password) },
  ];

  const score = checks.filter((c) => c.met).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? colors[score - 1] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Strength: <span className="font-medium">{labels[score - 1] || 'Too short'}</span>
      </p>
      <ul className="space-y-0.5">
        {checks.map((c) => (
          <li
            key={c.label}
            className={`text-xs ${c.met ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {c.met ? '✓' : '○'} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
