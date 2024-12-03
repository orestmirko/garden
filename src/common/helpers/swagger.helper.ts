import { OpenAPIObject } from '@nestjs/swagger';

const pathMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'] as const;

const generalResponses = {
  404: { description: 'Not found' },
  500: { description: 'Server error' },
};

const authResponses = {
  401: { description: 'Not authenticated' },
  403: { description: 'Access denied' },
};

const deleteResponses = {
  204: { description: 'No content' },
};

export class SwaggerHelper {
  static setDefaultResponses(document: OpenAPIObject): void {
    for (const path of Object.keys(document.paths)) {
      for (const method of pathMethods) {
        const route = document.paths[path]?.[method];
        if (route) {
          if (method === 'delete') {
            Object.assign(route.responses, deleteResponses);

            delete route.responses[200];
          }

          Object.assign(route.responses, generalResponses);

          if (route.security) {
            Object.assign(route.responses, authResponses);
          }
        }
      }
    }
  }

  static setExplodeQueryStyle(document: OpenAPIObject): void {
    for (const path of Object.keys(document.paths)) {
      for (const method of pathMethods) {
        const route = document.paths[path]?.[method];
        if (route && route.parameters?.length) {
          this.setExplodeQueryStyleForRoute(route);
        }
      }
    }
  }

  private static setExplodeQueryStyleForRoute(route: OpenAPIObject['paths']['']['get']): void {
    for (const parameter of route.parameters) {
      const isQueryArrayParam =
        'schema' in parameter && 'type' in parameter.schema && parameter.schema.type === 'array';

      if (isQueryArrayParam) {
        parameter.explode = false;
      }
    }
  }
}
