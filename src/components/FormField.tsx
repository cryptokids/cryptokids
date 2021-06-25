import React from 'react'

export const FormField: React.FC<{ title: string; errors?: string[] }> = ({
  title,
  errors,
  children,
}) => {
  return (
    <div className="mb-3">
      <label className="font-bold text-sm mb-2 ml-1">{title}</label>
      <div>{children}</div>
      {errors && errors.length > 0 && (
        <ul className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errors.map((e, idx) => {
            return <li key={`error-${idx}`}>{e}</li>
          })}
        </ul>
      )}
    </div>
  )
}
