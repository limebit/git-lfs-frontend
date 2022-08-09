import React from "react";
import { useField } from "remix-validated-form";
import { formInputClassName, validationErrorClassName } from ".";

type ValidatedFormInputProps = JSX.IntrinsicElements["input"] & {
  name: string;
  form?: string;
};

export const ValidatedFormInput = ({
  name,
  children,
  form,
  ...inputProps
}: ValidatedFormInputProps) => {
  const { error, getInputProps } = useField(name, {
    formId: form,
  });
  return (
    <>
      <input
        {...getInputProps({ form, ...inputProps })}
        className={formInputClassName}
      />

      {error ? <span className={validationErrorClassName}>{error}</span> : null}
    </>
  );
};
