import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export function formatDate(dateString: string): string {
  return dayjs(dateString).format('YYYY.MM.DD');
}

export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('YYYY.MM.DD HH:mm');
}

export function formatRelative(dateString: string): string {
  const now = dayjs();
  const date = dayjs(dateString);
  const diffHours = now.diff(date, 'hour');

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = now.diff(date, 'day');
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(dateString);
}

export function formatArtistOrder(order: number): string {
  return String(order).padStart(2, '0');
}
