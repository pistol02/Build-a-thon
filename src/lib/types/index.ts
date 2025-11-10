export interface Worker {
    id: string
    name: string
    profession: string
    yearsOfExperience: number
  }
  
  export interface Team {
    id: string
    name: string
    members: Worker[]
  }
  
  export interface Project {
    id: string
    title: string
    description: string
    budget: number
    requiredProfessions: string[]
    location: string
    deadline: string
  }
  
  export interface Bid {
    id: string
    teamId: string
    projectId: string
    amount: number
    proposedTimeline: string
    additionalNotes: string
  }
  
  