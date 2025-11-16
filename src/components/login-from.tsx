'use client';
import { useActionState, useEffect } from 'react';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { loginUser } from '@/services/auth/loginUser';
import { toast } from 'sonner';
import InputFieldError from './shared/InputFieldError';

const LoginFrom = ({ redirect }: { redirect?: string }) => {
  const [state, fromAction, isPending] = useActionState(loginUser, null);

  useEffect(() => {
    if (!state || state.success) return;

    if (state.message) {
      if (state.message === 'No record was found') {
        toast.error('Email does not exist');
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

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
            {/* {getInputFieldError('email', state) && (
              <FieldDescription className='text-red-600 text-left'>
                {getInputFieldError('email', state)}
              </FieldDescription>
            )} */}

            <div className='items-start flex'>
              <InputFieldError field='email' state={state} />
            </div>
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
            {/* {getInputFieldError('password', state) && (
              <FieldDescription className='text-red-600 text-left'>
                {getInputFieldError('password', state)}
              </FieldDescription>
            )} */}

            <div className='flex items-start'>
              <InputFieldError field='password' state={state} />
            </div>
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
