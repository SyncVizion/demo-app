import { FactoryProvider, Injectable, Injector, Type, ValueProvider } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  defaultRouteDataResolverOptions,
  RouteDataResolverOptions,
  RouteDataResolverToken,
} from 'src/app/shared/models/route-data.model';

/**
 * Loads data for a route before the page loads.
 *
 * @author Sam Butler
 * @since Feb 28, 2025
 */
@Injectable()
export class RouteDataResolver {
  static readonly resolvers = [];

  /**
   * Gets a resolver for a service. It defines a class in a closure so the class can be bound
   * to the service type and parameters.
   *
   * @param serviceToken The token for the service used for the lookup.
   * @param options The set of options used to customize the method call.
   */
  static for(
    serviceToken: Type<any>,
    options: RouteDataResolverOptions = defaultRouteDataResolverOptions,
  ): ValueProvider {
    const resolverToken: RouteDataResolverToken<typeof serviceToken> = {
      service: serviceToken,
      options: { ...defaultRouteDataResolverOptions, ...options },
    };

    const resolverService: ValueProvider = {
      provide: resolverToken,
      useValue: resolverToken,
    };

    RouteDataResolver.resolvers.push(resolverService, this.buildFactory(resolverService, resolverToken));

    return resolverService;
  }

  /**
   * Builds a factory provider for the resolver. This is used to get the data from the service.
   *
   * @param service The service to get the data from
   * @param token The token for the service
   * @returns The factory provider for the resolver
   */
  private static buildFactory(service: ValueProvider, token: RouteDataResolverToken<any>): FactoryProvider {
    return {
      provide: service,
      deps: [Injector, token],
      useFactory: (injector: Injector, serviceResolver: RouteDataResolverToken<any>) => {
        return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
          // Get all of the parameters from the route that are specified in the options
          const routeParams = serviceResolver.options.routeParams
            .map((param) => route.paramMap.get(param))
            .filter((param) => !!param);

          // Only execute method if the parameters specified in the options are in the route
          const isArgCountCorrect = serviceResolver.options.routeParams.length === routeParams.length;

          if (isArgCountCorrect) {
            const service = injector.get(serviceResolver.service);
            const method = service[serviceResolver.options.method];

            if (serviceResolver.options.args) {
              return method.apply(service, routeParams.concat(serviceResolver.options.args));
            } else {
              return method.apply(service, routeParams);
            }
          }

          return of(serviceResolver.options.defaultResponse);
        };
      },
    };
  }
}
