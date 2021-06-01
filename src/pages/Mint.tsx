import { MetadataField } from 'mintbase'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { mintThing, nearState } from '../state/near'

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

const MintButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div
      className="p-5"
      onClick={() => {
        onClick && onClick()
      }}
    >
      <div className="relative ">
        <div className="absolute bg-black top-0.5 -right-0.5 -bottom-0.5 left-0.5"></div>
        <div
          className="relative text-sm border cursor-pointer"
          style={{
            height: 38,
            backgroundColor: 'rgb(190, 242, 100)',
            borderColor: 'rgb(0, 0, 0)',
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-black tracking-wide uppercase RobotoMono-Bold_font__226og">
            <span>&nbsp;Mint&nbsp;</span>
          </span>
        </div>
      </div>{' '}
    </div>
  )
}

const Mint: React.FC = () => {
  const { mintbase } = useRecoilValue(nearState)
  const [formState, setFormState] = useState<{ thing?: any[]; title: string }>({
    title: '',
  })

  const fileRef: React.RefObject<HTMLInputElement> = React.createRef()

  const handleInputChange = (event: React.ChangeEvent) => {
    const target = event.target
    let value: any
    switch (target.type) {
      case 'file':
        value = [target.files[0]]
        break

      default:
        value = target.value
        break
    }
    // const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    // thing
    setFormState({ ...formState, [name]: value })
  }

  const mint = async () => {
    console.log(formState)
    await mintThing({ ...formState, mintbase })
  }

  return (
    <div className="w-full">
      <form className="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700">
        <div className="mb-3">
          <label className="font-bold text-sm mb-2 ml-1">Title</label>
          <div>
            <input
              name="title"
              className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              type="text"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <div
            className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center"
            onClick={(e) => {
              fileRef.current?.click()
            }}
          >
            <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
              <span>Drag and drop your</span>&nbsp;
              <span>files anywhere or</span>
            </p>
            <input
              ref={fileRef}
              name="thing"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
            <button
              id="button"
              className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              onClick={(e) => {
                e.stopPropagation()
                fileRef.current?.click()
              }}
            >
              Upload a file
            </button>
          </div>
          <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
            To Upload
          </h1>

          <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
            {formState['thing']?.length > 0 &&
              formState['thing'].map((f, idx) => {
                return <FilePreview key={`file-${idx}`} file={f} />
              })}
            {formState['thing']?.length == 0 && (
              <li
                id="empty"
                className="h-full w-full text-center flex flex-col items-center justify-center items-center"
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
        <div className="mb-3">
          <MintButton onClick={mint} />
        </div>
      </form>
    </div>
  )
}

export default Mint
