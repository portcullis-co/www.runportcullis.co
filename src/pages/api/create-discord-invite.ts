import { Client, GuildChannel, TextChannel } from 'discord.js';
import { prominent } from 'color.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );

const client = new Client({ 
  intents: ['Guilds', 'GuildMembers', 'GuildInvites'] 
});

const DISCORD_TOKEN = import.meta.env.DISCORD_BOT_TOKEN;
const GUILD_ID = import.meta.env.DISCORD_GUILD_ID;

client.login(DISCORD_TOKEN);

export async function POST({ request }: { request: Request }) {
  const { email } = await request.json();
  
  // Extract domain and company name
  const domain = email.split('@')[1];
  const companySlug = domain.split('.')[0];
  const companyName = companySlug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    // Create or find channel
    let channel = guild.channels.cache.find(
      ch => ch.name === companySlug
    ) as TextChannel;

    if (!channel) {
      channel = await guild.channels.create({
        name: companySlug,
        type: 0, // Text Channel
      });
    }

    // Create or find role
    let role = guild.roles.cache.find(r => r.name === companyName);
    
    if (!role) {
      // Get company logo and colors
      const logoUrl = `https://logo.dev/api/logo/${domain}`;
      const colors = await prominent(logoUrl, { amount: 1, format: 'hex' });
      const roleColor = typeof colors[0] === 'string' ? colors[0].replace('#', '') : colors[0].toString(16);

      role = await guild.roles.create({
        name: companyName,
        color: parseInt(roleColor, 16),
        reason: 'Company role for ' + companyName
      });
    }

    // Create invite
    const invite = await channel.createInvite({
      maxAge: 86400, // 24 hours
      maxUses: 1,
      unique: true
    });

    // Store email and role association in Supabase
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({
        email,
        domain,
        invite_code: invite.code,
        role_id: role.id,
      }, {
        onConflict: 'email'
      });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({
      inviteUrl: `https://discord.gg/${invite.code}`
    }));

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to create Discord invite' }),
      { status: 500 }
    );
  }
} 