import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { charitiesState, ICharitiesData } from '../state/charities'
import { mintThing, nearState } from '../state/near'

import loader from 'url:../assets/loader.gif'

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
  const charities = useRecoilValueLoadable(charitiesState)
  const [isLoading, setLoading] = useState(false)
  const [formState, setFormState] = useState<{
    thing?: any[]
    title: string | null
    description: string | null
    charity: string | null
  }>({
    title: null,
    description: null,
    charity: null,
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

  useEffect(() => {
    if (charities.contents) {
      setFormState({ ...formState, ['charity']: charities.contents[0].id })
    }
  }, [charities])

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
          <label className="font-bold text-sm mb-2 ml-1">Description</label>
          <div>
            <input
              name="description"
              className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              type="text"
              onChange={handleInputChange}
            />
          </div>
        </div>
        {charities.state == 'hasValue' && charities.contents && (
          <>
            <div className="mb-3">
              <label className="font-bold text-sm mb-2 ml-1">Donate to</label>
              <div>
                <select
                  name="charity"
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleInputChange}
                >
                  {charities.contents.map((c: ICharitiesData, i: number) => {
                    return (
                      <option key={i} value={c.id}>
                        {c.title}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </>
        )}
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
          <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
            To Upload
          </h1>

          <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
            {formState['thing'] &&
              formState['thing'].length > 0 &&
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
          <MintButton
            onClick={async () => {
              console.log(formState)
              // TODO: Do validation of the fields before call mint and present error
              if (
                formState.title != null &&
                formState.title.length > 0 &&
                formState.description != null &&
                formState.description.length > 10 &&
                formState.charity != null &&
                formState.thing != null
              ) {
                setLoading(true)
                //@ts-ignore We did a check before
                await mintThing({ ...formState, mintbase })
                setLoading(false)
              } else {
                toast.error('Please fill all fields')
              }
            }}
          />
        </div>
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white flex flex-col items-center justify-center">
            <div>
              <img className="h-80 w-80" src={loader} alt="Loading..." />
            </div>
            <p className="w-1/3 text-center text-black">
              This may take a few seconds, please don't close this page.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default Mint
