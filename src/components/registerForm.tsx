'use client';
import { useActionState, useEffect } from 'react';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { registerPatient } from '@/services/auth/registerPatient';
import { toast } from 'sonner';
import InputFieldError from './shared/InputFieldError';

const RegisterForm = () => {
  const [state, fromAction, isPending] = useActionState(registerPatient, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      if (state.message === 'Duplicate key error') {
        toast.error('Email already exists');
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={fromAction}>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field>
            <FieldLabel htmlFor='name'>Full Name</FieldLabel>
            <Input id='name' name='name' type='text' placeholder='jhon doe' />
            {/* {getFieldError('name') && (
              <FieldDescription className='text-red-600 text-left'>
                {getFieldError('name')}
              </FieldDescription>
            )} */}
            <InputFieldError field='name' state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor='address'>Address</FieldLabel>
            <Input
              id='address'
              name='address'
              type='text'
              placeholder='123 Main St'
            />
            <InputFieldError field='address' state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='m@example.com'
            />
            <InputFieldError field='email' state={state} />
          </Field>
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <Input id='password' name='password' type='password' />
            <InputFieldError field='password' state={state} />
          </Field>
          <Field className='md:col-span-2'>
            <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
            />
            <InputFieldError field='confirmPassword' state={state} />
          </Field>
        </div>

        <FieldGroup>
          <Field>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating Account' : 'Create Account'}
            </Button>
            <FieldDescription className='px-6 text-center'>
              Already have an account?{' '}
              <a href='/login' className='text-blue-600 hover:underline'>
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
