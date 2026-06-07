import { StatusBar } from 'expo-status-bar';
import RainScene from './src/scenes/RainScene';

export default function App() {
  return (
    <>
      <StatusBar style="light" hidden />
      <RainScene />
    </>
  );
}
