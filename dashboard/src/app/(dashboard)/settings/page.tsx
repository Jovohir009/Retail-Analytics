'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { PasswordForm } from '@/features/settings/password-form';
import { PreferencesForm } from '@/features/settings/preferences-form';
import { ProfileForm } from '@/features/settings/profile-form';
import { StoreSettingsForm } from '@/features/settings/store-settings-form';
import { useStoreQuery } from '@/hooks/use-platform-queries';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const store = useStoreQuery();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage store information, timezone, language, profile, and account security."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Store information" description="These details drive reporting context and timezone display." />
          {store.isLoading ? <Skeleton className="h-80" /> : <StoreSettingsForm store={store.data} />}
        </Card>
        <Card>
          <CardHeader title="Application preferences" description="Workspace-level display preferences for this browser." />
          <PreferencesForm />
        </Card>
        <Card>
          <CardHeader title="Profile" description="Update the name shown in your workspace." />
          <ProfileForm user={user} />
        </Card>
        <Card>
          <CardHeader title="Password" description="Change the password used for dashboard access." />
          <PasswordForm />
        </Card>
      </div>
    </>
  );
}
