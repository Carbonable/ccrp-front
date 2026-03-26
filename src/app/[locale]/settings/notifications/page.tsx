'use client';

import { useState, useEffect } from 'react';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface NotifPrefs {
  inApp: boolean;
  email: boolean;
  mobile: boolean;
}

const STORAGE_KEY = 'ccrp_notification_prefs';

const DEFAULT_PREFS: NotifPrefs = {
  inApp: true,
  email: true,
  mobile: false,
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-greenish-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
        checked ? 'border-greenish-600 bg-greenish-600' : 'border-neutral-600 bg-neutral-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

interface PrefRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function PrefRow({ icon, title, description, checked, onChange }: PrefRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-700 bg-neutral-800/50 px-5 py-4 gap-4">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0 rounded-lg bg-neutral-700/60 p-2 text-greenish-400">
          {icon}
        </div>
        <div>
          <p className="font-medium text-neutral-100">{title}</p>
          <p className="mt-0.5 text-sm text-neutral-400">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  function update(key: keyof NotifPrefs, val: boolean) {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-neutral-800 p-2.5 text-greenish-400">
            <BellIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100">Notification preferences</h1>
            <p className="text-sm text-neutral-400">
              Choose how you want to be notified about important events.
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <PrefRow
          icon={<BellIcon className="h-5 w-5" />}
          title="In-app notifications"
          description="Receive notifications directly in the app via the bell icon."
          checked={prefs.inApp}
          onChange={(val) => update('inApp', val)}
        />
        <PrefRow
          icon={<EnvelopeIcon className="h-5 w-5" />}
          title="Email notifications"
          description="Receive a summary of important events by email (projects, deadlines, critical stocks)."
          checked={prefs.email}
          onChange={(val) => update('email', val)}
        />
        <PrefRow
          icon={<DevicePhoneMobileIcon className="h-5 w-5" />}
          title="Mobile notifications"
          description="Receive push notifications on your mobile device (Carbonable app)."
          checked={prefs.mobile}
          onChange={(val) => update('mobile', val)}
        />
      </div>

      {/* Save feedback */}
      <div
        className={`mt-6 flex items-center justify-end transition-opacity duration-300 ${
          saved ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="rounded-full bg-greenish-900/40 px-4 py-1.5 text-sm text-greenish-400 border border-greenish-700">
          ✓ Preferences saved
        </span>
      </div>

      {/* Info note */}
      <div className="mt-8 rounded-xl border border-neutral-700 bg-neutral-800/30 px-5 py-4">
        <p className="text-xs text-neutral-500 leading-relaxed">
          Preferences are stored locally in your browser. Email and mobile notifications require server-side configuration (coming soon).
          et mobiles nécessitent une configuration côté serveur (disponible prochainement).
        </p>
      </div>
    </div>
  );
}
