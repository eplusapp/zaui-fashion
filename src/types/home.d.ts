export interface Banner {
  id: string;
  slug: string;
  content: string;
  link: string;
  display: string | null;
  order: number;
  status: boolean;

  createdAt: string;
  updatedAt: string;

  createdBy: string;
  updatedBy: string;
}

export type BannerResponse = Banner[];
