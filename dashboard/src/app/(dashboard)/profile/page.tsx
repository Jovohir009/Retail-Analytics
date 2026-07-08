'use client';

import { CalendarDays, Lock, Mail, UserCircle, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/features/settings/profile-form';
import { PasswordForm } from '@/features/settings/password-form';
import { formatDateTime } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="Review account details and manage security for dashboard access."
      >
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader title="Account" description="Your customer account identity." />
          <div className="space-y-4">
            <AccountRow icon={UserCircle} label="Name" value={user?.name ?? 'Unknown'} />
            <AccountRow icon={Mail} label="Email" value={user?.email ?? 'Unknown'} />
            <AccountRow icon={CalendarDays} label="Created" value={formatDateTime(user?.createdAt)} />
            <AccountRow icon={Lock} label="Security" value="Password authentication" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Profile" description="Change your display name." />
            <ProfileForm user={user} />
          </Card>
          <Card>
            <CardHeader title="Security" description="Update your account password." />
            <PasswordForm />
          </Card>
        </div>
      </div>
    </>
  );
}

function AccountRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
