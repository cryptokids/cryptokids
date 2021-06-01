import { atom } from 'recoil'
import forgottenLogo from 'url:../assets/charities/forgottenAnimals.png'
import saveTheChildren from 'url:../assets/charities/Save-The-Children-logo.png'
import virungaLogo from 'url:../assets/charities/virunga.png'


export type ICharitiesData = {
    title: string,
    logo: any, 
    url: string,
    description: string
  }

export const charitiesState = atom<ICharitiesData[]>({
  key: 'charities',
  default: [
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
  ],
})