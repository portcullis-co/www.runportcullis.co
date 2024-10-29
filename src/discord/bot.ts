import { Client, Events, TextChannel } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const client = new Client({ 
  intents: ['Guilds', 'GuildMembers', 'GuildInvites'] 
});

// Function to get invite data from Supabase
async function getUserInviteData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching invite data:', error);
    return null;
  }

  return data;
}

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const userInvite = await getUserInviteData(member.user.id);
    
    if (userInvite) {
      // Add role to user
      await member.roles.add(userInvite.role_id);
      
      // Get channel and ensure it's a text channel
      const channel = member.guild.channels.cache.find(
        ch => ch.name === userInvite.company_slug
      );
      
      if (channel && channel instanceof TextChannel) {
        // Add user to channel
        await channel.permissionOverwrites.create(member, {
          ViewChannel: true,
          SendMessages: true
        });
      }
    }
  } catch (error) {
    console.error('Error handling new member:', error);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN); 