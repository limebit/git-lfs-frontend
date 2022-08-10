import React from "react";
import { useField } from "remix-validated-form";
import { formInputClassName, validationErrorClassName } from ".";

export type ValidatedFormTextareaProps = JSX.IntrinsicElements["textarea"] & {
  name: string;
  form?: string;
};

export const ValidatedFormTextarea = ({
  name,
  children,
  form,
  ...inputProps
}: ValidatedFormTextareaProps) => {
  const { error, getInputProps } = useField(name, {
    formId: form,
  });
  return (
    <>
      <textarea
        {...getInputProps({ form, ...inputProps })}
        className={formInputClassName}
      />

      {error ? <span className={validationErrorClassName}>{error}</span> : null}
    </>
  );
};
