import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Add logging
app.use('*', logger(console.log));

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check
app.get('/make-server-4c0d39e6/health', (c) => {
  return c.json({ status: 'ok', message: 'MetaDIA server is running' });
});

// Auth routes
app.post('/make-server-4c0d39e6/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with admin privileges to auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store if needed
    if (data.user) {
      await kv.set(`user:${data.user.id}`, JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0],
        provider: 'email',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }));
    }

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'User created successfully'
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// MetaMask authentication
app.post('/make-server-4c0d39e6/auth/metamask', async (c) => {
  try {
    const { walletAddress, message, signature } = await c.req.json();

    if (!walletAddress || !message || !signature) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // In a real implementation, you would verify the signature here
    // For this demo, we'll proceed with creating/updating the user
    
    // Check if user already exists
    let existingUser = await kv.get(`wallet:${walletAddress}`);
    
    if (existingUser) {
      // Update last login
      const userData = JSON.parse(existingUser);
      userData.last_login = new Date().toISOString();
      await kv.set(`user:${userData.id}`, JSON.stringify(userData));
      await kv.set(`wallet:${walletAddress}`, userData.id);
      
      // Create session for existing user
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: `${walletAddress}@metamask.local`,
        options: {
          data: {
            wallet_address: walletAddress,
            provider: 'metamask'
          }
        }
      });

      if (error) {
        console.log('MetaMask session error:', error);
        return c.json({ error: 'Failed to create session' }, 400);
      }

      return c.json({ success: true, message: 'Logged in successfully' });
    } else {
      // Create new user
      const userId = crypto.randomUUID();
      const userData = {
        id: userId,
        wallet_address: walletAddress,
        provider: 'metamask',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      // Create user in Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email: `${walletAddress}@metamask.local`,
        user_metadata: {
          wallet_address: walletAddress,
          provider: 'metamask',
          name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        },
        email_confirm: true
      });

      if (error) {
        console.log('MetaMask user creation error:', error);
        return c.json({ error: 'Failed to create user' }, 400);
      }

      // Store in KV
      if (data.user) {
        userData.id = data.user.id;
        await kv.set(`user:${data.user.id}`, JSON.stringify(userData));
        await kv.set(`wallet:${walletAddress}`, data.user.id);
      }

      return c.json({ 
        success: true, 
        user: data.user,
        message: 'User created and logged in successfully'
      });
    }

  } catch (error) {
    console.log('MetaMask auth error:', error);
    return c.json({ error: 'Internal server error during MetaMask authentication' }, 500);
  }
});

// Get user profile
app.get('/make-server-4c0d39e6/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid access token' }, 401);
    }

    // Get additional user data from KV store
    const userData = await kv.get(`user:${user.id}`);
    const parsedUserData = userData ? JSON.parse(userData) : {};

    return c.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      user_metadata: user.user_metadata,
      ...parsedUserData
    });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Test route
app.get('/make-server-4c0d39e6/test', (c) => {
  return c.json({ message: 'MetaDIA server test successful!' });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

Deno.serve(app.fetch);