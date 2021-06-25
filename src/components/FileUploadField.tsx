import React from 'react'

export const FileField: React.FC<{
  file?: File[]
  name: string
  onChange: (event: React.ChangeEvent) => void
}> = ({ file, name, onChange }) => {
  const fileRef: React.RefObject<HTMLInputElement> = React.createRef()

  return (
    <div className="flex">
      {file && file.length > 0 && (
        <div className="p-1">
          <ul id="gallery" className="flex flex-1 flex-wrap">
            {file &&
              file.length > 0 &&
              file.map((f, idx) => {
                return <FilePreview key={`file-${idx}`} file={f} />
              })}
            {file?.length == 0 && (
              <li
                id="empty"
                className="h-full w-full text-center flex flex-col justify-center items-center"
              >
                <img
                  className="mx-auto w-32"
                  src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                  alt="no data"
                />
                <span className="text-small text-gray-500">
                  No files selected
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
      <div
        className="m-1 py-12 w-full border-dashed border-2 border-gray-400 flex flex-col justify-center items-center"
        onClick={() => {
          fileRef.current?.click()
        }}
      >
        <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
          <span>Drag and drop your</span>&nbsp;
          <span>files anywhere or</span>
        </p>
        <input
          ref={fileRef}
          name={name}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
        <span
          id="button"
          className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            fileRef.current?.click()
          }}
        >
          Upload a file
        </span>
      </div>
    </div>
  )
}

const FilePreview: React.FC<{ file: any }> = ({ file }) => {
  const url = URL.createObjectURL(file)

  return (
    <article
      tabIndex={0}
      className="group hasImage w-60 h-60 rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm"
    >
      <img
        alt={file.name}
        className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
        src={url}
      />
    </article>
  )
}
