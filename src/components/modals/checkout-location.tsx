import { useEffect, useMemo, useState } from "react";
import Button from "../button";
import Modal from "./modal";
import { Icon, Radio } from "zmp-ui";
import { useAtomValue } from "jotai";
import { provincesState, wardsState } from "@/request/locations";
import { unwrap } from "jotai/utils";
import TextInput from "../text-input";
type Props = {
    recive?: 'customer' | 'eco';
    setRecive: (value: 'customer' | 'eco') => void;
}
const ecoAddress = [{
    address: '180 Trường Chinh',
    province_id: '01',
    province_name: 'Thành Phố Hà Nội',
    ward_id: '00229',
    ward_name: 'Phường Kim Liên',
    erp_province_id: '01',
    erp_ward_id: '00229'
}, {
    address: 'Lô 02, 03-A4.3 khu Công viên Bắc Tượng đài',
    province_id: '48',
    province_name: 'Thành Phố Đà Nẵng',
    ward_id: '20257',
    ward_name: 'Phường Hòa Cường',
    erp_province_id: '48',
    erp_ward_id: '20257'
}, {
    address: '148 Hoàng Hoa Thám',
    province_id: '79',
    province_name: 'Thành Phố Hồ Chí Minh',
    ward_id: '26983',
    ward_name: 'Phường Bảy Hiền',
    erp_province_id: '79',
    erp_ward_id: '26983'
}]
export default function CheckoutLocation(props: Props) {
    const { recive, setRecive } = props;
    const [open, setOpen] = useState(false);
    const provinces = useAtomValue(provincesState({}));

    const [selectedProvince, setSelectedProvince] = useState<{id: string; name: string}>();
    const [selectedWard, setSelectedWard] = useState<{ id: string; name: string }>();
    const [address, setAddress] = useState("");

    const wardsAtom = useMemo(() => {
        return unwrap(
            wardsState({
                provinceId: selectedProvince?.id,
            }),
            (prev) => prev ?? [],
        );
    }, [selectedProvince]);

    const wards = useAtomValue(wardsAtom);

    const selectedProvinceData = useMemo(() => {
        return provinces.find((x) => x.code === selectedProvince?.id);
    }, [provinces, selectedProvince]);

    const selectedWardData = useMemo(() => {
        return wards.find((x) => x.code === selectedWard?.id);
    }, [wards, selectedWard]);

    useEffect(() => {
        if (recive === 'customer') {
            setSelectedWard(undefined);
        }
    }, [selectedProvince]);
    const renderCustomerReceive = () => {
        return <>
            <div className="text-[20px] font-[600] w-full text-center">
                Chọn địa chỉ giao hàng tận nơi
            </div>
            <div className="mt-4">
                <div className="mb-2 text-sm font-semibold">
                    Tỉnh / Thành phố
                </div>
                <select
                    value={selectedProvince?.id || ""}
                    onChange={(e) => {
                        const province = provinces.find(
                            (x) => x.code === e.target.value,
                        );
                        if (!province) return;
                        setSelectedProvince({
                            id: province.code,
                            name: province.name,
                        });
                    }}
                    className="h-12 w-full rounded-[8px] border border-gray-300 bg-white px-4 outline-none"
                >
                    <option value="">
                        Chọn tỉnh / thành phố
                    </option>
                    {provinces.map((province) => (
                        <option
                            key={province.code}
                            value={province.code}
                        >
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <div className="mb-2 text-sm font-semibold">
                    Phường / Xã
                </div>
                <select
                    value={selectedWard?.id || ""}
                    disabled={!selectedProvince}
                    onChange={(e) => {
                        const ward = wards.find(
                            (x) => x.code === e.target.value,
                        );

                        if (!ward) return;

                        setSelectedWard({
                            id: ward.code,
                            name: ward.name,
                        });
                    }}
                    className="h-12 w-full rounded-[8px] border border-gray-300 bg-white px-4 outline-none disabled:bg-gray-100"
                >
                    <option value="">
                        Chọn phường / xã
                    </option>

                    {wards.map((ward) => (
                        <option
                            key={ward.code}
                            value={ward.code}
                        >
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>
            <TextInput title="Địa chỉ" value={address} onChange={(value) => setAddress(value)} placeHolder="Nhập địa chỉ" />
        </>
    }
    const getFullAddress = (val: any) => {
        return [
            val?.address,
            val?.ward_name,
            val?.district_name,
            val?.province_name
        ]
            .filter(i => !!i)
            .join(', ')
    }
    const renderEcoReceive = () => {
        return <>
            <div className="text-[20px] font-[600] w-full text-center">
                Chọn chi nhánh ECO mong muốn
            </div>
            {ecoAddress.map((item) => (
                <div onClick={() => {
                    setSelectedProvince({
                        id: item.province_id,
                        name: item.province_name
                    })
                    setSelectedWard({
                        id: item.ward_id,
                        name: item.ward_name
                    })
                    setAddress(item.address)
                    setOpen(false)
                }} key={item.address} className="border border-gray-300 rounded-lg p-4">
                    <div className="text-sm text-gray-500">{getFullAddress(item)}</div>
                </div>
            ))}
        </>
    }
    return (
        <>
            <div className="w-full my-4">
                <Radio.Group
                    onChange={(x) => {
                        setRecive(String(x) as 'customer' | 'eco')
                        setOpen(true)
                    }}
                    defaultValue="customer"
                    options={[
                        {
                            label: 'Giao hàng tận nơi',
                            value: 'customer'
                        },
                        {
                            label: 'Nhận tại Công ty Dược phẩm Eco',
                            value: 'eco'
                        }
                    ]}
                />
            </div>
            {selectedProvinceData && selectedWardData && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 mb-4">
                    <div className="text-sm text-gray-500">
                        Địa chỉ đã chọn
                    </div>

                    <div className="mt-2 text-base font-semibold">
                        {address}, {selectedWardData.name},  {selectedProvinceData.name}
                    </div>
                </div>
            )}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className="flex flex-col gap-4 mt-2">
                    {recive === 'customer' ? renderCustomerReceive() : renderEcoReceive()}
                    <Button
                        primary
                        onClick={() => setOpen(false)}
                    >
                        Đóng
                    </Button>
                    <div onClick={() => {
                        if (recive === 'customer') {
                            setRecive('eco')
                        } else {
                            setRecive('customer')
                        }
                    }} className="mb-2 text-xs font-[600] text-primary">
                        <Icon icon="zi-arrow-left" />{recive === 'customer' ? 'Hoặc, Nhận hàng tại Công ty Dược phẩm ECO' : 'Hoặc, Giao hàng tận nơi'}
                    </div>
                </div>
            </Modal>
        </>
    );
}