import React from 'react'

type FormProps = {
  greeting: string
  onSave: (greeting: string) => Promise<boolean>
}

const GreetingForm: React.FC<FormProps> = ({ greeting, onSave }) => {
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  return (
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
        <label
          htmlFor="greeting"
          style={{
            display: 'block',
            color: 'var(--gray)',
            marginBottom: '0.5em',
          }}
        >
          Change greeting
        </label>
        <div style={{ display: 'flex' }}>
          <input
            autoComplete="off"
            defaultValue={greeting}
            id="greeting"
            // TODO use state for value
            onChange={(e) => setButtonDisabled(e.target.value === greeting)}
            style={{ flex: 1 }}
          />
          <button
            disabled={buttonDisabled}
            style={{ borderRadius: '0 5px 5px 0' }}
          >
            Save
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default GreetingForm
