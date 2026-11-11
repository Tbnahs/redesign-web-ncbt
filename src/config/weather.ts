export interface Province {
  name: string;
  latitude: number;
  longitude: number;
}

export const provinces: Province[] = [
  { name: "Hà Nội", latitude: 21.0285, longitude: 105.8542 },
  { name: "TP. Hồ Chí Minh", latitude: 10.8231, longitude: 106.6297 },
  { name: "Đà Nẵng", latitude: 16.0544, longitude: 108.2022 },
  { name: "Hải Phòng", latitude: 20.8449, longitude: 106.6881 },
  { name: "Cần Thơ", latitude: 10.0452, longitude: 105.7469 },
  { name: "Huế", latitude: 16.4637, longitude: 107.5909 },
  { name: "Nghệ An", latitude: 18.6796, longitude: 105.6813 },
  { name: "Thanh Hóa", latitude: 19.8067, longitude: 105.7852 },
  { name: "Quảng Ninh", latitude: 20.9712, longitude: 107.0448 },
  { name: "Khánh Hòa", latitude: 12.2388, longitude: 109.1967 },
  { name: "Lâm Đồng", latitude: 11.9404, longitude: 108.4583 },
  { name: "An Giang", latitude: 10.376, longitude: 105.418 },
];

export const defaultProvince: Province = {
  name: "Hà Nội",
  latitude: 21.0285,
  longitude: 105.8542,
};
