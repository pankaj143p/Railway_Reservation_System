export interface UserFormProps {
  onSubmit: (formData: {
    fullName: string;
    seatCount: string;
    age: string;
    email: string;
  }) => void;
}