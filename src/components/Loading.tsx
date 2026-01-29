import CatPawIcon from "../Icon/CatPawIcon";

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div className="inline-block mb-4 animate-spin" aria-hidden>
          <CatPawIcon className="w-16 h-16 text-brand-pink" />
        </div>
        <p className="text-xl font-semibold text-[#333333]">loading...</p>
        <span className="sr-only">正在載入貓罐頭資料</span>
      </div>
    </div>
  );
}
