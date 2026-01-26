import { useEffect } from 'react';
import { App } from 'antd';
import { setAntApp } from '../getAntApp';


export default function SetupAntApp() {
  const antApp = App.useApp();
  useEffect(() => {
    setAntApp(antApp);
  }, []);
  return null;
}