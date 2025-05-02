import { AuthProvider } from './src/AuthContext';
import Tabs from './src/Tabs';

export default function App() {
  return (
    <AuthProvider>
    <Tabs />
    </AuthProvider>
  );
}

