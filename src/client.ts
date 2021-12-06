import { DOMPurifyI } from "dompurify";
import { JSDOM } from "jsdom";
import LRUCache from "lru-cache";
import request, { CookieJar } from "request";
const createDOMPurify = require('dompurify');
const _eval = require('eval');

export interface Result<T> {
  success: boolean,
  error?: any;
  data?: T,
}

export interface LoginData {
  token?: string;
}

export interface MenuAction {
  htmlName?: string;
  imagePath?: string;
  actionPath?: string;
  parentId?: string;
}

export class PucrsClient {
  private static BASE_URL = 'https://webapp.pucrs.br';
  private httpClient: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;
  private jar: CookieJar;
  private token?: string;
  private cache: LRUCache<string, any>;

  constructor() {
    this.jar = request.jar();
    this.httpClient = request.defaults({
      baseUrl: PucrsClient.BASE_URL,
      jar: this.jar,
    });
    this.cache = new LRUCache<string, any>();
  }

  async login(registry: string, password: string): Promise<Result<LoginData>> {
    let {error, body, response} = await this.apiCall('/appgw/portal/wsauth/', {
      method: 'post',
      json: true,
      form: {
        username: registry,
        password: password,
        acessar: '',
      },
      followAllRedirects: false,
      followRedirect: false,
    });
    
    if (error) return { success: false, error };
    if (body && body.error) return {
      success: false,
      error: body.message === 'No message available' ? 'Login failed, wrong password' : body.message
    };

    if (body && body.includes('Em manutenção')) return {
      success: false,
      error: 'Maintenance'
    };

    let tokenMatcher = response.headers.location?.match(/ValidaAluno\?p=(.*)$/);
    let token = tokenMatcher ? Array.from(tokenMatcher)[1] : null;

    if (!token) return { success: false, error: 'Login failed' };
    this.token = token;
    
    let auth = await this.authenticate();
    if (!auth.success) {
      return { success: false, error: auth.error }; 
    } else {
      return { success: true, data: { token } };
    }
  }

  async loginWithToken(token: string): Promise<Result<LoginData>> {
    this.token = token;
    let auth = await this.authenticate();
    if (!auth.success) {
      return { success: false, error: auth.error }; 
    } else {
      return { success: true, data: { token } };
    }
  }

  private async authenticate(): Promise<Result<void>> {
    let {error, body} = await this.apiCall('/consulta/servlet/consulta.aluno.ValidaAluno?p=' + this.token);
    if (error || !body) return { success: false, error: error || body };

    let jSessionIdCookie = this.jar.getCookies(PucrsClient.BASE_URL + '/consulta').find(x => x.key === 'JSESSIONID');
    if (!jSessionIdCookie) return { success: false, error: 'Authentication failed, expired or invalid token' };

    return { success: true };
  }

  private async menuActions(): Promise<Result<MenuAction[]>> {
    let body:string = this.cache.get('menu-request');
    if (body == null) {
      let {error, body: newBody} = await this.apiCall('/consulta/servlet/consulta.aluno.MenuNovo', {
        encoding: 'binary'
      });
      if (error || !newBody) return { success: false, error: error || newBody };
      body = newBody;
      this.cache.set('menu-request', body, 60000);
    }

    // why?? why the request responds a javascript code?? why???
    // execute the response on a safe environment
    let menu = _eval(body + 'module.exports=menu');
    if (!Array.isArray(menu)) return { success: false, error: 'Menu isnt array' };

    // parse actions
    let menuActions = []
    for (let action of menu) {
      if (!Array.isArray(action)) continue;
      let [_, unsafeHtmlName, unsafeImagePath, unsafeActionPath, unsafeParentId] = action;
      let htmlName, imagePath, actionPath, parentId;
      if (typeof unsafeHtmlName === 'string'    && unsafeHtmlName.trim().length > 0)    htmlName = unsafeHtmlName.trim();
      if (typeof unsafeImagePath === 'string'   && unsafeImagePath.trim().length > 0)   imagePath = unsafeImagePath.trim();
      if (typeof unsafeActionPath === 'string'  && unsafeActionPath.trim().length > 0)  actionPath = unsafeActionPath.trim();
      if (typeof unsafeParentId === 'string'    && unsafeParentId.trim().length > 0)    parentId = unsafeParentId.trim();
      if (!htmlName || !actionPath) continue;
      menuActions.push({htmlName, imagePath, actionPath, parentId});
    }
    return { success: true, data: menuActions };
  }

  async executeMenuAction(actionName: string): Promise<Result<string>> {
    let menuActionsResult = await this.menuActions();
    if (!menuActionsResult.success) return { success: false, error: menuActionsResult.error };

    let menuAction = menuActionsResult.data?.find(x => x.htmlName?.toLowerCase()?.includes(actionName.toLowerCase()));
    if (!menuAction) return { success: false, error: 'Menu action not found' };

    let menuActionPath = menuAction.actionPath;
    if (!menuActionPath) return { success: false, error: 'Menu action hasnt action path' };

    let body:string = this.cache.get('menu-action-' + actionName + '-request');
    if (body == null) {
      let {error, body: newBody} = await this.apiCall(menuActionPath, {
        encoding: 'binary'
      });
      if (error) return { success: false, error };
      if (newBody && newBody.error) return { success: false, error: newBody.error };
      body = newBody;
      this.cache.set('menu-action-' + actionName + '-request', body, 60000);
    }
    
    // Sometimes the returned html is broken!
    const window = new JSDOM('').window;
    const DOMPurify: DOMPurifyI = createDOMPurify(window);
    let sanitizedBody = DOMPurify.sanitize(body, {
      ADD_ATTR: ['onclick'],
    });
    return { success: true, data: sanitizedBody };
  }

  private apiCall(path: string, options?: request.CoreOptions) {
    return new Promise<{ error: any, response: request.Response, body: any }>(resolve => {
      this.httpClient(path, options, (error, response, body) => {
        resolve({ error, response, body });
      });
    })
  }
}
