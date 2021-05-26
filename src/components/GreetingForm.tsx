import React from 'react'

type FormProps = {
  greeting: string
  onSave: (greeting: string) => Promise<boolean>
}

const GreetingForm: React.FC<FormProps> = ({ greeting, onSave }) => {
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  return (
    <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Greeting</h3>
              <p className="mt-1 text-sm text-gray-600">
                You can change the greeting here.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form
              onSubmit={async (event) => {
                event.preventDefault()

                // get elements from the form using their id attribute
                const { fieldset, greeting } = event.target.elements

                // hold onto new user-entered value from React's SynthenticEvent for use after `await` call
                const newGreeting = greeting.value

                // disable the form while the value gets updated on-chain
                fieldset.disabled = true

                try {
                  // make an update call to the smart contract
                  await onSave(newGreeting)
                } catch (e) {
                  alert(
                    'Something went wrong! ' +
                    'Maybe you need to sign out and back in? ' +
                    'Check your browser console for more info.'
                  )
                  throw e
                } finally {
                  // re-enable the form, whether the call succeeded or failed
                  fieldset.disabled = false
                }
              }}
            >
              <fieldset id="fieldset">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">

                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="greeting" className="block text-sm font-medium text-gray-700">Change greeting</label>
                        <input
                          type="text"
                          name="greeting"
                          id="greeting"
                          autoComplete="off"
                          defaultValue={greeting}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          onChange={(e) => setButtonDisabled(e.target.value === greeting)}
                        />
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={buttonDisabled}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default GreetingForm
