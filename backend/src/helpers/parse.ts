// Prisma validates argument types strictly at runtime (unlike the old raw
// SQL, which just interpolated values as literal text and let SQL Server
// coerce them). Frontend form values often arrive as strings even for
// numeric/boolean fields, so every create/update route converts
// through these first.

export const toNumber = (value: unknown): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

export const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value === "true" || value === "1";
  return Boolean(value);
};
