
export type PatientPersonalInfo = {
  fullName: string;
  birthDate: string;
  gender: string;
  photo: string;
};

export type PatientDocuments = {
  passport: {
    series: string;
    number: string;
    issuedBy: string;
    issuedDate: string;
  };
  snils: string;
  inn: string;
};

export type PatientMedicalInfo = {
  cardNumber: string;
  attachmentDate: string;
  clinic: string;
};

export type VisitData = {
  date: string;
  doctor: string;
  type: string;
  details?: string;
};

export type TestData = {
  date: string;
  name: string;
  status: string;
};

export type ServiceData = {
  date: string;
  service: string;
  cost: string;
};

export type PatientData = {
  personalInfo: PatientPersonalInfo;
  documents: PatientDocuments;
  medicalInfo: PatientMedicalInfo;
  recentVisits: VisitData[];
  recentTests: TestData[];
  paidServices: ServiceData[];
};
