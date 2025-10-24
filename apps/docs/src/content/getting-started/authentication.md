# Authentication

Osmynt uses GitHub for authentication to ensure secure, verified access to your teams and code sharing features.

## Sign In with GitHub

### First Time Setup

1. **Open Osmynt Panel**
   - Click the Osmynt icon in the Activity Bar (left sidebar)
   - Or open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run `Osmynt: Login`

2. **Authenticate with GitHub**
   - Click **"Get Started"** or run `Osmynt: Login`
   - VS Code will open a browser window to GitHub
   - Sign in to your GitHub account if not already signed in
   - Authorize Osmynt to access your GitHub profile

3. **Verify Authentication**
   - Return to VS Code
   - You should see your GitHub username in the Osmynt panel
   - The panel will show "Logged in as [your-username]"

### What We Access

Osmynt requests minimal permissions from GitHub:

- **Read user profile**: To identify you in teams
- **Read user email**: For team invitations and notifications
- **No repository access**: We don't access your code repositories
- **No write permissions**: We can't modify your GitHub account

## Authentication States

### Logged In ✅

- Green indicator in Osmynt panel
- Full access to all features
- Can share and receive code
- Can manage teams and devices

### Logged Out ❌

- Red indicator in Osmynt panel
- Limited to viewing shared code (if any)
- Cannot share new code
- Cannot manage teams

## Managing Your Account

### View Account Info

- Your GitHub username is displayed in the Osmynt panel
- Click on your username to see account details

### Switch Accounts

1. Run `Osmynt: Logout` to sign out
2. Run `Osmynt: Login` to sign in with a different GitHub account

### Logout

- **Command Palette**: `Osmynt: Logout`
- **Panel**: Click the logout button in the Osmynt panel

## Troubleshooting Authentication

### "Authentication Failed" Error

**Common causes:**

- Network connectivity issues
- GitHub service temporarily unavailable
- Browser popup blocked

**Solutions:**

1. **Check internet connection**
2. **Allow popups** for VS Code in your browser
3. **Try again** - GitHub services are usually restored quickly
4. **Restart VS Code** and try again

### "Permission Denied" Error

**Common causes:**

- GitHub account restrictions
- Organization policies blocking third-party apps
- Two-factor authentication issues

**Solutions:**

1. **Check GitHub settings**: Go to GitHub → Settings → Applications
2. **Check organization policies**: Contact your GitHub organization admin
3. **Use personal account**: Try with a personal GitHub account first

### "Session Expired" Error

**Common causes:**

- GitHub token expired
- Long period of inactivity
- GitHub security policy changes

**Solutions:**

1. **Re-authenticate**: Run `Osmynt: Login` again
2. **Check GitHub security**: Review your GitHub security settings
3. **Clear cache**: Run `Osmynt: Clear Local Cache` if issues persist

### Browser Issues

**If browser doesn't open:**

1. **Check default browser**: Ensure you have a default browser set
2. **Manual authentication**: Copy the authentication URL from VS Code output
3. **Alternative browser**: Try a different browser

**If browser opens but authentication fails:**

1. **Clear browser cache**: Clear cookies and cache for GitHub
2. **Disable ad blockers**: Temporarily disable ad blockers
3. **Check browser security**: Ensure JavaScript is enabled

## Security Considerations

### Token Security

- Osmynt uses GitHub's OAuth flow
- Tokens are stored securely in VS Code's credential store
- Tokens are automatically refreshed when needed
- No tokens are stored in plain text

### Account Security

- Use strong GitHub passwords
- Enable two-factor authentication on GitHub
- Regularly review GitHub application permissions
- Log out from shared computers

### Data Privacy

- We only access your GitHub profile information
- We don't access your repositories or private code
- All shared code is encrypted end-to-end
- We don't store your GitHub credentials

## Multiple GitHub Accounts

### Switching Between Accounts

1. **Logout**: Run `Osmynt: Logout`
2. **Login**: Run `Osmynt: Login` with the desired account
3. **Verify**: Check the username in the Osmynt panel

### Team Access

- You can only access teams where your current GitHub account is a member
- Switching accounts will show different teams
- You may need to rejoin teams with different accounts

## Enterprise GitHub

### GitHub Enterprise Server

Osmynt currently supports GitHub.com only. GitHub Enterprise Server support is planned for future releases.

### Organization Policies

If your organization has strict policies:

1. **Contact your admin**: Request permission for Osmynt
2. **Use personal account**: Try with a personal GitHub account
3. **Check policies**: Review your organization's application policies

## Need Help?

If you're having authentication issues:

- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
- **GitHub Issues**: [Report authentication issues](https://github.com/moeen-mahmud/osmynt/issues)
<!-- - **Discord**: [Get help from the community](https://discord.gg/osmynt) -->

## Next Steps

Once authenticated, you're ready to:

1. **[Join or create a team](getting-started/teams)** - Start collaborating
2. **[Share your first code](getting-started/first-share)** - Learn the basics
3. **[Set up multiple devices](features/device-management)** - Access from anywhere
