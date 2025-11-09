/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useActionState } from 'react';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { loginUser } from '@/services/auth/loginUser';

const LoginFrom = ({ redirect }: { redirect?: string }) => {
  const [state, fromAction, isPending] = useActionState(loginUser, null);
  console.log('state', state);
  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find(
        (error: any) => error.field === fieldName
      );
      return error?.message || null;
    } else {
      return null;
    }
  };
  return (
    <form action={fromAction}>
      {redirect && <input type='hidden' name='redirect' value={redirect} />}
      <FieldGroup>
        <div className='grid grid-cols-1 gap-3'>
          {/* Email */}
          <Field className='gap-1'>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              name='email'
              // type='email'
              placeholder='m@example.com'
            />
            {getFieldError('email') && (
              <FieldDescription className='text-red-600 text-left'>
                {getFieldError('email')}
              </FieldDescription>
            )}
          </Field>

          {/* Password */}
          <Field className='gap-1'>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='Enter your password'
            />
            {getFieldError('password') && (
              <FieldDescription className='text-red-600 text-left'>
                {getFieldError('password')}
              </FieldDescription>
            )}
          </Field>
        </div>
        <FieldGroup className=''>
          <Field className=''>
            <Button type='submit'>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>

            <FieldDescription className='px-6 text-center'>
              Don&apos;t have an account?{' '}
              <a href='/register' className='text-blue-600 hover:underline'>
                Sign up
              </a>
            </FieldDescription>
            <FieldDescription className='px-6 text-center'>
              <a
                href='/forget-password'
                className='text-blue-600 hover:underline'
              >
                Forgot password?
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginFrom;
