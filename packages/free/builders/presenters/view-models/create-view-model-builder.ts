import type { Entity, Funnel, Repository, SubscriberFunction } from '../../domain/types';

import createStore from '../../core/stores/create-store';
import type { Store } from '../../core/types';

// biome-ignore lint/suspicious/noExplicitAny: repository constraint needs any to stay covariant across entity shapes
const createViewModelBuilder = <R extends Record<string, Repository<any>>>(
  repositories: R
) => {
  
  type ComputedProperties<T extends Record<string, unknown>> = {
    [K in keyof T]: (dependencies: { [K in keyof R]: R[K]['read'] }) => T[K];
  };

  function createViewModel<T extends Record<string, unknown>>(
    computedProperties: ComputedProperties<T>
  ) {
    const dependencyStores = {} as { [K in keyof ComputedProperties<T>]: Store<{ [Kb in keyof R]: Record<string, ReturnType<R[Kb]['read']>> | undefined }> };

    for (const propertyName of Object.keys(computedProperties)) {
      const repositoryRecord = {} as { [Kb in keyof R]: Record<string, ReturnType<R[Kb]['read']>> | undefined };
      for (const repositoryName of Object.keys(repositories)) {
        (repositoryRecord as Record<string, unknown>)[repositoryName] = undefined;
      }

      (dependencyStores as Record<string, unknown>)[propertyName] = createStore(repositoryRecord);
    }

    const dependencies = (propertyName: string) => {
      const repositoryReads = {} as { [K in keyof R]: R[K]['read'] };

      for (const [repositoryName, repository] of Object.entries(repositories)) {
        (repositoryReads as Record<string, unknown>)[repositoryName] = <Tb extends Record<string, unknown>>(funnel: Funnel<Tb>) => {
          let data: Record<string, ReturnType<R[string]["read"]>> | undefined;
          if (dependencyStores[propertyName].state[repositoryName] !== undefined) {
            data = dependencyStores[propertyName].state[repositoryName];
          } else {
            data = repository.read(funnel) as Record<string, ReturnType<R[string]["read"]>> | undefined;
            
            let currentIds: string[] = Object.keys(<object>data || {});
            const subscriber: SubscriberFunction<Entity<Record<string, unknown>>> = ({ event, diff }) => {              
              const diffIds = Object.keys(diff);

              if (event === 'onDelete') {
                const toDeleteIds = currentIds.filter(id => diffIds.includes(id));
                
                if (!toDeleteIds.length) return;
                
                currentIds = currentIds.filter(id => !toDeleteIds.includes(id));
              } else {
                // apply funnel on diff here (must refactor / mutualize logic)
                const filter = typeof funnel === 'string' ? [funnel] : funnel;
  
                let funneledDiff = Object.values(diff);
          
                if (Array.isArray(filter)) {
                  funneledDiff = funneledDiff.filter(entity => filter.includes(entity.meta.id));
                } else if (typeof filter === "object" && Object.keys(filter).length) {
                  Object.entries(filter).every(([propertyName, property]) => {
                    funneledDiff = funneledDiff.filter(entity => 
                      typeof property === 'function' ?
                        property(entity.state[propertyName])
                      : entity.state[propertyName] === property
                    );
          
                    return funneledDiff.length;
                  });
                }                
                // end of funnel
                
                switch (event) {
                  case 'onCreate': {
                    if (!funneledDiff.length) return;
  
                    const createdIds = funneledDiff.map(entity => entity.meta.id);                  
                    currentIds = [...currentIds, ...createdIds];
                    break;
                  }
                  case 'onUpdate': {
                    const funneledIds = funneledDiff.map(entity => entity.meta.id);
                    const toCreateIds = funneledIds.length ? diffIds.filter(id => !currentIds.includes(id) && funneledIds.includes(id)) : [];
                    const toDeleteIds = currentIds.length  ? diffIds.filter(id => currentIds.includes(id) && !funneledIds.includes(id)) : [];
  
                    if (!toCreateIds.length && !toDeleteIds.length && !funneledIds.length) return;                    
                    
                    const remainingIds = toDeleteIds.length ? currentIds.filter(id => !toDeleteIds.includes(id)) : currentIds;
                    currentIds = [...remainingIds, ...toCreateIds];
                    break;
                  }
                };
              }
              
              const entitySlice = {} as Record<string, unknown>;
              for (const entityId of currentIds) {
                entitySlice[entityId] = repository.state[entityId];
              }

              dependencyStores[propertyName].patch({
                  [repositoryName]: entitySlice
                } as Partial<{ [Kb in keyof R]: Record<string, ReturnType<R[Kb]["read"]>> }>
              );
            }

            repository.subscribe(subscriber);
          }
          
          return data || {};
        };
      }

      return repositoryReads;
    };

    const initialData = {} as { [K in keyof ComputedProperties<T>]: ReturnType<ComputedProperties<T>[K]> };
    for (const propertyName of Object.keys(computedProperties)) {
      (initialData as Record<string, unknown>)[propertyName] = computedProperties[propertyName](dependencies(propertyName));
    }

    const store = createStore(initialData);

    for (const [propertyName, dependencyStore] of Object.entries(dependencyStores)) {
      
      dependencyStore.onChange(() => {                        
        store.patch({
          [propertyName]: computedProperties[propertyName](dependencies(propertyName))
        } as { [K in keyof ComputedProperties<T>]: ReturnType<ComputedProperties<T>[K]>});
      });
    }

    return store;
  };

  return createViewModel;
};

export default createViewModelBuilder;
