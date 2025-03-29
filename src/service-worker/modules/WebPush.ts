import { ButtonActionEvent, NotificationMessage } from '../../common/service/notification/PushNotificationService.ts'

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface ExtendedNotificationOptions extends NotificationOptions {
  actions?: NotificationAction[];
}

export function setup(sw: ServiceWorkerGlobalScope): void {

  sw.addEventListener('push', (event: PushEvent) => {
    event.waitUntil(
      sw.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clients => {
        const hasVisibleClients = clients.some(client => client.visibilityState === 'visible')

        if (Notification.permission != 'granted') {
          return
        }

        let pushData: NotificationMessage

        try {
          pushData = NotificationMessage.valueOfJson(event.data?.json())
        } catch (e: unknown) {
          console.log(e)

          pushData = new NotificationMessage('', event.data?.text() ?? '')
        }

        if (hasVisibleClients) {
          clients.forEach(client => {
            client.postMessage({
              type: 'PUSH_RECEIVED',
              data: pushData
            })
          })

          if (!pushData.forceShow) {
            return
          }
        }

        try {
          const title = pushData.title
          const options: ExtendedNotificationOptions = {
            body: pushData.body,
            icon: pushData.icon,
            actions: pushData.actions,
            data: pushData.data,
            silent: pushData.silent,
          }

          event.waitUntil(sw.registration.showNotification(title, options))
        } catch (e) {
          console.debug(e)
        }
      })
    )
  })

  sw.addEventListener('notificationclick', (event: NotificationEvent) => {
    const notification = event.notification
    notification.close()

    const action = event.action
    const notificationData = notification.data

    event.waitUntil(
      sw.clients
        .matchAll({type: 'window', includeUncontrolled: true})
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'NOTIFICATION_ACTION',
              data: new ButtonActionEvent(action, notificationData)
            })
          })

          if (clients.length === 0) {
            const url = `/${notificationData?.data?.deepLink ? notificationData.data.deepLink : ''}`

            return sw.clients.openWindow(url)
          }
        })
    )
  })
}
