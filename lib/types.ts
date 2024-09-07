export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const exampleQuestions = [
  'Wat zijn de belangrijkste taken van een zelfstandig werkend kok?',
  'Welke vaardigheden heeft een restaurantmanager nodig?',
  'Wat is het verschil tussen een barista en een bartender?',
  'Hoe ziet de carrièreladder in de horeca eruit?',
]
