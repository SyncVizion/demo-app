import { GridQueryParams, GridSort } from './grid.model';

/**
 * Builder utility class for easily composing grid query parameter
 * maps that are then used to send a request to the server.
 *
 * # Example
 * const params = new GridParamBuilder().withSort(columns).withPage(pager).build();
 */
export class GridParamBuilder {
  params: GridQueryParams = new Map<string, string[]>();

  /**
   * Returns the query parameter map.
   */
  build(): GridQueryParams {
    return this.params;
  }

  /**
   * Adds filters to the query params object.
   *
   * @param filters the filters to be added to the query params object.
   * @returns  The current Grid param builder instance.
   */
  withFilters(filters: Map<string, string[]>): this {
    if (!filters?.size || filters?.size === 0) {
      return this;
    }

    filters.forEach((value, key) => {
      if (value?.length > 0) {
        this.params.set(key, value);
      } else {
        this.params.delete(key);
      }
    });
    return this;
  }

  /**
   * Adds sort to the query params object.
   *
   * @param sort The sort object to be added to the query params object.
   */
  withSort(sort: GridSort): this {
    if (!sort?.active) {
      return this;
    }

    if (sort.direction) {
      this.params.set('sort', [`${sort.field},${sort.direction}`]);
    } else {
      this.params.delete('sort');
    }

    return this;
  }
}
