import { useEffect, useMemo, useState } from "react";

type Props = {
    endTime: string | number | Date;
};

export default function Countdown({ endTime }: Props) {
    const calculateTimeLeft = () => {
        const difference =
            new Date(endTime).getTime() - new Date().getTime();

        if (difference <= 0) {
            return {
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (difference % (1000 * 60)) / 1000
        );

        return {
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
            seconds: String(seconds).padStart(2, "0"),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);
    const items = useMemo(
        () => [
            timeLeft.hours,
            timeLeft.minutes,
            timeLeft.seconds,
        ],
        [timeLeft]
    );
    return (
        <div className="flex items-center gap-1">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <div
                        className="
                            bg-black
                            text-white
                            text-sm
                            font-bold
                            rounded
                            w-[36px]
                            h-[28px]
                            flex
                            items-center
                            justify-center
                            tabular-nums
                            "
                    >
                        {item}
                    </div>
                    {index !== items.length - 1 && (
                        <span className="text-white font-bold">
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}