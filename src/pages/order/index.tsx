import { EmptyBoxIcon } from "@/components/vectors";
import LoadingComponent from "@/components/loading";
import { getOrdersState } from "@/request/order";

import {
  ordersHasMoreState,
  ordersLoadedState,
  ordersPageState,
  ordersScrollState,
  ordersState,
} from "@/pages/order/order-store";

import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import OrderItem from "./order-item";

export default function OrderPage() {
  const [, getOrders] = useAtom(getOrdersState);

  const [orders, setOrders] = useAtom(ordersState);
  const [page, setPage] = useAtom(ordersPageState);
  const [hasMore, setHasMore] = useAtom(ordersHasMoreState);
  const [loaded, setLoaded] = useAtom(ordersLoadedState);
  const [savedScroll, setSavedScroll] = useAtom(
    ordersScrollState
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(
    !loaded
  );

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const startY = useRef(0);
  const threshold = 80;

  const bottomRef = useRef<HTMLDivElement>(null);

  const phone = "0335913021";

  const fetchOrders = useCallback(
    async (
      pageNumber: number,
      replace = false
    ) => {
      const data = await getOrders({
        phone,
        page: pageNumber,
        limit: 10,
      });

      const items = data ?? [];

      setOrders((prev) =>
        replace ? items : [...prev, ...items]
      );

      setHasMore(items.length >= 10);

      return items;
    },
    [getOrders, phone, setOrders, setHasMore]
  );

  const loadInitial = useCallback(async () => {
    if (loaded) {
      setInitialLoading(false);
      return;
    }

    try {
      setInitialLoading(true);

      const items = await getOrders({
        phone,
        page: 1,
        limit: 10,
      });

      setOrders(items ?? []);
      setPage(1);
      setHasMore((items?.length ?? 0) >= 10);
      setLoaded(true);
    } finally {
      setInitialLoading(false);
    }
  }, [
    getOrders,
    phone,
    loaded,
    setOrders,
    setPage,
    setHasMore,
    setLoaded,
  ]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (savedScroll > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: savedScroll,
          behavior: "instant" as ScrollBehavior,
        });
      }, 50);
    }
  }, []);

  useEffect(() => {
    return () => {
      setSavedScroll(window.scrollY);
    };
  }, [setSavedScroll]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      const items = await getOrders({
        phone,
        page: 1,
        limit: 10,
      });

      setOrders(items ?? []);
      setPage(1);
      setHasMore((items?.length ?? 0) >= 10);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshing,
    getOrders,
    phone,
    setOrders,
    setPage,
    setHasMore,
  ]);

  const onLoadMore = useCallback(async () => {
    if (
      loadingMore ||
      refreshing ||
      !hasMore
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const items = await fetchOrders(nextPage);

      if (items.length > 0) {
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [
    page,
    hasMore,
    loadingMore,
    refreshing,
    fetchOrders,
    setPage,
  ]);

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    if (window.scrollY > 0) return;

    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    if (window.scrollY > 0 || refreshing) {
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(
        Math.min(distance, 120)
      );
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    if (pullDistance >= threshold) {
      await onRefresh();
    }

    setPullDistance(0);
    setIsPulling(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          loaded &&
          orders.length > 0
        ) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    const current = bottomRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => observer.disconnect();
  }, [
    loaded,
    orders.length,
    onLoadMore,
  ]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="overflow-hidden transition-all duration-200 flex items-center justify-center"
        style={{
          height: pullDistance,
        }}
      >
        {refreshing && <LoadingComponent />}
      </div>

      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {orders.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center pt-20">
            <EmptyBoxIcon />

            <div className="text-[24px] font-[600] text-[#646464]">
              Bạn chưa có đơn hàng nào
            </div>
          </div>
        ) : (
          <>
            <div className="py-2">
              {orders.map((order) => (
                <OrderItem
                  key={order.code}
                  order={order}
                />
              ))}
            </div>

            {loadingMore && (
              <div className="py-4 text-center">
                <LoadingComponent />
              </div>
            )}

            {!loadingMore &&
              hasMore && (
                <div
                  ref={bottomRef}
                  className="h-10"
                />
              )}

            {!hasMore && (
              <div className="py-6 text-center text-sm text-gray-400">
                Đã hiển thị tất cả đơn hàng
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}