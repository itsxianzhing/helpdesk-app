import { HubConnectionBuilder, HubConnectionState, type HubConnection } from '@microsoft/signalr';

import { getStoredAuth } from '../../auth/authStorage';
import type { NotificationResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const HUB_URL = API_URL.replace(/\/api\/?$/, '') + '/hubs/notifications';

let connection: HubConnection | null = null;

export async function startNotificationHub(
  onNotificationCreated: (notification: NotificationResponse) => void,
  onReconnected?: () => void | Promise<void>,
): Promise<void> {
  if (
    connection?.state === HubConnectionState.Connected ||
    connection?.state === HubConnectionState.Connecting ||
    connection?.state === HubConnectionState.Reconnecting
  ) {
    return;
  }

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => {
        return getStoredAuth()?.token ?? '';
      },
    })
    .withAutomaticReconnect()
    .build();

  connection.on('NotificationCreated', onNotificationCreated);

  connection.onreconnected(async () => {
    await onReconnected?.();
  });

  await connection.start();
}

export async function stopNotificationHub(): Promise<void> {
  if (!connection) {
    return;
  }

  connection.off('NotificationCreated');

  await connection.stop();

  connection = null;
}
