import { supabase } from '../lib/supabase';

export const debugSupabaseConnection = async () => {
  console.log('🔍 Debug: Testing Supabase connection...');
  
  // Check environment variables
  console.log('📋 Environment variables:');
  console.log('SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('todos').select('*').limit(1);

    if (error) {
      console.error('❌ Supabase connection error:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Total todos in database:', data);
    
    // Test current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return { success: false, error: sessionError };
    }
    
    if (session?.user) {
      console.log('👤 Current user:', session.user.email);
      console.log('🆔 User ID:', session.user.id);
      
      const { data: userTodos, error: userTodosError } = await supabase
        .from('todos')
        .select('*');
      
      if (userTodosError) {
        console.error('❌ User todos error:', userTodosError);
        return { success: false, error: userTodosError };
      }
      
      console.log('📝 User todos found:', userTodos?.length || 0);
      console.log('📋 User todos:', userTodos);
      
      return { success: true, userTodos, totalCount: data };
    } else {
      console.log('❌ No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
};
