export default function TextBlock() {
  return (
    <div className="m-4 border-4 rounded-md border-slate-200">
      <div className="p-4 space-y-3 text-sm text-left md:p-8 text-slate-600">
        {/* SEO 說明（不搶戲） */}
        <p className="pb-2 text-base text-slate-800">
          CatsCanPick 是一個貓罐頭比較工具，並包含熱量計算機功能，
          整理市售貓罐頭的營養成分、蛋白質、脂肪、熱量、重量與產地資訊，
          協助飼主依照貓咪需求快速比較不同貓罐頭， 找出適合自家貓咪的選擇。
        </p>

        {/* 原本的說明 */}
        <p>
          1.
          此網站資料皆來自BoboMom購買的罐頭及網路上的資訊，如有錯誤，請來信告知。
        </p>
        <p>
          2. 為方便飼主計算，水分算法為罐頭的重量乘以水分百分比。 因 1g 大約等於
          1ml，故直接以 ml 為單位。
        </p>
        <p>3. 如欄位為空白，則表示該罐頭未提供相關資訊。</p>
        <p>
          4. 如願意主動提供罐頭資訊，請來信
          <a href="mailto:bobomom2022@gmail.com" className="ml-1 underline">
            bobomom2022@gmail.com
          </a>
          ，BoboMom會提供表單供填寫。
        </p>
      </div>
    </div>
  );
}
