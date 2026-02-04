'use client'

import { defineConfig } from 'sanity'
import { structureTool, type StructureBuilder } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'pluscode-studio',
  title: 'Pluscode Content Studio',
  
  projectId,
  dataset,
  
  basePath: '/admin',
  
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Announcements')
              .schemaType('announcement')
              .child(
                S.documentList()
                  .title('Announcements')
                  .filter('_type == "announcement"')
              ),
            S.divider(),
            S.listItem()
              .title('Case Studies')
              .schemaType('caseStudy')
              .child(
                S.documentList()
                  .title('Case Studies')
                  .filter('_type == "caseStudy"')
              ),
            S.listItem()
              .title('Insights')
              .schemaType('insight')
              .child(
                S.documentList()
                  .title('Insights')
                  .filter('_type == "insight"')
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  
  schema: {
    types: schemaTypes,
  },
})
