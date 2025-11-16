import { getInputFieldError } from '@/lib/getInputFieldError';
import { FieldDescription } from '../ui/field';

interface FieldErrorProps {
  field: string;
  state: { errors?: { field: string; message: string }[] } | null;
}

const InputFieldError = ({ field, state }: FieldErrorProps) => {
  if (getInputFieldError(field, state)) {
    return (
      <FieldDescription className='text-red-600'>
        {getInputFieldError(field, state)}
      </FieldDescription>
    );
  }

  return null;
};

export default InputFieldError;
