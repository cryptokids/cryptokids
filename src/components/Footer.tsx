import React from 'react'

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <p>
        Look at that! A Hello World app! This greeting is stored on the NEAR
        blockchain. Check it out:
      </p>
      <ol>
        <li>
          Look in <code>src/App.js</code> and <code>src/utils.js</code> – you'll
          see <code>get_greeting</code> and <code>set_greeting</code> being
          called on <code>contract</code>. What's this?
        </li>
        <li>
          Ultimately, this <code>contract</code> code is defined in{' '}
          <code>assembly/main.ts</code> – this is the source code for your{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.near.org/docs/roles/developer/contracts/intro"
          >
            smart contract
          </a>
          .
        </li>
        <li>
          When you run <code>yarn dev</code>, the code in{' '}
          <code>assembly/main.ts</code> gets deployed to the NEAR testnet. You
          can see how this happens by looking in <code>package.json</code> at
          the <code>scripts</code> section to find the <code>dev</code> command.
        </li>
      </ol>
      <hr />
      <p>
        To keep learning, check out{' '}
        <a target="_blank" rel="noreferrer" href="https://docs.near.org">
          the NEAR docs
        </a>{' '}
        or look through some{' '}
        <a target="_blank" rel="noreferrer" href="https://examples.near.org">
          example apps
        </a>
        .
      </p>
    </React.Fragment>
  )
}

export default Footer
