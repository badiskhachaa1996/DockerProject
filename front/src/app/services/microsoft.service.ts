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
    this.graphClient = Client.initWithMiddleware({ authProvider: authProvider });
    return this.graphClient
      .api('/me/directReports').get().then(salaries => {
        return salaries
      })
  }
  sendNotif() {
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
      scopes: ['TeamsActivity.Send'],
    });

    this.graphClient = Client.initWithMiddleware({ authProvider: authProvider });

    const sendActivityNotification = {
      topic: {
        source: 'text',
        value: 'Deployment Approvals Channel',
        webUrl: 'https://teams.microsoft.com/l/message/19:448cfd2ac2a7490a9084a9ed14cttr78c@thread.skype/1605223780000?tenantId=c8b1bf45-3834-4ecf-971a-b4c755ee677d&groupId=d4c2a937-f097-435a-bc91-5c1683ca7245&parentMessageId=1605223771864&teamName=Approvals&channelName=Azure%20DevOps&createdTime=1605223780000'
      },
      activityType: 'deploymentApprovalRequired',
      previewText: {
        content: 'TEST'
      },
      templateParameters: [
        {
          name: 'deploymentId',
          value: '6788662'
        }
      ]
    };
    return this.graphClient
      .api('/me').get().then(user => {
        console.log(user)
        return this.graphClient.api(`/users/m.hue@intedgroup.com/teamwork/sendActivityNotification`)
          .post(sendActivityNotification);
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
