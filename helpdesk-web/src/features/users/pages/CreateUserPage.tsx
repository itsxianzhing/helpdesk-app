import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createUser } from "../api/userApi";
import { ApiError } from "../../../lib/apiError";
import { useNotification } from "../../../app/notification/NotificationContext";

function CreateUserPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const { showNotification } = useNotification();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    submit?: string;
  }>({});

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
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
      validationErrors.name =
        "Name is required.";
    }

    if (!trimmedEmail) {
      validationErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail,
      )
    ) {
      validationErrors.email =
        "Please enter a valid email address.";
    }

    if (!password) {
      validationErrors.password =
        "Password is required.";
    } else if (password.length < 8) {
      validationErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
      validationErrors.name ||
      validationErrors.email ||
      validationErrors.password
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      showNotification(
        "User created successfully.",
        "success",
      );

      navigate("/admin/users");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({
          submit: error.message,
        });
      } else {
        setErrors({
          submit: "Failed to create user.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            Create User
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new Helpdesk user account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);

                setErrors((current) => ({
                  ...current,
                  name: undefined,
                  submit: undefined,
                }));
              }}
              disabled={isSubmitting}
              required
              aria-invalid={!!errors.name}
              aria-describedby={
                errors.name
                  ? "name-error"
                  : undefined
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                setErrors((current) => ({
                  ...current,
                  email: undefined,
                  submit: undefined,
                }));
              }}
              disabled={isSubmitting}
              required
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            {errors.email && (
              <p
                id="email-error"
                className="text-sm text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                setErrors((current) => ({
                  ...current,
                  password: undefined,
                  submit: undefined,
                }));
              }}
              disabled={isSubmitting}
              required
              minLength={8}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters.
            </p>

            {errors.password && (
              <p
                id="password-error"
                className="text-sm text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.submit}
            </p>
          )}

          <div className="flex">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting
                ? "Creating..."
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;