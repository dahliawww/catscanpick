import CatPawIcon from "../Icon/CatPawIcon";
import CatAni from "../components/CatAni";

interface HeaderProps {
  showCalorieCalculator: boolean;
  setShowCalorieCalculator: (show: boolean) => void;
}

const Header = ({
  showCalorieCalculator,
  setShowCalorieCalculator,
}: HeaderProps) => {
  const handleToggleCalculator = () => {
    setShowCalorieCalculator(!showCalorieCalculator);
  };

  return (
    <>
      {/* Logo Section */}
      <div className="mx-auto max-w-[600px]">
        <div className="flex justify-center mt-16 md:mt-24 ">
          <div className="z-20 text-4xl text-center md:pb-0 text-slate-800 drop-shadow-lg font-kirang">
            CATS CAN PICK
          </div>
        </div>
      </div>

      {/* Title Bar Section */}
      <div className="relative mx-auto max-w-[900px]">
        <CatAni />
        <div className="mx-4 ">
          <div className="flex items-center justify-between p-1.5 bg-white border-[7px] rounded-full shadow-lg border-slate-300">
            {/* Title */}
            <div className="text-xl font-bold text-center text-slate-800 md:text-3xl font-huninn">
              <div className="px-3 md:px-4">貓罐比一比</div>
            </div>

            {/* Calorie Calculator Button */}
            <button
              type="button"
              onClick={handleToggleCalculator}
              {...(showCalorieCalculator
                ? { "aria-expanded": "true" }
                : { "aria-expanded": "false" })}
              aria-label={
                showCalorieCalculator ? "關閉熱量計算機" : "開啟熱量計算機"
              }
              className="font-bold text-center transition-all duration-200 rounded-full cursor-pointer group md:text-xl font-huninn bg-brand-lightpink hover:bg-brand-pink"
            >
              <div className="px-4 py-4 text-slate-700 md:px-6 fill-slate-700 hover:fill-white">
                熱量計算機{" "}
                <CatPawIcon className="inline-block w-5 h-5 ml-0.5 transition-transform duration-200 group-hover:rotate-45" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
