import AppRouter from "./app/router/AppRouter";
import { AuthProvider } from "./features/auth/AuthContext";
import { NotificationProvider } from "./app/notification/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;