import { useEffect, useState } from 'react';

import {
  getProfile,
  updateProfile,
} from '../api/userApi';

import ProfileForm from '../components/ProfileForm';

import type {
  UpdateProfileRequest,
  UserResponse,
} from '../types';

import { ApiError } from '../../../lib/apiError';
import { formatDate } from '../../../lib/formatDate';

import { useAuth } from '../../auth/hooks/useAuth';

import { useNotification } from '../../../app/notification/NotificationContext';

function ProfilePage() {
  const { updateUser } = useAuth();

  const { showNotification } = useNotification();

  const [profile, setProfile] =
    useState<UserResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProfile();

        setProfile(response);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleUpdate(
    request: UpdateProfileRequest,
  ) {
    if (!profile || isUpdating) {
      return;
    }

    setActionError(null);
    setIsUpdating(true);

    try {
      const response = await updateProfile(request);

      setProfile(response);

      updateUser({
        name: response.name,
        email: response.email,
      });

      showNotification(
        'Profile updated successfully.',
        'success',
      );
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'CONCURRENCY_CONFLICT') {
          setActionError(
            'Your profile was modified by another user. Please refresh and try again.',
          );
        } else {
          setActionError(error.message);
        }
      } else {
        setActionError(
          'Failed to update profile.',
        );
      }
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            Profile
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and account
            settings.
          </p>
        </div>

        <ProfileForm
          profile={profile}
          isSubmitting={isUpdating}
          error={actionError}
          onSubmit={handleUpdate}
        />
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View information about your Helpdesk account.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Role
            </p>

            <p className="mt-1 font-medium">
              {profile.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <p className="mt-1 font-medium">
              {profile.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Created
            </p>

            <p className="mt-1 font-medium">
              {formatDate(profile.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-medium">
              {profile.updatedAt
                ? formatDate(profile.updatedAt)
                : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;