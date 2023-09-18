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

  createTeamsMeeting(event) {
    /*
    { 
    subject, 
    body: { contentType, content }, 
    start: { dateTime: Date, timeZone }, 
    end: { dateTime: Date, timeZone }, 
    location: { displayName }, 
    attendees: { emailAddress: { address, name:any }, type }[], 
    isOnlineMeeting: Boolean, 
    onlineMeetingProvider }
    */
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
      this.graphClient = Client.initWithMiddleware({ authProvider: authProvider });
      return this.graphClient
        .api('/me').get().then(user => {
          return this.graphClient.api(`/users/${user.id}/calendar/events`)
            .post(event)
        })
    }
    /*pca.acquireTokenPopup({
      scopes: ['User.Read'],
    }).then(authResult => {
      if (!authResult.account) {
        throw new Error('Could not authenticate');
      }
    });*/
  }
}