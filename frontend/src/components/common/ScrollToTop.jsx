import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Cuộn lên đầu trang (0, 0) đồng bộ trước khi vẽ (paint) DOM
 * Loại bỏ hoàn toàn hiện tượng nháy layout / giật màn hình khi chuyển route
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
