import { Injectable } from '@angular/core';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { Client, AuthProvider } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftService {

  private graphClient: Client;

  constructor() { }

  getInfo() {
    let PCAmicrosoft = new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: 'https://login.microsoftonline.com/680e0b0b-c23d-4c18-87b7-b9be3abc45c6', // PPE testing environment.
        redirectUri: '/',
        postLogoutRedirectUri: '/login'
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1, // set to true for IE 11
      },
    })
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(PCAmicrosoft, {
      account: PCAmicrosoft.getActiveAccount(),
      interactionType: InteractionType.Redirect,
      scopes: ['User.Read.All', 'Directory.Read.All', 'Group.ReadWrite.All'],
    });
    this.graphClient = Client.initWithMiddleware({ authProvider: authProvider });
    return this.graphClient
      .api('/me').get().then(user => {
        return user
      })
  }

  getSalaries() {
    let PCAmicrosoft = new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: 'https://login.microsoftonline.com/680e0b0b-c23d-4c18-87b7-b9be3abc45c6', // PPE testing environment.
        redirectUri: '/',
        postLogoutRedirectUri: '/login'
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1, // set to true for IE 11
      },
    })
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(PCAmicrosoft, {
      account: PCAmicrosoft.getActiveAccount(),
      interactionType: InteractionType.Redirect,
      scopes: ['User.Read.All', 'Directory.Read.All', 'Group.ReadWrite.All'],
    });
    return this.graphClient
      .api('/me/directReports').get().then(salaries => {
        return salaries
      })
  }

  createTeamsMeeting(event) {
    let pca = new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: 'https://login.microsoftonline.com/680e0b0b-c23d-4c18-87b7-b9be3abc45c6', // PPE testing environment.
        redirectUri: '/',
        postLogoutRedirectUri: '/login'
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1, // set to true for IE 11
      },
    })
    let test = pca.getAccountByLocalId('5de7e78b-49b5-44e7-8d8b-4c812b0cab57')
    // Authenticate to get the user's account
    if (test) {
      // @microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
        account: test,
        interactionType: InteractionType.Redirect,
        scopes: ['User.Read', 'Calendars.ReadWrite', 'Group.ReadWrite.All'],
      });
      console.log(test)
      this.graphClient = Client.initWithMiddleware({ authProvider: authProvider });
      return this.graphClient
        .api('/me').get().then(user => {
          console.log(user)
          return this.graphClient.api(`/users/${user.id}/calendar/events`)
            .post(event)
        })
    }
  }
}
