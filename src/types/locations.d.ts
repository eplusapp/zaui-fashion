
export interface Province {
  code: string;
  name: string;
  sort?: number;
}

export interface Ward {
  code: string;
  name: string;
  sort?: number;
}

export interface ProvinceResponse {
  data?: Province[];
}

export interface WardResponse {
  data?: {
    wards: Ward[];
  };
}

export interface ProvinceParams {
  size?: number;
}

export interface DeliveryTimeParams {
  provinceId: string;
}
export interface DelivertyTimeRespond {
  estimatedWareHouse: string;
  estimatedWareHousePeriod: string;
}

export interface WardParams {
  size?: number;
  provinceId?: string;
}
