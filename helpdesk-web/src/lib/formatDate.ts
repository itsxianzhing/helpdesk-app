export function formatDate(
  value: string,
): string {
  return new Date(value).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}