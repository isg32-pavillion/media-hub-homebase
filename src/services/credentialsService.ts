
interface Credentials {
  users: Array<{
    username: string;
    password: string;
    role: 'admin' | 'user';
  }>;
}

const DEFAULT_CREDENTIALS: Credentials = {
  users: [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' }
  ]
};

class CredentialsService {
  private static instance: CredentialsService;
  private credentials: Credentials;

  constructor() {
    this.loadCredentials();
  }

  static getInstance(): CredentialsService {
    if (!CredentialsService.instance) {
      CredentialsService.instance = new CredentialsService();
    }
    return CredentialsService.instance;
  }

  private loadCredentials(): void {
    const stored = localStorage.getItem('system_credentials');
    if (stored) {
      try {
        this.credentials = JSON.parse(stored);
      } catch {
        this.credentials = DEFAULT_CREDENTIALS;
        this.saveCredentials();
      }
    } else {
      this.credentials = DEFAULT_CREDENTIALS;
      this.saveCredentials();
    }
  }

  private saveCredentials(): void {
    localStorage.setItem('system_credentials', JSON.stringify(this.credentials));
  }

  authenticate(username: string, password: string): { success: boolean; role?: 'admin' | 'user' } {
    const user = this.credentials.users.find(u => u.username === username && u.password === password);
    if (user) {
      return { success: true, role: user.role };
    }
    return { success: false };
  }

  updateCredentials(username: string, newPassword: string, role: 'admin' | 'user'): boolean {
    const userIndex = this.credentials.users.findIndex(u => u.username === username);
    if (userIndex >= 0) {
      this.credentials.users[userIndex].password = newPassword;
      this.credentials.users[userIndex].role = role;
    } else {
      this.credentials.users.push({ username, password: newPassword, role });
    }
    this.saveCredentials();
    return true;
  }

  removeUser(username: string): boolean {
    const initialLength = this.credentials.users.length;
    this.credentials.users = this.credentials.users.filter(u => u.username !== username);
    if (this.credentials.users.length !== initialLength) {
      this.saveCredentials();
      return true;
    }
    return false;
  }

  getAllUsers(): Array<{ username: string; role: 'admin' | 'user' }> {
    return this.credentials.users.map(({ username, role }) => ({ username, role }));
  }
}

export const credentialsService = CredentialsService.getInstance();
