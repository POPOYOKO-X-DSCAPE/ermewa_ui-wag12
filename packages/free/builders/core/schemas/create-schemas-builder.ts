import type { TypeDefinitions, SchemaBuilderResult } from '../types';

import createRepositoriesBuilder from '../../domain/repositories/create-repositories-builder';
import createUnitsBuilder from '../units/create-units-builder';

const createSchemasBuilder = <T extends Record<string, unknown>>(
  typeDefinitions: TypeDefinitions<T>
) => <U extends Record<string, Record<string, keyof T /* extends string ? keyof T | `${keyof T}?` : never */>>>(
  schemasDefinitions: U
) => {

  const schemas = {} as SchemaBuilderResult<T, U>;

  for (const [key, schemaDefinition] of Object.entries(schemasDefinitions)) {
    const schemaSlice = {};

    for (const [property, typeName] of Object.entries(schemaDefinition)) {
      (schemaSlice as Record<string, unknown>)[property] = typeDefinitions[typeName];
    }

    (schemas as Record<string, unknown>)[key] = schemaSlice;
  }

  return { 
    schemas,
    createUnits: createUnitsBuilder(schemas),
    createRepositories: createRepositoriesBuilder(schemas)
  };
}

export default createSchemasBuilder;
