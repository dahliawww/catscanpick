import { useState, useEffect, useCallback } from "react";
import CatPawIcon from "../Icon/CatPawIcon";

interface PawData {
  id: number;
  top: number;
  left?: number;
  right?: number;
  rotation: number;
  opacity: number;
  side: "left" | "right";
}

// 常數配置
const SCROLL_THRESHOLD = 160; // 每滾動多少 px 出現一個新的腳印
const BASE_TOP = 48; // 初始 top 位置（px）
const VERTICAL_SPACING = 40; // 每個腳印之間的垂直間距（px）
const BOTTOM_MARGIN = 150; // 最後一個腳印距離底部的距離（px，增加以避免被切掉）
const PAW_SIZE = 32; // 腳印大小（px，w-8 h-8 = 32px）
const BOTTOM_PADDING = 50; // 計算總數時的底部留白（px）
const HEIGHT_CHECK_INTERVAL = 200; // 檢查頁面高度變化的間隔（ms）

export default function CatPawBackground() {
  const [paws, setPaws] = useState<PawData[]>([]);

  // 計算需要的腳印總數（根據頁面高度）
  const getTotalPaws = useCallback(() => {
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    // 根據視窗高度計算需要的腳印數量
    const availableHeight = viewportHeight - BASE_TOP - BOTTOM_PADDING;
    const pawsByHeight = Math.ceil(availableHeight / VERTICAL_SPACING) + 1;

    // 根據滾動距離計算需要的腳印數量
    const totalScrollableHeight = pageHeight - viewportHeight;
    const pawsByScroll =
      Math.ceil(totalScrollableHeight / SCROLL_THRESHOLD) + 2;

    // 取兩者中的較大值，並增加緩衝確保最後一個腳印能到達底部
    return Math.max(2, Math.max(pawsByHeight, pawsByScroll) + 1);
  }, []);

  const updatePaws = useCallback(
    (currentScrollY: number) => {
      const totalPaws = getTotalPaws();
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollableHeight = Math.max(1, pageHeight - viewportHeight);

      // 計算當前應該顯示的最新腳印 ID
      let currentPawId: number;
      let progressInThreshold: number;

      if (currentScrollY === 0) {
        // 初始狀態：顯示腳印 1 和 2
        currentPawId = 2;
        progressInThreshold = 0;
      } else if (currentScrollY >= totalScrollableHeight) {
        // 滾動到底部：顯示最後一個腳印
        currentPawId = totalPaws;
        progressInThreshold = 1;
      } else {
        // 根據滾動進度計算當前腳印 ID
        const scrollProgress = currentScrollY / totalScrollableHeight;
        const targetPawId = 2 + (totalPaws - 2) * scrollProgress;
        currentPawId = Math.floor(targetPawId);
        progressInThreshold = targetPawId - currentPawId;
      }

      const newPaws: PawData[] = [];
      const maxPawsToShow = currentScrollY === 0 ? 2 : 3; // 靜止時顯示 2 個，滾動時顯示 3 個

      // 生成要顯示的腳印
      for (let i = 0; i < maxPawsToShow; i++) {
        const pawId = currentPawId - i;

        // 驗證腳印 ID 有效性
        if (pawId < 1 || pawId > totalPaws) continue;

        // 計算位置和旋轉角度（右側）
        const rightPosition = pawId % 2 === 1 ? 48 : 96; // 單數在 right-12 (48px)，雙數在 right-24 (96px)
        const rightRotation = pawId % 2 === 1 ? -20 : 20; // 單數 -20deg，雙數 20deg

        // 左側鏡射：位置和旋轉角度都鏡射
        const leftPosition = pawId % 2 === 1 ? 48 : 96; // 鏡射後位置相同
        const leftRotation = pawId % 2 === 1 ? 20 : -20; // 旋轉角度鏡射（相反）

        // 計算 top 位置
        let top: number;
        if (currentScrollY >= totalScrollableHeight && pawId === totalPaws) {
          // 最後一個腳印在底部附近，確保不會被切掉
          // 考慮腳印大小，確保完整顯示
          top = Math.max(BASE_TOP, viewportHeight - BOTTOM_MARGIN - PAW_SIZE);
        } else {
          // 正常計算位置
          const baseOffset = (pawId - 1) * VERTICAL_SPACING;
          const currentOffset =
            i === 0 ? progressInThreshold * VERTICAL_SPACING : 0;
          top = BASE_TOP + baseOffset + currentOffset;
          // 確保腳印不會超出視窗底部
          top = Math.min(top, viewportHeight - PAW_SIZE - 20);
        }

        // 計算透明度
        let opacity = 1;
        if (i === 0) {
          // 最新的腳印完全不透明
          opacity = 1;
        } else if (i === 1) {
          // 上一個腳印保持不透明
          opacity = 1;
        } else if (i === 2) {
          // 更舊的腳印在切換過程中淡出
          if (currentScrollY === 0) {
            continue; // 初始狀態不顯示舊的腳印
          } else if (currentPawId >= 3 && currentScrollY >= SCROLL_THRESHOLD) {
            opacity = Math.max(0, 1 - progressInThreshold);
          } else {
            continue;
          }
        }

        // 透明度太低時不顯示
        if (opacity <= 0.05) continue;

        // 添加右側腳印
        newPaws.push({
          id: pawId,
          top,
          right: rightPosition,
          rotation: rightRotation,
          opacity,
          side: "right",
        });

        // 添加左側鏡射腳印
        newPaws.push({
          id: pawId + 10000, // 使用不同的 ID 避免衝突
          top,
          left: leftPosition,
          rotation: leftRotation,
          opacity,
          side: "left",
        });
      }

      setPaws(newPaws);
    },
    [getTotalPaws],
  );

  // 初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePaws(0);
    }, 100);
    return () => clearTimeout(timer);
  }, [updatePaws]);

  // 監聽滾動和頁面高度變化
  useEffect(() => {
    let ticking = false;
    let lastHeight = document.documentElement.scrollHeight;
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePaws(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      updatePaws(window.scrollY);
      lastHeight = document.documentElement.scrollHeight;
    };

    const checkHeightChange = () => {
      const currentHeight = document.documentElement.scrollHeight;
      if (currentHeight !== lastHeight) {
        updatePaws(window.scrollY);
        lastHeight = currentHeight;
      }
    };

    // 使用 ResizeObserver 監聽頁面大小變化
    const resizeObserver = new ResizeObserver(checkHeightChange);
    resizeObserver.observe(document.documentElement);

    // 定期檢查頁面高度變化（備用方案）
    checkInterval = setInterval(checkHeightChange, HEIGHT_CHECK_INTERVAL);

    // 綁定事件監聽器
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("load", handleResize, { passive: true });

    // 清理函數
    return () => {
      resizeObserver.disconnect();
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [updatePaws]);

  return (
    <>
      {/* 左側腳印 */}
      <div className="absolute left-0 z-0 w-full h-screen ml-0 pointer-events-none md:ml-4 inset-50">
        {paws
          .filter((paw) => paw.side === "left")
          .map((paw) => (
            <div
              key={paw.id}
              className="absolute paw-icon-container"
              style={
                {
                  "--paw-top": `${paw.top}px`,
                  "--paw-left": `${paw.left}px`,
                  "--paw-rotation": `${paw.rotation}deg`,
                  "--paw-opacity": paw.opacity,
                  top: "var(--paw-top)",
                  left: "var(--paw-left)",
                  transform: "rotate(var(--paw-rotation))",
                  opacity: "var(--paw-opacity)",
                  transition: "top 0.1s linear, opacity 0.3s ease-out",
                } as React.CSSProperties
              }
            >
              <div className="w-8 h-8 rotate-180 text-brand-lightpink">
                <CatPawIcon className="w-full h-full" />
              </div>
            </div>
          ))}
      </div>

      {/* 右側腳印 */}
      <div className="absolute left-0 z-0 w-full h-screen pointer-events-none inset-50">
        {paws
          .filter((paw) => paw.side === "right")
          .map((paw) => (
            <div
              key={paw.id}
              className="absolute paw-icon-container"
              style={
                {
                  "--paw-top": `${paw.top}px`,
                  "--paw-right": `${paw.right}px`,
                  "--paw-rotation": `${paw.rotation}deg`,
                  "--paw-opacity": paw.opacity,
                  top: "var(--paw-top)",
                  right: "var(--paw-right)",
                  transform: "rotate(var(--paw-rotation))",
                  opacity: "var(--paw-opacity)",
                  transition: "top 0.1s linear, opacity 0.3s ease-out",
                } as React.CSSProperties
              }
            >
              <div className="w-8 h-8 rotate-180 text-brand-lightpink">
                <CatPawIcon className="w-full h-full" />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
