export const BetaUserEmailTemplate = (user: { name: string; email: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Osmynt Beta!</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #1A1A1A;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #f5f5f5;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .logo {
        font-size: 2.5em;
        font-weight: bold;
        color: #39FF14;
        margin-bottom: 10px;
      }

      .link {
        color: ##0D0EFF;
        text-decoration: none;
      }

      .link:hover {
        text-decoration: underline;
      }

      h1 {
        color: #1A1A1A;
        font-size: 1.8em;
        margin-bottom: 20px;
      }

      h3 {
        color: #1A1A1A;
        margin-top: 25px;
        margin-bottom: 15px;
      }

      p {
        margin: 15px 0;
        color: #4a4a4a;
      }

      ul {
        margin: 15px 0;
        padding-left: 20px;
      }

      li {
        margin: 8px 0;
        color: #4a4a4a;
      }

      .cta {
        text-align: center;
        margin: 30px 0;
      }

      .btn {
        display: inline-block;
        margin: 20px 0;
        padding: 15px 30px;
        background-color: #39FF14;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }

      .btn:hover {
        background-color: #32E00A;
      }

      .btn-text {
        color: #1A1A1A;
        font-size: 1.1em;
      }

      .highlight {
        background-color: #fafafa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #39FF14;
        margin: 20px 0;
      }

      .footer {
        font-size: 0.9em;
        text-align: center;
        margin-top: 30px;
        color: #666666;
        border-top: 1px solid #e0e0e0;
        padding-top: 20px;
      }

      .social-links {
        margin-top: 15px;
      }

      .social-links a {
        color: #FF1493;
        text-decoration: none;
        margin: 0 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to the Beta Program!</h1>
      </div>
      <p>Hi <strong>${user.name}</strong>, </p>
      <p>🎉 <strong>Congratulations!</strong> You've been accepted into the Osmynt beta program. We're thrilled to have you as one of our early adopters! </p>
      <p>Osmynt is a <strong>Secure, Git-powered, Realtime DM for code blocks</strong> that brings seamless code sharing directly into your VSCode editor. No more context switching, no workflow disruption - just pure developer experience. </p>
      <div class="highlight">
        <h3>🚀 What makes Osmynt special:</h3>
        <ul>
          <li>
            <strong>End-to-End Encryption:</strong> Your code is encrypted before leaving your machine
          </li>
          <li>
            <strong>Real-time Sharing:</strong> Share code blocks instantly with your team
          </li>
          <li>
            <strong>Git-like Diff Application:</strong> Apply shared code changes directly to your files
          </li>
          <li>
            <strong>Team Collaboration:</strong> Secure sharing with verified team members only
          </li>
        </ul>
      </div>
      <h3>📋 Here's what to do next:</h3>
      <ul>
        <li>
          <strong>Install the Extension:</strong> Download from <a class="link" href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">VS Code Marketplace</a> or <a class="link" href="https://open-vsx.org/extension/osmynt/osmynt">Open VSX Registry</a>
        </li>
        <li>
          <strong>Sign In:</strong> Open Command Palette ("Ctrl+Shift+P") and run "Osmynt: Login"
        </li>
        <li>
          <strong>Authenticate:</strong> Sign in with your GitHub account
        </li>
        <li>
          <strong>Start Sharing:</strong> Select code and run "Osmynt: Share Code Block"
        </li>
        <li>
          <strong>Give Feedback:</strong> Your insights are crucial! Email us at <a class="link" href="mailto:support@osmynt.dev">support@osmynt.dev</a>
        </li>
      </ul>
      <p class="cta">
        <a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt" class="btn">
          <span class="btn-text">🚀 Get Started with Osmynt</span>
        </a>
      </p>
      <div class="highlight">
        <p>
          <strong>💡 Beta Perks:</strong> As a beta user, you'll get exclusive early access to new features and the chance to influence our roadmap. Your feedback will directly shape the future of Osmynt!
        </p>
      </div>
      <p>If you have any questions or need help getting started, just reply to this email - we're here to assist!</p>
      <p>Thank you for joining us on this journey. Let's build something amazing together! 🚀</p>
      <p>Best regards, <br>
        <strong>Moeen Mahmud</strong>
        <br>Founder, Osmynt
      </p>
      <div class="footer">
        <p>Follow us for updates and sneak peeks</p>
        <div class="social-links">
          <a href="https://twitter.com/moeen_mahmud">Twitter</a> • <a href="https://github.com/moeen-mahmud/osmynt">GitHub</a> • <a href="mailto:support@osmynt.dev">Support</a>
        </div>
      </div>
    </div>
  </body>
</html>
  `;

export const SignupUserEmailTemplate = (user: { name: string; email: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Osmynt - Secure Code Sharing</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #1A1A1A;
      }

      .container {
        max-width: 500px;
        margin: 20px auto;
        background: #f5f5f5;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .logo {
        font-size: 2.5em;
        font-weight: bold;
        color: #39FF14;
        margin-bottom: 10px;
      }

      .link {
        color: #0D0EFF;
        text-decoration: none;
      }

      .link:hover {
        text-decoration: underline;
      }

      h1 {
        color: #1A1A1A;
        font-size: 1.8em;
        margin-bottom: 20px;
      }

      h3 {
        color: #1A1A1A;
        margin-top: 25px;
        margin-bottom: 15px;
      }

      p {
        margin: 15px 0;
        color: #4a4a4a;
      }

      ul {
        margin: 15px 0;
        padding-left: 20px;
      }

      li {
        margin: 8px 0;
        color: #4a4a4a;
      }

      .cta {
        text-align: center;
        margin: 30px 0;
      }

      .btn {
        display: inline-block;
        margin: 20px 0;
        padding: 15px 30px;
        background-color: #39FF14;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }

      .btn:hover {
        background-color: #32E00A;
      }

      .btn-text {
        color: #1A1A1A;
        font-size: 1.1em;
      }

      .highlight {
        background-color: #fafafa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #39FF14;
        margin: 20px 0;
      }

      .features-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
      }

      .feature-item {
        background-color: #39FF14;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
      }

      .feature-icon {
        font-size: 1.5em;
        margin-bottom: 8px;
      }

      .footer {
        font-size: 0.9em;
        text-align: center;
        margin-top: 30px;
        color: #666666;
        border-top: 1px solid #e0e0e0;
        padding-top: 20px;
      }

      .social-links {
        margin-top: 15px;
      }

      .social-links a {
        color: #FF1493;
        text-decoration: none;
        margin: 0 10px;
      }

      .beta-notice {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to the Future of Code Collaboration!</h1>
      </div>
      <p>Hi <strong>${user.name}</strong>, </p>
      <p>🎉 Thank you for joining Osmynt! We're thrilled to have you as part of our growing community of developers who believe in seamless, secure code collaboration.</p>
      <p>Osmynt is a <strong>Secure, Git-powered, Realtime DM for code blocks</strong> that brings the power of team collaboration directly into your VSCode editor. No more context switching, no workflow disruption - just pure developer experience. </p>
      <div class="highlight">
        <h3>🚀 What you can do with Osmynt:</h3>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div>
              <strong>Secure Sharing</strong>
              <br>End-to-end encrypted code sharing
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div>
              <strong>Real-time</strong>
              <br>Instant code sharing with your team
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🛠️</div>
            <div>
              <strong>Git Integration</strong>
              <br>Apply changes directly to your files
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <div>
              <strong>Team Focus</strong>
              <br>Built for developer teams
            </div>
          </div>
        </div>
      </div>
      <div class="beta-notice">
        <p>
          <strong>🚨 Beta Access Required:</strong> To unlock all features, you'll need beta access. Send an email to <a class="link" href="mailto:support@osmynt.dev">support@osmynt.dev</a> with subject "Beta Access Request" and your GitHub profile link.
        </p>
      </div>
      <h3>📋 Ready to get started?</h3>
      <ul>
        <li>
          <strong>Install the Extension:</strong> Download from <a class="link" href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">VS Code Marketplace</a> or <a class="link" href="https://open-vsx.org/extension/osmynt/osmynt">Open VSX Registry</a>
        </li>
        <li>
          <strong>Sign In:</strong> Open Command Palette ("Ctrl+Shift+P" / "Cmd+Shift+P") and run "Osmynt: Login"
        </li>
        <li>
          <strong>Authenticate:</strong> Sign in with your GitHub account
        </li>
        <li>
          <strong>Request Beta Access:</strong> Email us for beta access to unlock all features
        </li>
        <li>
          <strong>Start Sharing:</strong> Select code and run "Osmynt: Share Code Block"
        </li>
      </ul>
      <p class="cta">
        <a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt" class="btn">
          <span class="btn-text">🚀 Install Osmynt Extension</span>
        </a>
      </p>
      <div class="highlight">
        <p>
          <strong>💡 Perfect for:</strong> Pair programming, code reviews, debugging sessions, sharing environment variables, API keys, and knowledge sharing with your team.
        </p>
      </div>
      <p>If you have any questions or need help getting started, just reply to this email - we're here to assist!</p>
      <p>Thank you for joining us on this journey. Let's build something amazing together! 🚀</p>
      <p>Best regards, <br>
        <strong>Moeen Mahmud</strong>
        <br>Founder, Osmynt
      </p>
      <div class="footer">
        <p>Follow us for updates and sneak peeks:</p>
        <div class="social-links">
          <a href="https://twitter.com/moeen_mahmud">Twitter</a> • <a href="https://github.com/moeen-mahmud/osmynt">GitHub</a> • <a href="mailto:support@osmynt.dev">Support</a>
        </div>
      </div>
    </div>
  </body>
</html>
`;
