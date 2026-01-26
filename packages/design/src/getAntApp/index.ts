import { App, Modal, message } from 'antd';

type TAntApp = ReturnType<typeof App.useApp>;

let AntApp = {} as TAntApp;

export function setAntApp(antApp: TAntApp) {
  AntApp = antApp;
}

export function clearAntApp() {
  AntApp = {} as TAntApp;
}

export default function getAntApp() {
  return AntApp;
}

export function getAntMessage() {
  return getAntApp().message || message;
}

export function getAntModal() {
  return getAntApp().modal || Modal;
}