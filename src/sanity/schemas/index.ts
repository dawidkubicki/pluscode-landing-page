import { localeString, localeText, localeBlockContent } from './localeString'
import { caseStudy } from './caseStudy'
import { insight } from './insight'
import { announcement } from './announcement'

export const schemaTypes = [
  // Locale types
  localeString,
  localeText,
  localeBlockContent,
  // Document types
  caseStudy,
  insight,
  announcement,
]
