import { useEffect, useState, type FormEvent } from 'react';

import type { UpdateProfileRequest, UserResponse } from '../types';

interface ProfileFormProps {
  profile: UserResponse;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (request: UpdateProfileRequest) => Promise<void>;
}

function ProfileForm({ profile, isSubmitting, error, onSubmit }: ProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPassword('');
  }, [profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const validationErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!trimmedName) {
      validationErrors.name = 'Name is required.';
    }

    if (!trimmedEmail) {
      validationErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (password && password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters.';
    }

    if (validationErrors.name || validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    await onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password: password || undefined,
      version: profile.version,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="profile-name" className="text-sm font-medium">
          Name
        </label>

        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);

            setErrors((current) => ({
              ...current,
              name: undefined,
            }));
          }}
          disabled={isSubmitting}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'profile-name-error' : undefined}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {errors.name && (
          <p id="profile-name-error" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="profile-email" className="text-sm font-medium">
          Email
        </label>

        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);

            setErrors((current) => ({
              ...current,
              email: undefined,
            }));
          }}
          disabled={isSubmitting}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'profile-email-error' : undefined}
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {errors.email && (
          <p id="profile-email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="profile-password" className="text-sm font-medium">
          New Password
        </label>

        <input
          id="profile-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);

            setErrors((current) => ({
              ...current,
              password: undefined,
            }));
          }}
          disabled={isSubmitting}
          minLength={8}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'profile-password-error' : undefined}
          placeholder="Leave blank to keep your current password"
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <p className="text-xs text-muted-foreground">
          Leave blank if you don't want to change your password.
        </p>

        {errors.password && (
          <p id="profile-password-error" className="text-sm text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
