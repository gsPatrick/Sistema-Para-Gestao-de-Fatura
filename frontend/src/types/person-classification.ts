export interface PersonClassification {
  personId: number;
  classificationId: number;
  createdAt: string; // Ou Date
  updatedAt: string; // Ou Date
}

export interface CreatePersonClassificationDto {
    classificationId: number;
}

export interface Classification {
  id: number;
  name: string;
  enable: boolean;
  createdAt: string; // Ou Date
  updatedAt: string; // Ou Date
}