import type { Repository } from '../types';

type UseCaseContract = Record<string, (...args: unknown[]) => unknown>;

// biome-ignore lint/suspicious/noExplicitAny: repository constraint needs any to stay covariant across entity shapes
const createAbstractUseCaseBuilder = <R extends Record<string, Repository<any>>>(
  repositories: R
) => {
  function createUseCaseBuilder<S>(
    services: S
  ) {
    type Dependencies = { repositories: R, services: S };

    function createUseCase <T extends UseCaseContract>(callback: (dependencies: Dependencies) => T) {

      return callback({ repositories, services });
    }

    return { createUseCase };
  }

  return createUseCaseBuilder;
}

export default createAbstractUseCaseBuilder;
