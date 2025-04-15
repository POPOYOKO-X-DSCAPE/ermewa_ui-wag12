import type { Store } from '../../core/types';

import type { ApiConfiguration, ApiMethods, HttpMethod } from '../types';

function replaceParamsInString<T extends Record<string, string | number>>(
  input: string,
  params: T
): string {
  //@ts-ignore
  const replacedString = input.replace(/:[^/&$]+/g, (match) => {
    const paramName = match.slice(1);
    if (params.hasOwnProperty(paramName)) {
      const paramValue = params[paramName];

      if (typeof paramValue === 'string' || typeof paramValue === 'number') {
        return paramValue.toString();
      } else {
        console.error(`Invalid parameter type for ${paramName}. Must be convertible to string.`);
      }
    } else {
      console.error(`Missing parameter: ${paramName}`);
    }
  });

  const missingParams = Array.from(new Set(input.match(/:[^/&$]+/g) || []))
    .map((paramName) => paramName.slice(1))
    .filter((paramName) => !params.hasOwnProperty(paramName));

  if (missingParams.length > 0) {
    console.error(`Missing parameters: ${missingParams.map(param => `:${param}`).join(', ')}`);
  }

  return replacedString;
}

const createServicesBuilder = <T extends Record<string, unknown>>(
  environment: Store<T>
) => {

  function createServices <A extends Record<string, ApiConfiguration<T>>>(apis: A, _baseConfig: RequestInit | ((environment: T) => RequestInit) = {}) {
    const services = Object.entries(apis).reduce((acc, [apiName, api]) => {
      const methods = new Set(
        Object.values(apis[apiName].endpoints).map(endpoint => endpoint.methods).flat(2)      
      ) as Set<HttpMethod>;
      
      return {
        ...acc,
        [apiName]: Array.from(methods).reduce((acc2, method) => ({
          ...acc2,
          [method.toLowerCase()]: Object.entries(apis[apiName].endpoints).filter(([,endpoint]) => endpoint.methods.includes(method)).reduce((acc3, [endpointName]) => {
            const { baseUrl, endpoints, config: _serviceConfig } = api;
            const _localConfig = endpoints[endpointName].config;            
  
            const a = baseUrl[baseUrl.length - 1];
            const b = endpoints[endpointName].path[0];
            const separator =  [a, b].includes('/') ? '' : '/';
            const url = `${baseUrl}${separator}${endpoints[endpointName].path}`
  
            return {
              ...acc3,
              [endpointName]: async (options?: { body?: BodyInit, params?: Record<string, string | number> }) => {    
                const urlWithParams = options?.params ? replaceParamsInString(url, options.params) : url;

                const serviceConfig = typeof _serviceConfig === 'function' ? _serviceConfig(environment.state) : _serviceConfig || {};
                const localConfig = typeof _localConfig === 'function' ? _localConfig(environment.state) : _localConfig  || {};
                const baseConfig = typeof _baseConfig === 'function' ? _baseConfig(environment.state) : _baseConfig  || {};
                
                const finalConfig = { ...baseConfig, ...serviceConfig, ...localConfig, method };
    
            
                try {
                  const response = await fetch(urlWithParams, { ...finalConfig, body: options?.body });
                  const json = await response.json();
                  return { data: json, setEnv: environment.patch }
                } catch (error: unknown) {
                  return error;
                }
              }
            }
          }, {})
        }), {})
      }
    }, {} as {
      [K in keyof A]: ApiMethods<T, A[K]>
    });
    
    return services;
  }

  return createServices;
}

export default createServicesBuilder;