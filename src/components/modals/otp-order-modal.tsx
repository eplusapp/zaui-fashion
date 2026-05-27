import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    loading?: boolean;
    phone?: string;
    onClose: () => void;
    onConfirm: (otp: string) => Promise<void>;
}

export default function OtpOrderModal({
    open,
    loading,
    phone,
    onClose,
    onConfirm,
}: Props) {
    const [otp, setOtp] = useState("");
    useEffect(() => {
        if (!open) {
            setOtp("");
        }
    }, [open]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-lg font-bold">
                    Xác thực OTP
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    Mã OTP đã được gửi tới số điện thoại
                </p>
                <p className="font-semibold mt-1">
                    {phone}
                </p>
                <input
                    value={otp}
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full border rounded-md h-12 px-4 mt-4 text-center text-xl tracking-[10px]"
                    placeholder="000000"
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                    }}
                />
                <div className="flex gap-2 mt-6">
                    <button
                        className="flex-1 border rounded-md h-11"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        disabled={otp.length !== 6 || loading}
                        className="flex-1 bg-primary text-white rounded-md h-11 disabled:opacity-50"
                        onClick={() => onConfirm(otp)}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}