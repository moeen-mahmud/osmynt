export const userCodeBlocks = `// User authentication service
const authenticateUser = async (credentials) => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return await response.json();
};

const validateToken = (token) => {
  // Token validation logic
  return jwt.verify(token, process.env.JWT_SECRET);
};`;

export const bobCodeBlocks = `// User management service
class UserService {
  constructor() {
    this.users = new Map();
  }

  async createUser(userData) {
    // Create user logic
    const user = { id: Date.now(), ...userData };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(userId, updates) {
    // Update user logic
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, updates);
    return user;
  }
}`;

export const demoEditorOptions = {
	readOnly: true,
	minimap: { enabled: false },
	scrollBeyondLastLine: false,
	fontSize: 14,
	lineNumbers: "on" as const,
	wordWrap: "on" as const,
	automaticLayout: true,
	renderWhitespace: "none" as const,
	selectOnLineNumbers: true,
	roundedSelection: false,
	domReadOnly: false,
	contextmenu: true,
	// Aggressive focus prevention
	disableLayerHinting: true,
	disableMonospaceOptimizations: false,
	hideCursorInOverviewRuler: false,
	overviewRulerBorder: false,
	overviewRulerLanes: 0,
	scrollbar: {
		vertical: "auto" as const,
		horizontal: "auto" as const,
		useShadows: false,
		verticalHasArrows: false,
		horizontalHasArrows: false,
	},
	// Prevent editor from losing focus
	links: false,
	detectIndentation: false,
	insertSpaces: true,
	tabSize: 2,
	// Disable features that might cause re-renders
	quickSuggestions: false,
	parameterHints: { enabled: false },
	suggestOnTriggerCharacters: false,
	acceptSuggestionOnEnter: "off" as const,
	wordBasedSuggestions: "off" as const,
	semanticHighlighting: { enabled: false },
};
