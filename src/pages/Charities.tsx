import React from 'react'
import CharityCard from '../components/CharityCard'

import saveTheChildren from 'url:../assets/charities/Save-The-Children-logo.png'
import virungaLogo from 'url:../assets/charities/virunga.png'
import forgottenLogo from 'url:../assets/charities/forgottenAnimals.png'

const charities: any[] = [
  {
    title: 'Save The Children',
    logo: saveTheChildren,
    url: 'https://www.savethechildren.org/',
    description:
      'We’re passionately committed to one goal: Giving all children the best chance for the future they deserve – a healthy start in life, the opportunity to learn and protection from harm. Every day and in times of crisis. Here in the U.S. and around the world. Whatever it takes. In fact, we’ve been the world’s leading charity for children for nearly 100 years.',
  },
  {
    title: 'Virunga National Park',
    logo: virungaLogo,
    url: 'https://virunga.org/',
    description:
      'Virunga National Park, Africa’s most biodiverse protected area, exists to protect 1/3 of the world’s endangered mountain gorillas, over one thousand species of mammal, bird, reptile, and amphibian, and provide a brighter future to more than four million people affected by conflict.',
  },
  {
    title: 'Forgotten Animals',
    logo: forgottenLogo,
    url: 'https://forgottenanimals.org/',
    description:
      'Forgotten Animals is the closest to being an ASPCA for Russia as it gets. Neglecting and abusing dogs, cats and wild animals, and treating them as commodities, is still a widely common cultural norm in former Soviet countries. There are hundreds of traveling dolphinaria, animal circuses, petting zoos and no wildlife sanctuary to rescue those animals to.',
  },
]

const Charities: React.FC = () => {
  return (
    // grid place-items-center min-h-screen bg-gradient-to-t from-blue-200 to-indigo-900 p-5
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4 p-5">
      {charities.map((charity) => {
        return (
          <CharityCard
            key={charity.title}
            title={charity.title}
            description={charity.description}
            logo={charity.logo}
            url={charity.url}
          />
        )
      })}
    </div>
  )
}

export default Charities
