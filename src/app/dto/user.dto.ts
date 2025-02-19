export type IUserPaginationRes = IPagination & {
  data: IUser[];
};

export type IUser = Omit<IUserResponse, "permissions">;

export type IPagination = {
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export type ISampleExcel = {
  sample_user: string;
  sample_brand: string;
  sample_color: string;
  sample_product: string;
  sample_supplier: string;
  current_page: number;
  message: string;
  total: number;
};

export type IUserGallery = {
  id: string;
  user_id: string;
  gallery: string;
  gallery_original: string;
  gallery_thumbnail: string;
};

export type IUserPicture = {
  id: string;
  user_id: string;
  picture: string;
  picture_original: string;
  picture_thumbnail: string;
};

export type IUserResponse = {
  id: string;
  name: string;
  authorization: string;
  email: string;
  dob: string;
  gender: "1" | "2";
  gender_text: string;
  status: "1" | "0";
  status_text: string;
  profile: string;
  profile_original: string;
  profile_thumbnail: string;
  role: {
    id: string;
    name: string;
    guard_name: string | null;
    landing_page: string | null;
  };
  role_id: string;
  permissions: IPermission[];
  sample_excels: ISampleExcel[];
  user_galleries: IUserGallery[];
  user_pictures: IUserPicture[];
};

export type IPermission = {
  id: string;
  name: string;
  label: string;
  guard_name: string;
  is_permission: "1" | "0";
  display_name: string;
  sub_permissions: ISubPermission[];
};

export type ISubPermission = {
  id: string;
  name: string;
  label: string;
  guard_name: string;
  is_permission: "1" | "0";
  display_name: string;
};
