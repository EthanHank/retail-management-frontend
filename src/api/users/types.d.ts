export type User = {
  id: string;
  username: string;
  role: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  activeFlag: boolean;
};

export type AddUser = {
  username: string;
  password: string;
  role: string;
};

export type UpdateUser = {
  id: string;
  username: string;
  role: string;
};


