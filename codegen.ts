import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql',
  documents: ['src/graphql/queries/*.ts*'],
  generates: {
    './src/graphql/__generated__/': {
      preset: 'client',
      config: {},
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
