import clsx from 'clsx';

import { TextInput, TextInputProps } from '@mantine/core';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

export type TInputProps<T extends FieldValues> = UseControllerProps<T> &
  TextInputProps;

const TInput = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  onChange,
  className,
  classNames,
  ...props
}: TInputProps<T>) => {
  const {
    field: { value, onChange: fieldOnChange, ...field },
    fieldState,
  } = useController<T>({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
  });

  return (
    <div className={clsx('w-full', className)}>
      <TextInput
        radius="xs"
        variant="unstyled"
        classNames={{
          input: clsx(
            '!py-3 !text-md !text-black border-b border-b-slate-400 focus:!border-b-black'
          ),
          error: 'text-red-500',
          ...classNames,
        }}
        className="relative w-full "
        inputWrapperOrder={['label', 'input', 'description', 'error']}
        value={value}
        onChange={(e) => {
          fieldOnChange(e);
          onChange?.(e);
        }}
        {...field}
        {...props}
      />
      {fieldState.error?.message && (
        <span className="mt-1 text-sm leading-3 text-red-500">
          {fieldState.error?.message}
        </span>
      )}
    </div>
  );
};

export default TInput;