export interface Address {
  id: number;
  personId: number;
  name: string;
  zipcode: string;
  street: string;
  number: number;
  complement?: string;
  enable: boolean;
  createdAt: string; // Ou Date
  updatedAt: string; // Ou Date
}

export interface CreateAddressDto {
  name: string;
  zipcode: string;
  street: string;
  number: number;
  complement?: string;
  enable: boolean;
}

export interface UpdateAddressDto {
  name?: string;
  zipcode?: string;
  street?: string;
  number?: number;
  complement?: string;
  enable?: boolean;
}