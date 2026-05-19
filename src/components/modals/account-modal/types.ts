export type ResponseMode = 'default' | 'reflective' | 'action' | 'learning' | 'support'
export type StyleLevel = 'default' | 'concise' | 'detailed' | 'casual' | 'formal'
export type TraitLevel = 'less' | 'default' | 'more'

export interface ProfileSettings {
  responseMode: ResponseMode
  basicStyle: StyleLevel
  welcoming: TraitLevel
  enthusiastic: TraitLevel
  formatting: TraitLevel
  emojis: TraitLevel
  instantResponses: boolean
  customInstructions: string
}

export const DEFAULT_PROFILE: ProfileSettings = {
  responseMode: 'default',
  basicStyle: 'default',
  welcoming: 'default',
  enthusiastic: 'default',
  formatting: 'default',
  emojis: 'default',
  instantResponses: false,
  customInstructions: '',
}
