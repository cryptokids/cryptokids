import React, { useContext, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { charitiesState, ICharitiesData } from '../state/charities'
import { mintItem } from '../state/near'

import loader from 'url:../assets/loader.gif'
import { MintbaseContext } from '../contexts/mintbase'
import { FileField } from '../components/FileUploadField'
import { FormField } from '../components/FormField'

const Mint: React.FC = () => {
  return (
    <div className="w-full p-5 grid grid-flow-col-dense grid-cols-2 sm:grid-cols-2">
      <div>
        <h2 className="text-2xl">What does it mean to mint?</h2>

        <span className="text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </span>
      </div>
      <MintFormLoader />
    </div>
  )
}

type IFormField<T> = {
  value: null | T
  errors: string[]
}

type IFormState = {
  title: IFormField<string>
  description: IFormField<string>
  charity: IFormField<string> & {
    charities: ICharitiesData[]
  }
  file: IFormField<any>
}

type IErrorsState = {
  title: Array<string>
  description: Array<string>
  charity: Array<string>
  file: Array<string>
}

const MintFormLoader: React.FC = () => {
  const {
    network: { mintbase },
  } = useContext(MintbaseContext)

  const charities = useRecoilValueLoadable(charitiesState)
  const [isLoading, setLoading] = useState(false)

  const mintForm = async (formState: IFormState) => {
    let form = formState
    let formErrors: IErrorsState = {
      title: Array<string>(),
      description: Array<string>(),
      charity: Array<string>(),
      file: Array<string>(),
    }
    if (form.title.value == null || form.title.value.length === 0) {
      formErrors.title.push('Title should be not empty')
    }
    if (form.description.value == null || form.description.value.length < 10) {
      formErrors.description.push('Description should be more then 10 chars')
    }
    if (form.charity === null) {
      formErrors.charity.push('Choose a charity before mint')
    }
    if (form.file === null) {
      formErrors.file.push('Choose an image before mint')
    }

    const someErrors = Object.keys(formErrors).some(
      (k) => formErrors[k as keyof IFormState].length > 0
    )
    if (someErrors) {
      // There are some errors, do not mint
      return formErrors
    }

    setLoading(true)
    await mintItem({
      mintbase,
      title: form.title.value!,
      description: form.description.value!,
      charity: form.charity.value!,
      file: form.file.value[0],
    })
    setLoading(false)
    return null
  }

  return (
    <>
      {!isLoading && charities.state === 'hasValue' && charities.contents && (
        <MintForm charities={charities.contents} onSubmit={mintForm} />
      )}
      {!isLoading && charities.state === 'loading' && (
        <div className="flex items-center w-full flex-col">
          <img className="h-80 w-80" src={loader} alt="Loading..." />
        </div>
      )}
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
    </>
  )
}

const MintForm: React.FC<{
  charities: ICharitiesData[]
  onSubmit: (form: IFormState) => Promise<IErrorsState | null>
}> = ({ charities, onSubmit }) => {
  // Form state, store values and errors inside
  const [formState, setFormState] = useState<IFormState>({
    title: {
      value: null,
      errors: [],
    },
    description: {
      value: null,
      errors: [],
    },
    charity: {
      // Set default charity, not optimal way to do it
      value: charities[0].id,
      errors: [],
      charities,
    },
    file: {
      value: null,
      errors: [],
    },
  })

  // Form change feedback
  const handleInputChange = (event: React.ChangeEvent) => {
    const target: HTMLInputElement = event.target as HTMLInputElement
    const name: string = target.name
    if (name in formState) {
      let field = formState[name as keyof IFormState]
      let value: any
      switch (target.type) {
        case 'file':
          if (target.files) {
            value = [target.files[0]]
          }
          break

        default:
          value = target.value
          break
      }
      // Update form
      field.value = value
      setFormState({ ...formState, [name]: field })
    }
  }

  return (
    <form className="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700">
      <FormField title="Title" errors={formState.title.errors}>
        <input
          name="title"
          className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
          type="text"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField title="Description" errors={formState.description.errors}>
        <input
          name="description"
          className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
          type="text"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField title="Donate to" errors={formState.charity.errors}>
        <select
          name="charity"
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleInputChange}
        >
          {formState.charity.charities.map((c, i) => {
            return (
              <option key={i} value={c.id}>
                {c.title}
              </option>
            )
          })}
        </select>
      </FormField>
      <FormField title="Picture">
        <FileField
          file={formState.file.value}
          name="file"
          onChange={handleInputChange}
        />
      </FormField>
      <div className="mb-3">
        <a
          href="#"
          className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
          onClick={async () => {
            const errors = await onSubmit({ ...formState })
            if (errors !== null) {
              let form = { ...formState }
              Object.keys(errors).map((k) => {
                const fieldErrors = errors[k as keyof IErrorsState]
                form[k as keyof IFormState].errors = fieldErrors
              })
              setFormState(form)
            }
          }}
        >
          Mint
        </a>
      </div>
    </form>
  )
}

export default Mint
