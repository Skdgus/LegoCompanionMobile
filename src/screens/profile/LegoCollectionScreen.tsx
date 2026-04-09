import backIcon from "../../../assets/weui_back-filled.svg";
import bambooBuildImg from "../../../assets/bamboo-build.png";
import flowerBuildImg from "../../../assets/flower-build.png";
import instructionImg1 from "../../../assets/instruction-img1.png";
import instructionImg2 from "../../../assets/instruction-img2.png";
import instructionImg3 from "../../../assets/instruction-img3.png";

type Props = { onBack: () => void };

const LEGO_ITEMS = [
  { id: "bamboo", name: "Bamboo Build",  detail: "325pcs · Medium", img: bambooBuildImg },
  { id: "flower", name: "Flower Build",  detail: "220pcs · Easy",   img: flowerBuildImg },
  { id: "img1",   name: "Botanicals I",  detail: "Lego Botanicals", img: instructionImg1 },
  { id: "img2",   name: "Botanicals II", detail: "Lego Botanicals", img: instructionImg2 },
  { id: "img3",   name: "Roses",         detail: "Lego Botanicals", img: instructionImg3 },
];

export function LegoCollectionScreen({ onBack }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[402px] bg-app-bg" style={{ minHeight: "100dvh" }}>
      <button
        type="button"
        onClick={onBack}
        className="absolute left-[15px] top-[64px] flex h-[31px] w-[74px] items-center rounded-full bg-[#FFB411] shadow-sm"
        aria-label="Back"
      >
        <img src={backIcon} alt="" width={8} height={16} className="absolute left-[12px] top-[7.5px] block" draggable={false} aria-hidden />
        <span className="absolute left-[25px] top-[4px] text-[14px] font-extrabold leading-[23px] text-[#2a2a2a]">Back</span>
      </button>

      <div className="px-[15px] pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)] pt-[120px]">
        <h1 className="text-[28px] font-extrabold leading-[40px] text-[#2a2a2a]">Lego Collection</h1>
        <p className="mt-[4px] text-[14px] font-bold text-[#949494]">
          {LEGO_ITEMS.length} instruction sets in your collection
        </p>

        <div className="mt-[24px] grid grid-cols-2 gap-[10px]">
          {LEGO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-[12px] border-[2px] border-[#FFE9B8] bg-white shadow-sm"
            >
              <img src={item.img} alt={item.name} className="h-[113px] w-full object-cover" draggable={false} />
              <div className="p-[10px]">
                <p className="text-[13px] font-extrabold text-[#2a2a2a]">{item.name}</p>
                <p className="text-[11px] font-bold text-[#949494]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-[20px] text-center text-[13px] font-bold text-[#949494]">
          Visit the Shop to purchase more sets!
        </p>
      </div>
    </div>
  );
}
