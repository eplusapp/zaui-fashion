export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export const safeJsonParse = <T>(value: string | null | undefined, fallback: T): T => {
  try {
    if (!value) return fallback;
    const result = JSON.parse(value) as T;
    return result;
  } catch {
    return fallback;
  }
};