import GigachatLogo from "./assets/logos/gigachat_logo.png"
import KandinskyLogo from "./assets/logos/kandinsky_logo.png"
import NeuropoetLogo from "./assets/logos/neuropoet_logo.png"

export const Technologies = () => (
    <div className="w-full">
        <div className="grid grid-cols-1  md:flex gap-4 md:gap-1 lg:gap-1">
            <div className="flex flex-col items-center md:items-start justify-end">
                <div className="relative   ">
                    <img
                        src={GigachatLogo}
                        alt="GigaChat"
                        className="h-[45px] md:h-[calc(46px)]"
                    />
                </div>
                <span className="md:hidden text-sm text-white/70 mt-2">Генерация текста</span>
            </div>

            <div className="flex flex-col items-center md:items-start justify-end">
                <div className="relative   ">
                    <img
                        src={KandinskyLogo}
                        alt="Kandinsky"
                        className="h-[45px] md:h-[calc(46px)]"
                    />
                </div>
                <span className="md:hidden text-sm text-white/70 mt-2">Генерация обложек</span>
            </div>

            <div className="flex flex-col items-center md:items-start justify-end">
                <div className="relative   ">
                    <img
                        src={NeuropoetLogo}
                        alt="Kandinsky"
                        className="h-[45px] md:h-[calc(46px)]"
                    />
                </div>
                <span className="md:hidden text-sm text-white/70 mt-2">Генерация обложек</span>
            </div>

        </div>
    </div>
);

